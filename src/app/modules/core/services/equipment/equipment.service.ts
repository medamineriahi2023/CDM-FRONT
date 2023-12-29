import { Injectable } from '@angular/core';
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {Equipment} from "../../models/entities/Equipment";

@Injectable({
  providedIn: 'root'
})
export class EquipmentService extends AbstractCrudService<Equipment>{

  constructor() {
    super("equipment")
  }
}
