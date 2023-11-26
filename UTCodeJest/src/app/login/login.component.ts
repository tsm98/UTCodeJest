import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

declare const $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public userName: string = '';
  public password: string = '';

  public errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  loginUser() {
    const userData = {
      email: this.userName, // Assuming userName is the email
      password: this.password,
      profileImage: '', // Assuming password is the password
    };

    this.http.post('http://localhost:5001/api/auth', userData).subscribe(
      (response) => {
        console.log(response);
        this.userService.setUser(response);
        this.showSuccessModal();
      },
      (error) => {
        console.error(error);
        if (error.status === 400) {
          if (error.error && Array.isArray(error.error.errors)) {
            if (error.error.errors.length == 1) {
              this.errorMessage += error.error.errors[0].msg;
            } else {
              for (let text of error.error.errors) {
                this.errorMessage += text.msg + '; ';
              }
            }

            this.showErrorModal();
          } else {
            this.errorMessage =
              'Failed to login. Please check your details and try again.';
            this.showErrorModal();
          }
        } else if (error.status === 500) {
          this.errorMessage = 'Server error occurred. Please try again later.';
          this.showErrorModal();
        } else {
          console.error(error);
        }
      }
    );
  }

  // Placeholder methods for modal display; you might need to implement or adjust them based on your application
  showSuccessModal() {
    $('#successModal').modal('show');
  }

  showErrorModal() {
    $('#errorModal').modal('show');
  }

  closeSuccessModal() {
    $('#successModal').modal('hide');
    this.router.navigate(['/home']);
  }

  closeErrorModal() {
    $('#successModal').modal('hide');
    this.errorMessage = '';
  }
}
