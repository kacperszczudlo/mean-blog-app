import { Schema, model } from 'mongoose';
import { IData } from "../models/data.model";

export const DataSchema: Schema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, default: 'General' },
    authorId: { type: String },
    authorName: { type: String },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }],
    comments: [
        {
            userId: { type: String, required: true },
            userName: { type: String, required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    ratings: [
        {
            userId: { type: String, required: true },
            value: { type: Number, min: 1, max: 5, required: true }
        }
    ],
    averageRating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 }
}, { timestamps: true });

export default model<IData>('Post-KK', DataSchema);