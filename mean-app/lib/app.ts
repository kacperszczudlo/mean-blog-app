import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config';
import Controller from './interfaces/controller.interface';
import { loggerMiddleware } from './middlewares/log.middleware';
import PostModel from './modules/schemas/data.schema'; 

class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.connectToDatabase();
    }
    
    private initializeMiddlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(loggerMiddleware);
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router); 
        });
    }

    private async connectToDatabase(): Promise<void> {
        try {
            await mongoose.connect(config.databaseUrl);
            await this.populateDatabase();

        } catch (error) {
        }
        
        process.on('SIGINT', async () => {
             await mongoose.connection.close();
             process.exit(0);
        });
    }

    private async populateDatabase(): Promise<void> {
        try {
            const count = await PostModel.countDocuments();
            
            if (count <= 1) {
                const initialPosts = [
                    {
                        title: 'Malownicze Góry',
                        text: 'Spójrzcie na ten niesamowity widok Tatr o poranku. Coś pięknego!',
                        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba'
                    },
                    {
                        title: 'Zachód słońca',
                        text: 'Relaks na plaży przy zachodzie słońca to najlepszy odpoczynek.',
                        image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e'
                    },
                    {
                        title: 'Nowe technologie',
                        text: 'Angular i Node.js to potężne połączenie do tworzenia aplikacji.',
                        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475'
                    },
                    {
                        title: 'Kawa o poranku',
                        text: 'Nie ma to jak świeża kawa na rozpoczęcie dnia kodowania.',
                        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'
                    }
                ];

                await PostModel.insertMany(initialPosts);
            }
        } catch (error) {
        }
    }
    
    public listen(): void {
        this.app.listen(config.port);
    }
}

export default App;