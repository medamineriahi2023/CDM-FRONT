import { Injectable } from '@angular/core';
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {StockState} from "../../models/entities/StockState";
import {ApiQueryParams} from "../../models/apis/api-query-params";
import {Observable} from "rxjs";
import {SortieStockService} from "../sortieStock/sortie-stock.service";
import {Equipment} from "../../models/entities/Equipment";

@Injectable({
  providedIn: 'root'
})
export class StockStateService extends AbstractCrudService<StockState>{

  constructor() {
    super("stock-state")
  }

  getByEquipment(equipment:Equipment): Observable<StockState> {
    return this._http.post<StockState>(<string>this._endpointUrl+ "/getByEquipment", equipment );
  }


}
