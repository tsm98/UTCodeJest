import { Injectable } from '@angular/core';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postKey = 'currentPost';
  constructor() {}

  setPost(post: Post): void {
    localStorage.setItem(this.postKey, JSON.stringify(post));
  }

  getPost(): Post | null {
    const postJson = localStorage.getItem(this.postKey);
    return postJson ? JSON.parse(postJson) : null;
  }

  clearPost(): void {
    localStorage.removeItem(this.postKey);
  }
}
