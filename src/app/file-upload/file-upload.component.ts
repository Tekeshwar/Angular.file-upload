import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  private fileToUpload: File = null;
  percentDone:Number = 0;
  progressDisplay = true;
  uploadComplete = false;

  constructor(private fileUploadService: FileUploadService) { 
  }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadFileToActivity() {
    this.fileUploadService.postFile(this.fileToUpload).subscribe(
      event => {
          this.progressDisplay = true;
        if (event.type == HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * event.loaded / event.total);
          console.log(`File is ${this.percentDone}% loaded.`);
        } else if (event instanceof HttpResponse) {
          console.log('File is completely loaded!');
        }
      },
      (err) => {
        console.log("Upload Error:", err);
      }, () => {
        this.uploadComplete = true;
        console.log("Upload done");
      }
    )
  }

  getUploadProgress() {
    return this.percentDone;
  }

}