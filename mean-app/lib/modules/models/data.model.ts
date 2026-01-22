export interface IData {
    title: string;
    text: string;
    image: string;
    category?: string;
    authorId?: string;
    authorName?: string;
    likes?: number;
    likedBy?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IPost extends IData {
    _id?: string;
}

export type Query<T> = {
    [key: string]: T;
};