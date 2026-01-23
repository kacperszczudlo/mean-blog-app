import { IPost, Query } from "../models/data.model";
import PostModel from "../schemas/data.schema";

class DataService {
    public async createPost(postParams: IPost) {
        try {
            const dataModel = new PostModel(postParams);
            return await dataModel.save();
        } catch (error) {
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async getAll(filters: Record<string, any> = {}, sort: Record<string, 1 | -1> = { createdAt: -1 }) {
        return await PostModel.find(filters, { __v: 0 }).sort(sort);
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
            throw new Error('Wystąpił błąd podczas aktualizacji posta');
        }
    }

    public async addComment(id: string, comment: { userId: string; userName: string; text: string }) {
        return await PostModel.findByIdAndUpdate(
            id,
            { $push: { comments: comment } },
            { new: true, runValidators: true }
        );
    }

    public async addOrUpdateRating(id: string, rating: { userId: string; value: number }) {
        const post = await PostModel.findById(id);
        if (!post) {
            throw new Error('Post not found');
        }

        const ratings = post.ratings || [];
        const existingIndex = ratings.findIndex((r: any) => r.userId === rating.userId);

        if (existingIndex >= 0) {
            ratings[existingIndex].value = rating.value;
        } else {
            ratings.push(rating as any);
        }

        const ratingsCount = ratings.length;
        const averageRating = ratingsCount
            ? ratings.reduce((sum: number, r: any) => sum + Number(r.value), 0) / ratingsCount
            : 0;

        post.ratings = ratings as any;
        post.ratingsCount = ratingsCount;
        post.averageRating = averageRating;

        await post.save();
        return post;
    }

    public async getActivityForUser(userId: string) {
        return await PostModel.find(
            {
                $or: [
                    { 'comments.userId': userId },
                    { 'ratings.userId': userId },
                    { likedBy: userId }
                ]
            },
            {
                title: 1,
                comments: 1,
                ratings: 1,
                likedBy: 1,
                updatedAt: 1,
                createdAt: 1
            }
        );
    }

    public async getByAuthor(authorId: string) {
        return await PostModel.find({ authorId }, { __v: 0 }).sort({ createdAt: -1 });
    }
}

export default DataService;