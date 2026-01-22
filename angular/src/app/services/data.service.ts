import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(this.url + '/posts');
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

  likePost(id: string, userId: string) {
    return this.http.post(this.url + '/posts/' + id + '/like', { userId });
  }

  unlikePost(id: string, userId: string) {
    return this.http.post(this.url + '/posts/' + id + '/unlike', { userId });
  }
}