import { Injectable } from '@angular/core';
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {Service} from "../../models/entities/Service";
import {Observable} from "rxjs";
import {User} from "../../models/entities/User";
import {HttpResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ServiceService extends AbstractCrudService<Service>{

  constructor(
  ) {
    super("service")
  }

  importServices(file : File): Observable<Service[] | HttpResponse<Service[]>> {
    const formData = new FormData();
    formData.append('file', file);
    return this._http.post<User[]>(<string>this._endpointUrl+"/import", formData);
  }

}
