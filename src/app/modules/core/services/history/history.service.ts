import { Injectable } from '@angular/core';
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {History} from "../../models/entities/History";

@Injectable({
  providedIn: 'root'
})
export class HistoryService extends AbstractCrudService<History>{

  constructor() {
    super("history");
  }
}
