import {AbstractEntity} from "../abstract/AbstractEntity";
import {User} from "./User";
import {Service} from "./Service";
import {Canal} from "./Canal";
import {FileBlob} from "./FileBlob";

export class Receiver extends AbstractEntity{
  numReceiver?: number;
  date?: Date;
  emitteur?:string;
  objet?:string;
  canal?:Canal;
  fileBlob?:FileBlob;

  constructor() {
    super();
  }
}
