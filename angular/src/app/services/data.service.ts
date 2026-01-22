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

  getById(id: string) {
    return this.http.get(this.url + '/posts/' + id);
  }
}