import {AbstractEntity} from "../abstract/AbstractEntity";
import {FileBlob} from "./FileBlob";

export class Plainte extends AbstractEntity{
  numPlainte? :number;
  date?: Date;
  plaignant?: string;
  accusateur?:string;
  adressePlaignant?:string;
  adresseAccusateur?:string;
  adrBien?:string;
  objetPlainte?: string;
  remarques?: string;
  fileBlob?: FileBlob;

  constructor() {
    super();
  }
}
