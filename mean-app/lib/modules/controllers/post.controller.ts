import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../../interfaces/controller.interface';
import DataService from '../services/data.service';
// Zakładam, że ten middleware masz, jeśli nie - usuń ten import i jego użycie z routera
import { checkPostCount } from '../../middlewares/checkPostCount.middleware';

class PostController implements Controller {
    public path = '/api/posts';
    public router = Router();
    private dataService = new DataService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Upewnij się, że checkPostCount istnieje. Jeśli wywala błąd, usuń go stąd.
        this.router.post('/:num', checkPostCount, this.getPostByNumTest);
        
        this.router.post('/', this.addData);
        this.router.get('/', this.getAllPosts);
        this.router.get('/:id', this.getElementById);
        this.router.delete('/all', this.removeAllPosts);
        this.router.delete('/:id', this.removePost);
    }

    private getPostByNumTest = (request: Request, response: Response) => {
        response.status(200).json({ message: `Walidacja OK. Liczba: ${request.params.num}` });
    }

    private addData = async (request: Request, response: Response) => {
        const { title, text, image, category } = request.body;
        
        if (!title || !text || !image) {
             return response.status(400).json({error: 'Wymagane pola: title, text, image'});
        }

        try {
            // POPRAWKA: Przypisujemy wynik do zmiennej savedPost
            const savedPost = await this.dataService.createPost({ title, text, image, category: category || 'General' });
            
            // POPRAWKA: Zwracamy to co baza zapisała (wraz z _id), a nie dane wejściowe
            response.status(200).json(savedPost);
        } catch (error) {
            console.error('Błąd dodawania:', error);
            response.status(400).json({ error: 'Błąd dodawania do bazy' });
        }
    }

    private getAllPosts = async (request: Request, response: Response) => {
        try {
            const allData = await this.dataService.getAll();
            response.status(200).json(allData);
        } catch (error) {
            response.status(500).json({ error: 'Server error' });
        }
    }

    private getElementById = async (request: Request, response: Response) => {
        const { id } = request.params;
        try {
            const post = await this.dataService.getById(id);
            if(post) response.status(200).json(post);
            else response.status(404).json({message: 'Not found'});
        } catch (error) {
            response.status(500).json({ error: 'Server error' });
        }
    }

    private removePost = async (request: Request, response: Response) => {
        const { id } = request.params;
        try {
            await this.dataService.deleteById(id);
            response.status(200).json({ message: "Deleted" });
        } catch (error) {
            response.status(500).json({ error: 'Server error' });
        }
    };

    private removeAllPosts = async (request: Request, response: Response) => {
        try {
            await this.dataService.deleteAllPosts();
            response.status(200).json({ message: "All posts deleted" });
        } catch (error) {
            response.status(500).json({ error: 'Server error' });
        }
    }
}

export default PostController;