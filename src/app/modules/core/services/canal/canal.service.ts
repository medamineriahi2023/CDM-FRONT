import { Injectable } from '@angular/core';
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {Canal} from "../../models/entities/Canal";

@Injectable({
  providedIn: 'root'
})
export class CanalService extends AbstractCrudService<Canal>{

  constructor() { super ("canal")}
}
