import {Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output} from '@angular/core';
import {faSearch,faCalendar} from '@fortawesome/free-solid-svg-icons';
import {User} from "../../models/entities/User";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-top-page-header',
  templateUrl: './top-page-header.component.html',
  styleUrls: ['./top-page-header.component.css']
})
export class TopPageHeaderComponent implements OnInit {
  @Output() searchEvent :EventEmitter<string> = new EventEmitter<string>();
  @Input() selectedIndex?: string ;
  @Input() hasCalender?: boolean ;
  faCalendar =faCalendar;
  faSearch = faSearch;
  search="";
  @Input() data?: string[];
  @Input() links?: string[];
  constructor( @Inject(LOCALE_ID) public locale: string) {

  }

  ngOnInit(): void {
  }

  searchChange(text: string) {
    this.searchEvent.emit(text);
  }
}
