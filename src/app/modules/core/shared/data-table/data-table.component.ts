import {Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output} from '@angular/core';
import {faCircleNotch, faEnvelope, faPencil, faSortAsc,faSortDesc} from '@fortawesome/free-solid-svg-icons';
import {User} from "../../models/entities/User";

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @Output() edit :EventEmitter<User> = new EventEmitter<User>();
  @Output() generate: EventEmitter<number>= new EventEmitter<number>();
  @Output() disabled: EventEmitter<any>= new EventEmitter<any>();
  @Output() sort: EventEmitter<string>= new EventEmitter<string>();
  faEnvelope= faEnvelope;
  faPencil=faPencil;
  faCircleNotch= faCircleNotch;
  faSortAsc=faSortAsc;
  faSortDesc=faSortDesc;
  @Input() data : any;
  @Input() services : any;
  @Input() isLoading : any;
  @Input() sortType? : boolean;
  switch = true;
  sortby = "";

  constructor(@Inject(LOCALE_ID) public locale: string) {
  }


  ngOnInit(): void {
  }




  clickButton(user: User){
    this.edit.emit(user);
  }
  generatePass(id:number){
    this.generate.emit(id);
  }


  onSwitchChange(value:any) {
    this.disabled.emit(value);
  }

  sortWithUsername() {
    this.sortby = "fullname";
    this.sort.emit(this.sortby);
  }
  sortWithEmail() {
    this.sortby = "email";
    this.sort.emit(this.sortby);
  }
  sortWithRole() {
    this.sortby = "role";
    this.sort.emit(this.sortby);
  }

  sortWithService() {
    this.sortby = "service";
    this.sort.emit(this.sortby);
  }
}
