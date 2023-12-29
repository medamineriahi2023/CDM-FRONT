import { Injectable } from '@angular/core';
import {ApiQueryParams} from "../../models/apis/api-query-params";
import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {FileBlob} from "../../models/entities/FileBlob";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }



  get(id: number, params?: ApiQueryParams):  Observable<HttpResponse<Blob>>  {
    return this.http.get<Blob>(`http://localhost:8081/file/download/${id}`, { responseType: 'blob' as 'json', observe: 'response' });
  }

  importFile(file : File): Observable<HttpResponse<FileBlob>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<HttpResponse<FileBlob>>("http://localhost:8081/file/upload", formData);
  }
}
