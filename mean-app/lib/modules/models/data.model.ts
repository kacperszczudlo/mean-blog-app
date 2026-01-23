export interface IData {
    title: string;
    text: string;
    image: string;
    category?: string;
    authorId?: string;
    authorName?: string;
    likes?: number;
    likedBy?: string[];
    comments?: CommentEntry[];
    ratings?: RatingEntry[];
    averageRating?: number;
    ratingsCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IPost extends IData {
    _id?: string;
}

export interface CommentEntry {
    userId: string;
    userName: string;
    text: string;
    createdAt?: Date;
}

export interface RatingEntry {
    userId: string;
    value: number;
}

export type Query<T> = {
    [key: string]: T;
};