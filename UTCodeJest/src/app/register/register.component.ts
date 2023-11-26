import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

declare const $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  // Form fields
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  utEid: string = '';
  passwordMismatch: boolean = false;
  errorMessage: string = '';
  profileImage: any;
  base64String: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  onSignUp(event: any) {
    event.preventDefault();

    console.log('Sign Up button clicked!');
    if (this.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return; // Exit the function early if passwords don't match
    }

    const fileInput = event.target?.querySelector('#profileImage');
    if (fileInput && fileInput.files.length > 0) {
      console.log();

      this.profileImage = fileInput.files[0];
    }

    this.convertToBase64(this.profileImage);
    let userData: any;
    setTimeout(() => {
      userData = {
        name: this.name,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
        utEid: this.utEid,
        profileImage: this.base64String,
      };

      console.log(userData);
      this.http.post('http://localhost:5001/api/users', userData).subscribe(
        (response) => {
          console.log(response);
          this.userService.setUser(userData);
          // Handle success - maybe navigate the user or display a success message
          this.showSuccessModal();
        },
        (error) => {
          console.error(error);
          // Handle error - maybe display an error message to the user
          if (error.status === 400) {
            console.log('Is 400 error');

            // Handle 400 error
            if (error.error && Array.isArray(error.error.errors)) {
              // If the error contains a list of errors, display the first one (or all if needed)
              if (error.error.errors.length == 1) {
                this.errorMessage += error.error.errors[0].msg;
              } else {
                for (let text of error.error.errors) {
                  this.errorMessage += text.msg + '; ';
                }
              }
              this.showErrorModal();
            } else {
              // Generic error message for bad request
              this.errorMessage =
                'Failed to register. Please check your details and try again.';
              this.showErrorModal();
            }
          } else if (error.status === 500) {
            // Handle 500 error
            this.errorMessage =
              'Server error occurred. Please try again later.';
            this.showErrorModal();
          } else {
            console.error(error);
          }
        }
      );
    }, 1000);
  }

  showErrorModal() {
    // Use Bootstrap's modal function to show the modal
    $('#errorModal').modal('show');
    // $('#errorModal').on('hidden.bs.modal', () => {
    //   this.errorMessage = "";
    // });
  }

  showSuccessModal() {
    // Use Bootstrap's modal function to show the modal
    $('#successModal').modal('show');
  }

  closeSuccessModal() {
    $('#successModal').modal('hide');
    this.router.navigate(['/home']);
  }

  closeErrorModal() {
    $('#errorModal').modal('hide');
  }

  convertToBase64(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.base64String = reader.result as string;
        resolve();
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  }
}
