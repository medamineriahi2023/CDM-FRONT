import {AbstractEntity} from "../abstract/AbstractEntity";
import {User} from "./User";
import {Service} from "./Service";

export class History extends AbstractEntity{
  action?:string;
  user?:User;
  service?:Service;


  constructor() {
    super();
  }
}
