import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ICrudService} from "../../interfaces/ICrudService";
import {ApiQueryParams} from "../../models/apis/api-query-params";
import {AbstractApiService} from "./abstract-api.service";

export abstract class AbstractCrudService<T> extends AbstractApiService
  implements ICrudService<T> {

  constructor(endpoint: string) {
    super(endpoint);
  }

  create(entity: T, params?: ApiQueryParams): Observable<T | HttpResponse<T>> {
    return this._http.post<T>(<string>this._endpointUrl, entity, { params: { ...params } },);
  }

  createAll(entities: T[], params?: ApiQueryParams): Observable<T[]> {
    return this._http.post<T[]>(this._endpointUrl + '/bulk', entities, {
      params: { ...params }
    });
  }

  delete(id: number): Observable<void | HttpResponse<void>> {
    return this._http.delete<void>(`${this._endpointUrl}/${id}`);
  }

  get(id: number, params?: ApiQueryParams): Observable<T> {
    return this._http.get<T>(`${this._endpointUrl}/${id}`, { params: { ...params } });
  }

  getAll(params?: ApiQueryParams): Observable<T[]> {
    return this._http.get<T[]>(<string>this._endpointUrl, { params: { ...params } });
  }

  getRelated<U>(
    parentId: number | string,
    subEndpoint: string,
    params?: ApiQueryParams,
    additionalParams?: any
  ): Observable<U> {
    let parameters = { ...params };
    if (additionalParams) {
      parameters = { ...parameters, ...additionalParams };
    }
    return this._http.get<U>(`${this._endpointUrl}/${parentId}/${subEndpoint}`, {
      params: parameters
    });
  }

  getAllRelated<U>(
    parentId: number | string,
    subEndpoint: string,
    params?: ApiQueryParams,
    additionalParams?: any
  ): Observable<U[]> {
    let parameters = { ...params };
    if (additionalParams) {
      parameters = { ...parameters, ...additionalParams };
    }
    return this._http.get<U[]>(`${this._endpointUrl}/${parentId}/${subEndpoint}`, {
      params: parameters
    });
  }

  update(updateData: T, params?: ApiQueryParams): Observable<T | HttpResponse<T>> {
    return this._http.put<T>(<string>this._endpointUrl, updateData, { params: { ...params } });
  }

  updateAll(entities: T[], params?: ApiQueryParams): Observable<T[] | HttpResponse<T[]>> {
    return this._http.put<T[]>(this._endpointUrl + '/bulk', entities, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: { ...params }
    });
  }

  updatePartial(
    updateData: T,
    updateFields: string,
    params?: ApiQueryParams
  ): Observable<T | HttpResponse<T>> {
    return this._http.patch<T>(<string>this._endpointUrl, updateData, {
      params: { updateFields: updateFields, ...params }
    });
  }

  updatePartialAll(
    entities: T[],
    updateFields: string,
    params?: ApiQueryParams
  ): Observable<T[] | HttpResponse<T[]>> {
    return this._http.patch<T[]>(this._endpointUrl + '/bulk', entities, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: { updateFields: updateFields, ...params }
    });
  }

  updateRelated<U>(
    parentId: number | string,
    subEndpoint: string,
    entity: U,
    params?: ApiQueryParams
  ): Observable<U | HttpResponse<U[]>> {
    return this._http.put<U>(`${this._endpointUrl}/${parentId}/${subEndpoint}`, entity, {
      params: { ...params }
    });
  }

  search(criteria: any, params?: ApiQueryParams): Observable<T[]> {
    return this._http.get<T[]>(<string>this._endpointUrl, {
      params: { ...criteria, ...params }
    });
  }

  /**
   * Search method as post to prevent http query too long
   * @param criteria predicates
   * @param params query params
   * @returns list of entities
   */
  searchPost(criteria: any, params?: ApiQueryParams): Observable<T[]> {
    return this._http.post<T[]>(`${this._endpointUrl}/search`, criteria, {
      params: { ...params }
    });
  }


  getOne(): Observable<T> {
    throw new Error('[AbstractCrudService] Method not implemented.');
  }

  getMany(count: number): Observable<T[]> {
    throw new Error('[AbstractCrudService] Method not implemented.');
  }

}
