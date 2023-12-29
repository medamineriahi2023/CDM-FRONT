import { Component } from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OGA-front';
  constructor(private keycloak:KeycloakService, private router : Router) {
    if (this.keycloak.isUserInRole('Gestionnaire du stock')){
      this.router.navigate(['/out-stock']);
    }

    if (this.keycloak.isUserInRole('Responsable du bureau d\'ordre')){
      this.router.navigate(['/receiver']);
    }

    if (this.keycloak.isUserInRole('recruteur municipal')){
      this.router.navigate(['/tracking']);
    }

    if (this.keycloak.isUserInRole('Controleur des reglements')){
      this.router.navigate(['/plaintes']);
    }
    if (this.keycloak.isUserInRole('admin')){
      this.router.navigate(['/user-management']);
    }
  }
}
