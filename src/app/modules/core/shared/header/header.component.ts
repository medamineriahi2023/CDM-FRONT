import {Component, EventEmitter, Inject, LOCALE_ID, OnInit, Output} from '@angular/core';
import {faSignOut,faBell} from '@fortawesome/free-solid-svg-icons';
import {KeycloakService} from "keycloak-angular";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() selectedValueEvent :EventEmitter<string> = new EventEmitter<string>();

  faSignOut = faSignOut;
  faBell =faBell
  selectedValue = "ar";
  loggedRole:string;
  constructor(@Inject(LOCALE_ID) public locale: string, private keycloak : KeycloakService) {
    this.selectedValue = locale;
    this.loggedRole = keycloak.getUserRoles()[0];
  }

  ngOnInit(): void {

  }

  public logout(){
    this.keycloak.logout();
  }

}
