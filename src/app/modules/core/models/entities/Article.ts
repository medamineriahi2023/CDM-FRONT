import {SousCategory} from "./SousCategory";
import {Category} from "./Category";
import {AbstractEntity} from "../abstract/AbstractEntity";

export class Article extends AbstractEntity{
  sousCategory? :SousCategory;
  category?: Category;
  code?: number;
  stockMin?:number;
  stockCri?:number;
  name?:string;
  archived?:boolean;
  qteTotal?: number;

  constructor() {
    super();
  }
}
