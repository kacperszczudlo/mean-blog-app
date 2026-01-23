import { Router, Request, Response } from 'express';
import Controller from '../../interfaces/controller.interface';
import DataService from '../services/data.service';
import { checkPostCount } from '../../middlewares/checkPostCount.middleware';

class PostController implements Controller {
    public path = '/api/posts';
    public router = Router();
    private dataService = new DataService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/:num', checkPostCount, this.getPostByNumTest);
        this.router.post('/', this.addData);
        this.router.get('/', this.getAllPosts);
        this.router.delete('/all', this.removeAllPosts);
        this.router.get('/author/:authorId', this.getPostsByAuthor);
        this.router.get('/activity/:userId', this.getUserActivity);
        this.router.post('/:id/like', this.likePost);
        this.router.post('/:id/unlike', this.unlikePost);
        this.router.post('/:id/comments', this.addComment);
        this.router.post('/:id/rate', this.ratePost);
        this.router.get('/:id', this.getElementById);
        this.router.put('/:id', this.updatePost);
        this.router.delete('/:id', this.removePost);
    }

    private getPostByNumTest = (request: Request, response: Response) => {
        response.status(200).json({ message: `OK. Liczba: ${request.params.num}` });
    }

    private addData = async (request: Request, response: Response) => {
        const { title, text, image, category, authorId, authorName } = request.body;
        
        if (!title || !text || !image) {
             return response.status(400).json({error: 'Wymagane: title, text, image'});
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
            response.status(400).json({ error: 'Error adding post' });
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
            response.status(500).json({ error: 'Error updating post' });
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
            response.status(500).json({ error: 'Error liking post' });
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
            response.status(500).json({ error: 'Error unliking post' });
        }
    }

    private getAllPosts = async (request: Request, response: Response) => {
        try {
            const { q, category, sort, author, dateFrom, dateTo } = request.query;
            const filters: Record<string, any> = {};

            // Full-text-ish search across title and text (case-insensitive)
            if (q && String(q).trim()) {
                const regex = new RegExp(String(q).trim(), 'i');
                filters.$or = [{ title: { $regex: regex } }, { text: { $regex: regex } }];
            }

            // Category filter
            if (category && String(category) !== 'all') {
                filters.category = category;
            }

            // Author filter (by id or name fragment)
            if (author && String(author).trim()) {
                const authorValue = String(author).trim();
                filters.$and = [
                    ...(filters.$and || []),
                    {
                        $or: [
                            { authorId: authorValue },
                            { authorName: { $regex: new RegExp(authorValue, 'i') } }
                        ]
                    }
                ];
            }

            // Date range filter (createdAt)
            if (dateFrom || dateTo) {
                const range: Record<string, Date> = {};
                if (dateFrom) range.$gte = new Date(String(dateFrom));
                if (dateTo) range.$lte = new Date(String(dateTo));
                filters.createdAt = range;
            }

            // Sorting
            let sortField: Record<string, 1 | -1> = { createdAt: -1 };
            if (sort === 'oldest') sortField = { createdAt: 1 };
            if (sort === 'popular') sortField = { likes: -1 };
            if (sort === 'rating') sortField = { averageRating: -1 };

            const allData = await this.dataService.getAll(filters, sortField);
            response.status(200).json(allData);
        } catch (error) {
            response.status(500).json({ error: 'Error getting posts' });
        }
    }

    private getPostsByAuthor = async (request: Request, response: Response) => {
        const { authorId } = request.params;
        try {
            const posts = await this.dataService.getByAuthor(authorId);
            response.status(200).json(posts);
        } catch (error) {
            response.status(500).json({ error: 'Error getting posts' });
        }
    }

    private getUserActivity = async (request: Request, response: Response) => {
        const { userId } = request.params;
        if (!userId) {
            return response.status(400).json({ error: 'Missing userId' });
        }
        try {
            const posts: any[] = await this.dataService.getActivityForUser(userId);
            const activities: any[] = [];

            posts.forEach((post: any) => {
                const postId = post._id?.toString();
                const postTitle = post.title;
                const fallbackDate = post.updatedAt || post.createdAt;

                if (post.comments && Array.isArray(post.comments)) {
                    post.comments
                        .filter((c: any) => c.userId === userId)
                        .forEach((c: any) => {
                            activities.push({
                                type: 'comment',
                                postId,
                                postTitle,
                                createdAt: c.createdAt || fallbackDate,
                                text: c.text
                            });
                        });
                }

                if (post.ratings && Array.isArray(post.ratings)) {
                    post.ratings
                        .filter((r: any) => r.userId === userId)
                        .forEach((r: any) => {
                            activities.push({
                                type: 'rating',
                                postId,
                                postTitle,
                                createdAt: fallbackDate,
                                value: r.value
                            });
                        });
                }

                if (post.likedBy && Array.isArray(post.likedBy) && post.likedBy.includes(userId)) {
                    activities.push({
                        type: 'like',
                        postId,
                        postTitle,
                        createdAt: fallbackDate
                    });
                }
            });

            activities.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            response.status(200).json(activities);
        } catch (error) {
            response.status(500).json({ error: 'Error getting activity' });
        }
    }

    private getElementById = async (request: Request, response: Response) => {
        const { id } = request.params;
        try {
            const post = await this.dataService.getById(id);
            if(post) response.status(200).json(post);
            else response.status(404).json({message: 'Not found'});
        } catch (error) {
            response.status(500).json({ error: 'Error getting post' });
        }
    }

    private removePost = async (request: Request, response: Response) => {
        const { id } = request.params;
        try {
            await this.dataService.deleteById(id);
            response.status(200).json({ message: "Deleted" });
        } catch (error) {
            response.status(500).json({ error: 'Error deleting post' });
        }
    }

    private removeAllPosts = async (request: Request, response: Response) => {
        try {
            await this.dataService.deleteAllPosts();
            response.status(200).json({ message: "All deleted" });
        } catch (error) {
            response.status(500).json({ error: 'Error deleting posts' });
        }
    }

    private addComment = async (request: Request, response: Response) => {
        const { id } = request.params;
        const { userId, userName, text } = request.body;

        if (!userId || !userName || !text) {
            return response.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const updatedPost = await this.dataService.addComment(id, { userId, userName, text });
            response.status(200).json(updatedPost);
        } catch (error) {
            response.status(500).json({ error: 'Error adding comment' });
        }
    }

    private ratePost = async (request: Request, response: Response) => {
        const { id } = request.params;
        const { userId, value } = request.body;

        if (!userId || !value) {
            return response.status(400).json({ error: 'Missing userId or value' });
        }

        try {
            const updatedPost = await this.dataService.addOrUpdateRating(id, { userId, value });
            response.status(200).json(updatedPost);
        } catch (error) {
            response.status(500).json({ error: 'Error rating post' });
        }
    }
}

export default PostController;
