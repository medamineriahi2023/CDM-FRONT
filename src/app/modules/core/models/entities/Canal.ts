import {AbstractEntity} from "../abstract/AbstractEntity";
import {User} from "./User";
import {Service} from "./Service";

export class Canal extends AbstractEntity{
  canalName?:string;


  constructor() {
    super();
  }
}
