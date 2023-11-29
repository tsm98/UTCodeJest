import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { PostService } from '../post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  allPosts: any;
  followedQuestion: any = [];
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private postService: PostService,
    private router: Router
  ) {}
  userDetails: any;
  profileImage: any;
  userPosts: any;
  allUsers: any = [];
  network: any = [];

  asked = true;
  ngOnInit(): void {
    this.userDetails = this.userService.getUser();
    // console.log(this.userDetails);
    this.profileImage = this.userDetails.profileImage;
    console.log(this.profileImage);

    let userData = {
      user: this.userDetails,
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

    this.http
      .get('https://nutritious-flax-squid.glitch.me/api/auth/getAllUsers')
      .subscribe(
        (response) => {
          console.log(response);

          this.allUsers = response;
          for (let net of this.allUsers) {
            console.log(net);

            if (net.email != this.userDetails.email) {
              this.network.push(net);
            }
          }
          this.network = this.network.splice(0, 2);
          this.allUsers = this.allUsers.slice(0, 2);
          // Handle success - maybe navigate the user or display a success message
        },
        (error) => {
          console.error(error);
          // Handle error - maybe display an error message to the user
        }
      );

    this.getAllPosts(this.userDetails);
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

          this.allPosts.filter((post: any) => {
            for (let comment of post.comment) {
              if (comment.user.email == this.userDetails.email) {
                this.followedQuestion.push(post);
                console.log(comment);
              }
            }
          });
        },
        (error) => {
          console.error(error);
        }
      );
  }

  viewPost(post: any) {
    console.log(post);

    this.postService.setPost(post);
    this.router.navigate(['/question-detail']);
  }

  toggleAsked(x: any) {
    if (x == 'a') {
      this.asked = true;
    } else {
      this.asked = false;
    }
  }
}
