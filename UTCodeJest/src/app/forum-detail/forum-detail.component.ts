import { Component } from '@angular/core';

@Component({
  selector: 'app-forum-detail',
  templateUrl: './forum-detail.component.html',
  styleUrls: ['./forum-detail.component.css']
})
export class ForumDetailComponent {
  userComment = ''; // For the new comment input by the user
  comments: { text: string, order: number }[] = []; // Initialize as an empty array or with your initial comments
  orderCounter = this.comments.length + 1; // Initialize the order counter to the highest value

  constructor() {}

  addComment(): void {
    if (this.userComment.trim()) {  
      // Create a new comment object with text and order number
      const newComment = {
        text: this.userComment,
        order: this.orderCounter++
      };

      // Add the new comment to the beginning of the comments array
      this.comments.unshift(newComment);

      this.userComment = '';
    }
  }  

  // ... other methods ...
}


