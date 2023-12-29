import {AbstractEntity} from "../abstract/AbstractEntity";
import {FileBlob} from "./FileBlob";
import {Plainte} from "./Plainte";

export class Infraction extends AbstractEntity{
  plainte? : Plainte
  numInfraction? :number;
  date?: Date;
  cin?: string;
  aideAffectee?:string;
  objet?:string;
  niveauTravaux?:string;
  dommages?:string;
  decision?: string;
  fileBlob?: FileBlob;

  constructor() {
    super();
  }
}
