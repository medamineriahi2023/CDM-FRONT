import {AbstractEntity} from "../abstract/AbstractEntity";
import {User} from "./User";
import {Service} from "./Service";
import {Canal} from "./Canal";
import {FileBlob} from "./FileBlob";

export class Sender extends AbstractEntity{
  numSender?: number;
  date?: Date;
  emitteur?:Service;
  distinataire?:Service;
  objet?:string;
  canal?:Canal;
  fileBlob?:FileBlob;

  constructor() {
    super();
  }
}
