import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements AfterViewInit {
  activeLink: string = '';
  profileSearchQuery: string = '';
  questionActive: any;
  forumActive: any;
  profileActive: any;
  constructor(private router: Router, private userService: UserService) {}
  route: any;
  userDetails: any;
  userImage: any;

  ngOnInit() {
    this.userDetails = this.userService.getUser();
    console.log(this.userDetails);
    this.userImage = this.userDetails.profileImage;
  }

  ngAfterViewInit() {
    this.onClickRoute();
  }

  onClickRoute() {
    this.route = this.router.url;

    if (this.router.url === '/question') {
      this.questionActive = true;
      this.forumActive = false;
    }
    if (this.router.url === '/forum') {
      this.forumActive = true;
      this.questionActive = false;
    }
    if (this.router.url === '/profile') {
      this.profileActive = true;
      this.profileActive = false;
    }
  }

  logout() {
    this.userService.setUser({});
  }
}
