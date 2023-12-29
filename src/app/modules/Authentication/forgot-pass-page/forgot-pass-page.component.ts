import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {MessagesModalService} from "../../core/services/messages-modal.service";
import {AuthenticationService} from "../../core/services/authentication/authentication.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-forgot-pass-page',
  templateUrl: './forgot-pass-page.component.html',
  styleUrls: ['./forgot-pass-page.component.css']
})
export class ForgotPassPageComponent implements OnInit {
  submitted = false;
  selectedValue = "ar";
  registerForm!: FormGroup;
  constructor(private _title: Title,
              public _swal : MessagesModalService,
              public _authenticationService : AuthenticationService,
              private formBuilder: FormBuilder,
              @Inject(LOCALE_ID) public locale: string) {
    this.selectedValue= locale;
  }

  ngOnInit(): void {
    this._title.setTitle("Login Page");
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public resetPassword(): void{
    this._authenticationService.resetPassword(this.registerForm.get("email")?.value, this.selectedValue);
  }

}
