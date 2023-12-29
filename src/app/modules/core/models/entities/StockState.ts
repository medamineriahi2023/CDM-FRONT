import {Service} from "./Service";
import {Equipment} from "./Equipment";
import {AbstractEntity} from "../abstract/AbstractEntity";
import {User} from "./User";

export class StockState extends AbstractEntity{
  numBl? : number;
  fournisseur?: Service;
  signataire?: User;
  equipments?: Equipment[];
  constructor() {
    super();
  }
}
