import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { PostService } from '../post.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent {
  allPosts: any;
  currUser: any;
  currPost: any;
  followedQuestion: any = [];
  userPosts: any;
  selectedFiles: FileList | null = null;
  selectedMedia: FileList | null = null;
  fileNames: any;

  base64String: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.currPost = this.postService.getPost();
    this.currUser = this.userService.getUser();
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

    this.getAllPosts(this.currUser);
  }

  viewPost(post: any) {
    console.log(post);

    this.postService.setPost(post);
    this.router.navigate(['/question-detail']);
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
              if (comment.user.email == this.currUser.email) {
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

  onFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFiles = fileList;
      this.fileNames = Array.from(this.selectedFiles).map((file) => file.name);
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
