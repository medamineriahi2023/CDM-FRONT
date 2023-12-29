import {AbstractEntity} from "../abstract/AbstractEntity";
import {User} from "./User";
import {Service} from "./Service";
import {Canal} from "./Canal";
import {FileBlob} from "./FileBlob";
import {Receiver} from "./Receiver";

export class TrackingMotion extends AbstractEntity{
  date?: Date;
  receiver?:Receiver;
  distinataire?:Service;
  constructor() {
    super();
  }
}
