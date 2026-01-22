import { IPost, Query } from "../models/data.model";
import PostModel from "../schemas/data.schema";

class DataService {
    public async createPost(postParams: IPost) {
        try {
            const dataModel = new PostModel(postParams);
            return await dataModel.save();
        } catch (error) {
            console.error(error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async getAll() {
        return await PostModel.find({}, { __v: 0 });
    }

    public async query(query: Query<number | string | boolean>) {
        try {
            return await PostModel.find(query, { __v: 0 });
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async deleteData(query: Query<number | string | boolean>) {
        try {
            await PostModel.deleteMany(query);
        } catch (error) {
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }

    public async getById(id: string) {
        return await PostModel.findById(id, { __v: 0 });
    }

    public async deleteById(id: string) {
        await PostModel.findByIdAndDelete(id);
    }

    public async deleteAllPosts() {
        await PostModel.deleteMany({});
    }

    public async updatePost(id: string, updateData: Partial<IPost>) {
        try {
            return await PostModel.findByIdAndUpdate(
                id, 
                updateData, 
                { new: true, runValidators: true }
            );
        } catch (error) {
            console.error('Update error:', error);
            throw new Error('Wystąpił błąd podczas aktualizacji posta');
        }
    }
}

export default DataService;