import { Injectable } from '@angular/core';
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {Plainte} from "../../models/entities/Plainte";

@Injectable({
  providedIn: 'root'
})
export class PlainteService extends AbstractCrudService<Plainte>{

  constructor() {super("plainte") }
}
