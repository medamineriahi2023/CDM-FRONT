import { Injectable } from '@angular/core';
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {SousCategory} from "../../models/entities/SousCategory";

@Injectable({
  providedIn: 'root'
})
export class SousCategoryService extends AbstractCrudService<SousCategory>{

  constructor() {
    super("sous-category")
  }
}
