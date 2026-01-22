import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Controller from '../../interfaces/controller.interface';
import UserService from '../services/user.service';
import { config } from '../../config';

class UserController implements Controller {
  public path = '/api/user';
  public router = Router();
  private userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/create', this.createUser);
    this.router.post('/auth', this.authenticate);
    this.router.delete('/logout/:id', this.logout);
    this.router.get('/me', this.me);
  }

  private createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Required: name, email, password' });
    }

    try {
      const safeUser = await this.userService.createUser({ name, email, password });
      return res.status(201).json(safeUser);
    } catch (err: any) {
      if (err.message === 'User already exists') {
        return res.status(409).json({ message: 'User already exists' });
      }
      console.error('Create user error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  private authenticate = async (req: Request, res: Response) => {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.status(400).json({ message: 'Required: login, password' });
    }

    try {
      const user = await this.userService.validateUser(login, password);
      if (!user || !user._id) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, name: user.name },
        config.jwtSecret,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ token });
    } catch (err) {
      console.error('Auth error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  private logout = async (_req: Request, res: Response) => {
    // Stateless JWT – nothing to invalidate server-side
    return res.status(200).json({ message: 'Logged out' });
  };

  private me = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) return res.status(401).json({ message: 'Missing token' });

    try {
      const decoded: any = jwt.verify(token, config.jwtSecret);
      const user = await this.userService.getById(decoded.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json(user);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

export default UserController;
