import {AbstractEntity} from "../abstract/AbstractEntity";
import {Service} from "./Service";
export class User extends AbstractEntity{
  firstname? : string;
  lastname? : string;
  password? : string;
  email? : string;
  service? : Service;
  role? : string;
  disabled? : boolean;

  constructor() {
    super();
  }
}
