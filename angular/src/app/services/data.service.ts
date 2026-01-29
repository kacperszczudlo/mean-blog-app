import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = 'https://mean-blog-app-x0di.onrender.com/api';

  constructor(private http: HttpClient) {}

  getAll(params: Record<string, any> = {}) {
    return this.http.get(this.url + '/posts', { params });
  }

  addPost(post: any) {
    return this.http.post(this.url + '/posts', post);
  }

  updatePost(id: string, post: any) {
    return this.http.put(this.url + '/posts/' + id, post);
  }

  deletePost(id: string) {
    return this.http.delete(this.url + '/posts/' + id);
  }

  getById(id: string) {
    return this.http.get(this.url + '/posts/' + id);
  }

  getByAuthor(authorId: string) {
    return this.http.get(this.url + '/posts/author/' + authorId);
  }

  getUserActivity(userId: string) {
    return this.http.get(this.url + '/posts/activity/' + userId);
  }

  likePost(id: string, userId: string) {
    return this.http.post(this.url + '/posts/' + id + '/like', { userId });
  }

  unlikePost(id: string, userId: string) {
    return this.http.post(this.url + '/posts/' + id + '/unlike', { userId });
  }

  addComment(id: string, comment: { userId: string; userName: string; text: string }) {
    return this.http.post(this.url + '/posts/' + id + '/comments', comment);
  }

  ratePost(id: string, payload: { userId: string; value: number }) {
    return this.http.post(this.url + '/posts/' + id + '/rate', payload);
  }
}