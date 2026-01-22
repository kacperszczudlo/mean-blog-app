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
    likedBy: [{ type: String }]
}, { timestamps: true });

export default model<IData>('Post-KK', DataSchema);