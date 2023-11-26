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
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private postService: PostService,
    private router: Router
  ) {}
  userDetails: any;
  profileImage: any;
  userPosts: any;
  allUsers: any;

  ngOnInit(): void {
    this.userDetails = this.userService.getUser();
    // console.log(this.userDetails);
    this.profileImage = this.userDetails.profileImage;
    console.log(this.profileImage);

    let userData = {
      email: this.userDetails.email,
    };

    this.http
      .post('http://localhost:5001/api/posts/getUserPosts', userData)
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

    this.http.get('http://localhost:5001/api/auth/getAllUsers').subscribe(
      (response) => {
        console.log(response);
        this.allUsers = response;
        this.allUsers = this.allUsers.slice(0, 2);
        // Handle success - maybe navigate the user or display a success message
      },
      (error) => {
        console.error(error);
        // Handle error - maybe display an error message to the user
      }
    );
  }

  viewPost(post: any) {
    console.log(post);

    this.postService.setPost(post);
    this.router.navigate(['/question-detail']);
  }
}
