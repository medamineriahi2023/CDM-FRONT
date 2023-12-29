import {Service} from "./Service";
import {Equipment} from "./Equipment";
import {AbstractEntity} from "../abstract/AbstractEntity";

export class SortieStock extends AbstractEntity{
  numCommande? : number;
  service?: Service;
  signataire?: string;
  equipments?: Equipment[];
  constructor() {
    super();
  }
}
