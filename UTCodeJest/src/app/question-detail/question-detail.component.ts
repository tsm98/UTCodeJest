import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { PostService } from '../post.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css'],
})
export class QuestionDetailComponent {
  currPost: any;

  isLiked: any;
  totalLikes: any;
  userComment = ''; // For the new comment input by the user
  comments: any; // Initialize as an empty array
  currUser: any;
  userPosts: any;
  allPosts: any;
  followedQuestion: any = [];
  topPosts: any;

  constructor(
    private postService: PostService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private el: ElementRef,

    private router: Router
  ) {}

  ngOnInit() {
    this.currPost = this.postService.getPost();
    this.comments = this.currPost.comment;
    console.log(this.currPost);
    this.totalLikes = this.currPost.likes.length;
    this.currUser = this.userService.getUser();

    if (
      this.currPost.likes.filter((like: any) => like === this.currUser?.email)
        .length === 0
    ) {
      this.isLiked = false;
    } else {
      this.isLiked = true;
    }

    this.getUserPosts();
    this.getAllPosts(this.currUser);
  }

  getUserPosts() {
    let userData = {
      user: this.currUser,
    };
    this.http
      .post(
        'https://nutritious-flax-squid.glitch.me/api/posts/getUserPosts',
        userData
      )
      .subscribe(
        (response) => {
          console.log(response);
          this.userPosts = response;
          // Handle success - maybe navigate the user or display a success message
        },
        (error) => {
          console.error(error);
          // Handle error - maybe display an error message to the user
        }
      );
  }

  ngAfterViewInit(): void {
    this.createLikeIcon();
  }

  getAllPosts(userForPosts: any) {
    this.http
      .post(
        'https://nutritious-flax-squid.glitch.me/api/posts/getAllPosts',
        userForPosts
      )
      .subscribe(
        (response) => {
          this.allPosts = response;
          this.topPosts = this.allPosts.reverse().slice(0, 3);
          console.log(this.topPosts);
          this.allPosts.forEach((post: any) => {
            for (let comment of post.comment) {
              if (comment.user.email == this.currUser.email) {
                // Check if post is already in followedQuestion
                const isAlreadyFollowed = this.followedQuestion.some(
                  (followedPost: { _id: any }) => followedPost._id === post._id
                );

                // If not already followed, push to followedQuestion
                if (!isAlreadyFollowed) {
                  this.followedQuestion.push(post);
                }
              }
            }
          });
        },
        (error) => {
          console.error(error);
        }
      );
  }

  toggleLike(): void {
    this.isLiked = !this.isLiked;
    this.createLikeIcon();

    if (this.isLiked) {
      console.log('liked');

      const userDetails = this.userService.getUser();

      // Create a new comment object with text and order number
      const newLike = {
        user: userDetails,

        postId: this.currPost._id,
      };

      this.http
        .post('https://nutritious-flax-squid.glitch.me/api/posts/like', newLike)
        .subscribe(
          (response) => {
            console.log(response);
            this.totalLikes = Object.entries(response).length;
          },
          (error) => {
            console.error(error);
            // Handle error - maybe display an error message to the user
          }
        );
    } else {
      console.log('unliked');

      const userDetails = this.userService.getUser();

      // Create a new comment object with text and order number
      const newUnlike = {
        user: userDetails,
        postId: this.currPost._id,
      };

      this.http
        .post(
          'https://nutritious-flax-squid.glitch.me/api/posts/unlike',
          newUnlike
        )
        .subscribe(
          (response) => {
            console.log(response);
            this.totalLikes = Object.entries(response).length;
          },
          (error) => {
            console.error(error);
            // Handle error - maybe display an error message to the user
          }
        );
    }
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
            this.getUserPosts();
            this.getAllPosts(this.currUser);
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
    if (fileBase64) {
      if (fileBase64.startsWith('data:image')) {
        return 'image';
      } else if (fileBase64.startsWith('data:application/pdf')) {
        return 'pdf';
      } else if (fileBase64.startsWith('data:text/plain')) {
        return 'text';
      }
      return 'unknown';
    }

    return '';
  }

  sanitizedUrl(fileBase64: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(fileBase64);
  }

  createLikeIcon(): void {
    // Clear the current icon
    const container = this.el.nativeElement.querySelector('#likeIconContainer');
    container.innerHTML = '';

    // Create the new icon
    const icon = this.renderer.createElement('i');
    const iconClass = this.isLiked
      ? 'fa-solid fa-thumbs-up'
      : 'fa-regular fa-thumbs-up';
    icon.classList.add('fa', ...iconClass.split(' '));

    // Append the new icon to the container
    this.renderer.appendChild(container, icon);
  }

  viewPost(post: any) {
    console.log(post);

    this.postService.setPost(post);
    this.router.navigate(['/question-detail']);
    window.location.reload();
  }
}
