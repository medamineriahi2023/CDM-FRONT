import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {constants} from "../../../../../environments/constants";
import {MessagesModalService} from "../messages-modal.service";
import {User} from "../../models/entities/User";
import {ApiQueryParams} from "../../models/apis/api-query-params";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private _http: HttpClient, public _swal : MessagesModalService,) {
  }
  public async login(email : string , password : string, locale : string): Promise<any> {
    const body = {username: email, password: password};
    const headers = new HttpHeaders()
      .set('Accept-Language', locale)
    this._http.post<any>(constants.APP_ROOT + "auth", body, { 'headers': headers }).subscribe(data => {this._swal.toastSuccess("Connected successfully");console.log(data)}, error => this._swal.toastError(this.decode_utf8(error.error.errors)));

  }

  public async resetPassword(email : string, locale: string): Promise<any> {
    const headers = new HttpHeaders()
      .set('Accept-Language', locale)
    this._http.post<any>(constants.APP_ROOT + "resetPass/"+email, {},{ 'headers': headers }).subscribe(data => {this._swal.toastSuccess("Email has been sent successfully");console.log(data)}, error => this._swal.toastError(this.decode_utf8(error.error.errors)));
  }

   register(user :User, locale: string): Observable<User | HttpResponse<User>> {
    const headers = new HttpHeaders()
      .set('Accept-Language', locale)
    return this._http.post<any>(constants.APP_ROOT + "register", user,{ 'headers': headers });
  }

  sendUserCredentials(userId :string, locale: string): Observable<User | HttpResponse<User>> {
    const headers = new HttpHeaders()
      .set('Accept-Language', locale)
    return this._http.post<any>(constants.APP_ROOT + "sendmail/"+userId, {},{ 'headers': headers });
  }

  getKeycloakRoles(): Observable<any> {
    return this._http.get<any>(constants.APP_ROOT + "roles/");
  }

  private decode_utf8(s: string): string {
    return decodeURIComponent(escape(s));
  }

}
