import {Component, Inject, Input, LOCALE_ID, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  @Input() public selector? : string;
  public allRoles!: string[];
  constructor(@Inject(LOCALE_ID) public locale: string, private keycloak : KeycloakService) {
    this.allRoles= this.keycloak.getUserRoles();
  }

  ngOnInit(): void {
  }


}
