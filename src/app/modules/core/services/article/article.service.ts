import { Injectable } from '@angular/core';
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {Article} from "../../models/entities/Article";

@Injectable({
  providedIn: 'root'
})
export class ArticleService extends AbstractCrudService<Article>{

  constructor() {
    super("article")
  }
}
