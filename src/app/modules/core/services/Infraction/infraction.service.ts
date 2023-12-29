import { Injectable } from '@angular/core';
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {Infraction} from "../../models/entities/Infraction";

@Injectable({
  providedIn: 'root'
})
export class InfractionService extends AbstractCrudService<Infraction>{

  constructor() { super("infraction")}
}
