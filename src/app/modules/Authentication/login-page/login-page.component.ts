import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {MessagesModalService} from "../../core/services/messages-modal.service";
import {AuthenticationService} from "../../core/services/authentication/authentication.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  submitted = false;
  registerForm!: FormGroup;
  selectedValue = "ar";

  constructor(private _title: Title,
              public _swal : MessagesModalService,
              public _authenticationService : AuthenticationService,
              private formBuilder: FormBuilder,
              private router: Router,
              @Inject(LOCALE_ID) public locale: string,
  ) {
    this.selectedValue = locale;

  }

  ngOnInit(): void {
  this._title.setTitle("Login Page");
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    this._authenticationService.login(this.registerForm.get("email")?.value ,this.registerForm.get("password")?.value, this.selectedValue);

    // display form values on success
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

}
