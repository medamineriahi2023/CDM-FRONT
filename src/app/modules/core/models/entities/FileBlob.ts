import {AbstractEntity} from "../abstract/AbstractEntity";
import {User} from "./User";
import {Service} from "./Service";

export class FileBlob extends AbstractEntity{
  extention?:string;


  constructor() {
    super();
  }
}
