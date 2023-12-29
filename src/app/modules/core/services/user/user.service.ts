import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {MessagesModalService} from "../messages-modal.service";
import {constants} from "../../../../../environments/constants";
import {Observable} from "rxjs";
import {User} from "../../models/entities/User";
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {ApiQueryParams} from "../../models/apis/api-query-params";

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractCrudService<User>{

  constructor() {
    super("user");
  }

  importUsers(file : File): Observable<User[] | HttpResponse<User[]>> {
    const formData = new FormData();
    formData.append('file', file);
    return this._http.post<User[]>(<string>this._endpointUrl+"/import", formData);
  }


}
