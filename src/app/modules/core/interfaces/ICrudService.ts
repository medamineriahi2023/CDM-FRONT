import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {ApiQueryParams} from "../models/apis/api-query-params";

export interface ICrudService<T> {
    create(entity: T): Observable<T | HttpResponse<T>>;
    delete(id: number): Observable<void | HttpResponse<void>>;
    get(id: number, params?: ApiQueryParams): Observable<T>;
    getAll(params?: ApiQueryParams): Observable<T[]>;
    search(criteria: any, params?: ApiQueryParams): Observable<T[]>;
    update(updateData: Object): Observable<T | HttpResponse<T>>;
    getOne(): Observable<T>;
    getMany(count: number): Observable<T[]>;
}
