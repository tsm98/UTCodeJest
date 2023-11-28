import { Component } from '@angular/core';
import { PostService } from '../post.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css'],
})
export class QuestionDetailComponent {
  currPost: any;

  isLiked: boolean = true;
  likeCount: number = 0;

  userComment = ''; // For the new comment input by the user
  comments: any; // Initialize as an empty array

  constructor(
    private postService: PostService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.currPost = this.postService.getPost();
    this.comments = this.currPost.comment;
    console.log(this.currPost);
  }

  addComment(): void {
    const userDetails = this.userService.getUser();
    if (this.userComment.trim()) {
      // Create a new comment object with text and order number
      const newComment = {
        text: this.userComment,
        user: userDetails,
        name: userDetails?.name,
        postId: this.currPost._id,
        likes: 0,
      };

      this.http
        .post(
          'https://nutritious-flax-squid.glitch.me/api/posts/comment',
          newComment
        )
        .subscribe(
          (response) => {
            console.log(response);

            this.comments = response;
            // Handle success - maybe navigate the user or display a success message
            // this.showSuccessModal();
          },
          (error) => {
            console.error(error);
            // Handle error - maybe display an error message to the user
          }
        );

      // Add the new comment to the beginning of the comments array

      this.userComment = '';
    }
  }

  getFileType(fileBase64: string): string {
    if (fileBase64.startsWith('data:image')) {
      return 'image';
    } else if (fileBase64.startsWith('data:application/pdf')) {
      return 'pdf';
    } else if (fileBase64.startsWith('data:text/plain')) {
      return 'text';
    }
    return 'unknown';
  }

  sanitizedUrl(fileBase64: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(fileBase64);
  }

  likePost() {
    const userDetails = this.userService.getUser();
    const newLike = {
      user: userDetails,
      name: userDetails?.name,
      postId: this.currPost._id,
    };
    console.log(newLike);

    this.http
      .post('https://nutritious-flax-squid.glitch.me/api/posts/like', newLike)
      .subscribe(
        (response) => {
          console.log(response);

          // this.comments = response;
          // Handle success - maybe navigate the user or display a success message
          // this.showSuccessModal();
        },
        (error) => {
          console.error(error);
          // Handle error - maybe display an error message to the user
        }
      );

    this.isLiked = !this.isLiked;
    console.log(this.isLiked);
  }
}
