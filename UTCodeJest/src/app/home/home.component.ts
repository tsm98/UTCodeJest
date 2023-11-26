import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { PostService } from '../post.service';

declare const $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  postTitle = '';
  postDescription = '';
  postTags = '';
  selectedFiles: FileList | null = null;
  selectedMedia: FileList | null = null;
  modal: any;
  dropdown: any; // Declare the modal property
  base64String: any;
  userEmail: any;
  allPosts: any;
  userForPosts: any;
  userPosts: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    console.log(this.userService.getUser());
    let userDetails = this.userService.getUser();
    this.userEmail = this.userService.getUser()?.email;

    this.userForPosts = {
      email: this.userEmail,
    };

    this.getAllPosts(this.userForPosts);

    let userData = {
      email: userDetails?.email,
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
  }

  getAllPosts(userForPosts: any) {
    this.http
      .post('http://localhost:5001/api/posts/getAllPosts', userForPosts)
      .subscribe(
        (response) => {
          console.log(response);
          this.allPosts = response;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  onFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFiles = fileList;
    }
  }

  onMediaChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedMedia = fileList;
    }
  }

  convertToBase64(files: FileList | null) {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.base64String = reader.result;
        console.log(this.base64String);

        // Now you can send this base64String to your backend and store it in MongoDB
      };
      reader.onerror = (error) => {
        // Handle the error scenario
        console.error('Error reading file:', error);
      };
    }
  }

  submitPost() {
    // Here you will handle the form submission.
    // This typically involves preparing the data and sending it to a backend server.
    this.convertToBase64(this.selectedFiles);

    setTimeout(() => {
      const userData = {
        postTitle: this.postTitle,
        postDescription: this.postDescription,
        postTags: this.postTags.split(','),
        file: this.base64String?.toString(),
        userEmail: this.userEmail,
      };
      console.log(userData.file);

      this.http.post('http://localhost:5001/api/posts', userData).subscribe(
        (response) => {
          console.log(response);
          this.closePostModal();
          this.showSuccessModal();
          this.getAllPosts(this.userForPosts);
        },
        (error) => {
          console.error(error);
        }
      );
    }, 1000);
  }

  // Existing methods for modal handling...
  clickQuestion() {
    $('#modal-container').show();
    this.modal = document.getElementById('AskQuestionModal');
    this.modal.style.display = 'block';
  }

  closeQuestion() {
    this.modal.style.display = 'none';
  }

  clickDiscussion() {
    this.modal = document.getElementById('CreateDiscussionModal');
    this.modal.style.display = 'block';
  }

  closeDiscussion() {
    this.modal.style.display = 'none';
  }
  isMenuOpened: boolean = false;
  myFunction() {
    this.dropdown = document.getElementById('myDropdown');
    this.isMenuOpened = !this.isMenuOpened;
  }
  //closeDropdown() {
  //this.dropdown.style.display = "none";
  // }//

  closePostModal() {
    document.getElementById('AskQuestionModal')?.remove();
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

  handleFileClick(fileBase64: string, event: any): void {
    event.stopPropagation();
    // Attempt to extract MIME type from base64 data
    const mimeTypeMatch = fileBase64.match(
      /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
    );
    if (mimeTypeMatch && mimeTypeMatch.length > 1) {
      const mimeType = mimeTypeMatch[1];
      if (mimeType.startsWith('image/')) {
        // Handle image
        this.openImageInNewTab(fileBase64, event);
      } else if (mimeType === 'application/pdf') {
        // Handle PDF
        this.openPdfInNewTab(fileBase64, event);
      } else {
        // Handle other file types, e.g., download
        this.downloadFile(fileBase64, mimeType, event);
      }
    } else {
      // If MIME type is not found, prompt for download with a generic MIME type
      this.downloadFile(fileBase64, 'application/octet-stream', event);
    }
  }

  openImageInNewTab(fileBase64: string, event: any): void {
    event.stopPropagation();
    const image = new Image();
    image.src = fileBase64;
    const w = window.open('');
    w?.document.write(image.outerHTML);
  }

  openPdfInNewTab(fileBase64: string, event: any): void {
    event.stopPropagation();
    const pdfWindow = window.open('');
    pdfWindow?.document.write(
      `<iframe width='100%' height='100%' src='${fileBase64}'></iframe>`
    );
  }

  downloadFile(fileBase64: string, mimeType: string, event: any): void {
    event.stopPropagation();
    const link = document.createElement('a');
    link.href = fileBase64;
    link.download = 'download'; // You can give a default filename here
    link.click();
  }

  viewPost(post: any) {
    console.log(post);

    this.postService.setPost(post);
    this.router.navigate(['/question-detail']);
  }

  getFileName(fileBase64: string): string {
    // Check if the fileBase64 string is not empty
    if (!fileBase64) {
      return 'No file';
    }

    // Regular expression to match the MIME type pattern in the base64 string
    const mimeTypePattern = /^data:(\w+\/[\w-+.]+);base64,/;

    // Extracting MIME type using the pattern
    const match = fileBase64.match(mimeTypePattern);

    if (match && match[1]) {
      // If a MIME type is found, return it
      return match[1];
    } else {
      // Return a default or placeholder text if MIME type is not found
      return 'Unknown file type';
    }
  }
}
