import { Injectable } from '@angular/core';
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {SortieStock} from "../../models/entities/SortieStock";
import {Equipment} from "../../models/entities/Equipment";
import {Observable} from "rxjs";
import {StockState} from "../../models/entities/StockState";

@Injectable({
  providedIn: 'root'
})
export class SortieStockService extends AbstractCrudService<SortieStock>{

  constructor() {
    super("sortie-stock")
  }


  getByEquipment(equipment:Equipment): Observable<SortieStock> {
    return this._http.post<SortieStock>(<string>this._endpointUrl+ "/getByEquipment", equipment );
  }

}
