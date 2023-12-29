import { Injectable } from '@angular/core';
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {Sender} from "../../models/entities/Sender";

@Injectable({
  providedIn: 'root'
})
export class SenderService extends AbstractCrudService<Sender>{

  constructor() {
    super("sender")
  }
}
