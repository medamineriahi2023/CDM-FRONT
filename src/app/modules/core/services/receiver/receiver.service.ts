import { Injectable } from '@angular/core';
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {Service} from "../../models/entities/Service";
import {Receiver} from "../../models/entities/Receiver";

@Injectable({
  providedIn: 'root'
})
export class ReceiverService  extends AbstractCrudService<Receiver>{

  constructor() {
    super("receiver")
  }
}
