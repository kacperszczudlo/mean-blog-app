import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config';
import Controller from './interfaces/controller.interface';
import { loggerMiddleware } from './middlewares/log.middleware';
// Upewnij się, że ta ścieżka do DataSchema jest poprawna w Twojej strukturze plików!
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
            console.log('Connection with database established');
            
            // Tutaj uruchamiamy funkcję dodającą dane
            await this.populateDatabase();

        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
        
        process.on('SIGINT', async () => {
             await mongoose.connection.close();
             process.exit(0);
        });
    }

    private async populateDatabase(): Promise<void> {
        try {
            const count = await PostModel.countDocuments();
            
            // ZMIANA TUTAJ:
            // Jeśli postów jest 0 LUB 1 (ten Twój), to dodajemy resztę.
            // Dzięki temu nie zdublujemy danych, gdy będzie ich już np. 5.
            if (count <= 1) {
                console.log('Mało postów w bazie. Dodaję przykładowe dane...');
                
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
                console.log('Przykładowe dane zostały dodane!');
            } else {
                console.log('Baza jest już pełna, pomijam dodawanie.');
            }
        } catch (error) {
            console.error('Błąd podczas seedowania bazy:', error);
        }
    }
    
    public listen(): void {
        this.app.listen(config.port, () => {
            console.log(`App listening on the port ${config.port}`);
        });
    }
}

export default App;