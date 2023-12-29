import { Injectable } from '@angular/core';
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {Category} from "../../models/entities/Category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends AbstractCrudService<Category>{

  constructor() {
    super("category")
  }
}
