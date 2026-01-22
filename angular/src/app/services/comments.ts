import { Injectable } from '@angular/core';

export interface Comment {
  postId: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private comments: Comment[] = [];

  constructor() { }

  addComment(postId: string, text: string) {
    this.comments.push({ postId, text });
  }

  getCommentsByPostId(postId: string) {
    return this.comments.filter(c => c.postId === postId);
  }
}