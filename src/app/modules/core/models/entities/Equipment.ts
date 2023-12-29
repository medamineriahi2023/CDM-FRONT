import {Article} from "./Article";
import {Category} from "./Category";
import {SousCategory} from "./SousCategory";
import {AbstractEntity} from "../abstract/AbstractEntity";
import {Etat} from "./Etat";
import {Service} from "./Service";
import {SortieStock} from "./SortieStock";
import {StockState} from "./StockState";


export class Equipment  extends AbstractEntity{
  article? : Article;
  category?: Category;
  sousCategory?: SousCategory;
  qte?: number;
  etat?:Etat;
  service? : Service;
  sortieStock?:SortieStock;
  etatStock?:StockState;
  constructor() {
    super();
  }
}
