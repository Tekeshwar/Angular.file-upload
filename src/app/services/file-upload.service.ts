import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  HttpClient,
  HttpHeaders,
  HttpEventType,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
  HttpParams,
} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

export enum FileQueueStatus {
  Pending,
  Success,
  Error,
  Progress,
}

export class FileQueueObject {
  public file: any;
  public status: FileQueueStatus = FileQueueStatus.Pending;
  public progress: number = 0;
  public request: Subscription = null;
  public response: HttpResponse<any> | HttpErrorResponse = null;

  constructor(file: any) {
    this.file = file;
  }

  // actions
  public upload = () => {
    /* set in service */
  };
  public cancel = () => {
    /* set in service */
  };
  public remove = () => {
    /* set in service */
  };

  // statuses
  public isPending = () => this.status === FileQueueStatus.Pending;
  public isSuccess = () => this.status === FileQueueStatus.Success;
  public isError = () => this.status === FileQueueStatus.Error;
  public inProgress = () => this.status === FileQueueStatus.Progress;
  public isUploadable = () =>
    this.status === FileQueueStatus.Pending ||
    this.status === FileQueueStatus.Error;
}

@Injectable()
export class FileUploadService {
  private endpoint = 'https://chs-dev.getsandbox.com/file-upload';
  private _queue: BehaviorSubject<FileQueueObject[]>;
  private _files: FileQueueObject[] = [];

  constructor(private http: HttpClient) {
    this._queue = <BehaviorSubject<FileQueueObject[]>>(
      new BehaviorSubject(this._files)
    );
  }

  public postFile(fileToUpload: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('upload', fileToUpload, fileToUpload.name);
    let params = new HttpParams();
    // let headers = new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   });
    // alternate way of setting headers.
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {
      headers: headers,
      params: params,
      reportProgress: true,
    };
    const req = new HttpRequest('POST', this.endpoint, formData, options);
    return this.http.request(req);
  }

  handleError(e: any) {}
}
