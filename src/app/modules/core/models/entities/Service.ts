import {AbstractEntity} from "../abstract/AbstractEntity";

export class Service extends AbstractEntity{
  serviceName?:string;
  responsable?:string;
  disabled?:boolean;


  constructor() {
    super();
  }
}
