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
        this.router.put('/:id', this.updatePost);
        this.router.delete('/all', this.removeAllPosts);
        this.router.delete('/:id', this.removePost);
        this.router.post('/:id/like', this.likePost);
        this.router.post('/:id/unlike', this.unlikePost);
    }

    private getPostByNumTest = (request: Request, response: Response) => {
        response.status(200).json({ message: `Walidacja OK. Liczba: ${request.params.num}` });
    }

    private addData = async (request: Request, response: Response) => {
        const { title, text, image, category, authorId, authorName } = request.body;
        
        if (!title || !text || !image) {
             return response.status(400).json({error: 'Wymagane pola: title, text, image'});
        }

        try {
            const savedPost = await this.dataService.createPost({ 
                title, 
                text, 
                image, 
                category: category || 'General',
                authorId,
                authorName
            });
            
            response.status(200).json(savedPost);
        } catch (error) {
            console.error('Błąd dodawania:', error);
            response.status(400).json({ error: 'Błąd dodawania do bazy' });
        }
    }

    private updatePost = async (request: Request, response: Response) => {
        const { id } = request.params;
        const { title, text, image, category } = request.body;
        
        try {
            const updatedPost = await this.dataService.updatePost(id, { title, text, image, category });
            if (updatedPost) {
                response.status(200).json(updatedPost);
            } else {
                response.status(404).json({ error: 'Post not found' });
            }
        } catch (error) {
            console.error('Błąd aktualizacji:', error);
            response.status(500).json({ error: 'Server error' });
        }
    }

    private likePost = async (request: Request, response: Response) => {
        const { id } = request.params;
        const { userId } = request.body;
        
        try {
            const post = await this.dataService.getById(id);
            if (!post) {
                return response.status(404).json({ error: 'Post not found' });
            }
            
            const likedBy = (post as any).likedBy || [];
            if (likedBy.includes(userId)) {
                return response.status(400).json({ error: 'Already liked' });
            }
            
            likedBy.push(userId);
            const likes = ((post as any).likes || 0) + 1;
            
            const updatedPost = await this.dataService.updatePost(id, { 
                likes, 
                likedBy 
            } as any);
            
            response.status(200).json(updatedPost);
        } catch (error) {
            console.error('Błąd polubienia:', error);
            response.status(500).json({ error: 'Server error' });
        }
    }

    private unlikePost = async (request: Request, response: Response) => {
        const { id } = request.params;
        const { userId } = request.body;
        
        try {
            const post = await this.dataService.getById(id);
            if (!post) {
                return response.status(404).json({ error: 'Post not found' });
            }
            
            const likedBy = ((post as any).likedBy || []).filter((uid: string) => uid !== userId);
            const likes = Math.max(((post as any).likes || 0) - 1, 0);
            
            const updatedPost = await this.dataService.updatePost(id, { 
                likes, 
                likedBy 
            } as any);
            
            response.status(200).json(updatedPost);
        } catch (error) {
            console.error('Błąd polubienia:', error);
            response.status(500).json({ error: 'Server error' });
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