import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../../environments/environment";
import {AppInjector} from "../injector.service";


export abstract class AbstractApiService {
  protected _endpointUrl?: string;
  protected _http: HttpClient;


  constructor(endpoint?: string) {
    const injector = AppInjector.getInjector();
    this._http = injector.get(HttpClient);
    const apiRootUrl = `${environment.api.protocol}://${environment.api.host}:${environment.api.port}`;
      this._endpointUrl = apiRootUrl + '/' + endpoint;
  }
}
