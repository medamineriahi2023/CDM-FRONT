import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LoginPageComponent} from './modules/Authentication/login-page/login-page.component';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ForgotPassPageComponent} from './modules/Authentication/forgot-pass-page/forgot-pass-page.component';
import {PreloadAllModules, RouterLinkWithHref, RouterModule, RouterOutlet} from "@angular/router";
import {HeaderComponent} from './modules/core/shared/header/header.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {SideBarComponent} from './modules/core/shared/side-bar/side-bar.component';
import {
  UserManagementPageComponent
} from './modules/users/ui/pages/user-management-page/user-management-page.component';
import {DataTableComponent} from './modules/core/shared/data-table/data-table.component';
import {AppInjector} from "./modules/core/services/injector.service";
import {ModalComponent} from './modules/core/shared/modal/modal.component';
import {TopPageHeaderComponent} from './modules/core/shared/top-page-header/top-page-header.component';
import {
  ServiceManagementPageComponent
} from './modules/users/ui/pages/service-management-page/service-management-page.component';
import {TableHeaderComponent} from './modules/core/shared/table-header/table-header.component';
import {HistoryPageComponent} from './modules/users/ui/pages/history-page/history-page.component';
import {NgxPrintModule} from "ngx-print";
import {
  ArticleManagementPageComponent
} from './modules/users/ui/pages/article-management-page/article-management-page.component';
import {OutOfStockPageComponent} from './modules/users/ui/pages/out-of-stock-page/out-of-stock-page.component';
import {EtatStockComponent} from './modules/users/ui/pages/etat-stock/etat-stock.component';
import {ReceiverPageComponent} from './modules/users/ui/pages/receiver-page/receiver-page.component';
import {NgbDatepickerModule, NgbTimepickerModule} from "@ng-bootstrap/ng-bootstrap";
import {SenderPageComponent} from './modules/users/ui/pages/sender-page/sender-page.component';
import {
  TrackingMotionPageComponent
} from './modules/users/ui/pages/tracking-motion-page/tracking-motion-page.component';
import {PlaintePageComponent} from './modules/users/ui/pages/plainte-page/plainte-page.component';
import {InfractionPageComponent} from './modules/users/ui/pages/infraction-page/infraction-page.component';
import {DecisionPageComponent} from './modules/users/ui/pages/decision-page/decision-page.component';
import {initializer} from "./modules/core/config/keycloak.config";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {AuthGuard} from "./modules/core/guards/AuthGuard";
import { PaginatorComponent } from './modules/core/shared/paginator/paginator.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ForgotPassPageComponent,
    HeaderComponent,
    SideBarComponent,
    UserManagementPageComponent,
    DataTableComponent,
    ModalComponent,
    TopPageHeaderComponent,
    ServiceManagementPageComponent,
    TableHeaderComponent,
    HistoryPageComponent,
    ArticleManagementPageComponent,
    OutOfStockPageComponent,
    EtatStockComponent,
    ReceiverPageComponent,
    SenderPageComponent,
    TrackingMotionPageComponent,
    PlaintePageComponent,
    InfractionPageComponent,
    DecisionPageComponent,
    PaginatorComponent
  ],
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterOutlet,
    RouterLinkWithHref,
    RouterModule.forRoot([
      // {path: '', component: LoginPageComponent},
      {path: 'user-management', component: UserManagementPageComponent, canActivate : [AuthGuard] , data :{roles : ["admin"]}},
      {path: 'forget-password', component: ForgotPassPageComponent},
      {path: 'service-management', component: ServiceManagementPageComponent, canActivate : [AuthGuard] , data :{roles : ['admin']}},
      {path: 'history', component: HistoryPageComponent, canActivate : [AuthGuard] , data :{roles : ['admin']}},
      {path: 'article-management', component: ArticleManagementPageComponent, canActivate : [AuthGuard] , data :{roles : ['admin','Gestionnaire du stock']}, runGuardsAndResolvers: 'always'},
      {path: 'out-stock', component: OutOfStockPageComponent, canActivate : [AuthGuard] , data :{roles : ['Gestionnaire du stock']}},
      {path: 'etat-stock', component: EtatStockComponent, canActivate : [AuthGuard] , data :{roles : ['Gestionnaire du stock','admin']},runGuardsAndResolvers: 'always'},
      {path: 'receiver', component: ReceiverPageComponent, canActivate : [AuthGuard] , data :{roles : ["Responsable du bureau d'ordre"]}},
      {path: 'sender', component: SenderPageComponent, canActivate : [AuthGuard] , data :{roles : ["Responsable du bureau d'ordre"]}},
      {path: 'tracking', component: TrackingMotionPageComponent, canActivate : [AuthGuard] , data :{roles : ["recruteur municipal"]}},
      {path: 'plaintes', component: PlaintePageComponent, canActivate : [AuthGuard] , data :{roles : ["Controleur des reglements"]}},
      {path: 'infraction', component: InfractionPageComponent, canActivate : [AuthGuard] , data :{roles : ["Controleur des reglements"]}},
      {path: 'decision', component: DecisionPageComponent, canActivate : [AuthGuard] , data :{roles : ["Controleur des reglements"]}},
    ],
      {initialNavigation:'enabledNonBlocking',
      preloadingStrategy:PreloadAllModules}),
    FontAwesomeModule,
    NgxPrintModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    KeycloakAngularModule
  ],
  exports: [BsDropdownModule, TooltipModule, ModalModule],
  providers: [{
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    AppInjector.setInjector(injector);
  }
}
