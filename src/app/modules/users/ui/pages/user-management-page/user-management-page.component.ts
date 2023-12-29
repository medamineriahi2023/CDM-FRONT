import {Component, ElementRef, Inject, LOCALE_ID, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UserService} from "../../../../core/services/user/user.service";
import {User} from "../../../../core/models/entities/User";
import {ServiceService} from "../../../../core/services/service/service.service";
import {Service} from "../../../../core/models/entities/Service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {faPlus, faUpload,faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../../../core/services/authentication/authentication.service";
import {MessagesModalService} from "../../../../core/services/messages-modal.service";
import {KeycloakService} from "keycloak-angular";
import {initializer} from "../../../../core/config/keycloak.config";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-management-page',
  templateUrl: './user-management-page.component.html',
  styleUrls: ['./user-management-page.component.css']
})
export class UserManagementPageComponent implements OnInit {
  faPlus=faPlus;
  faUpload=faUpload;
  data?: User[];
  services?: Service[];
  submitted = false;
  registerForm!: FormGroup;
  isEdit? :boolean;
  modalTitle?: string;
  userToEdit?:User;
  allUserData?: User[];
  select = 5;
  isLoading = false;
  faCircleNotch= faCircleNotch;
  fields?: string;
  file? : File;
  isUploading?: boolean;
  roles?:any;
  start = 1;
  startIndex = 0;
  endIndex = this.select;
  @ViewChild('mymodal') templateRef?: TemplateRef<any>;
  @ViewChild('file') fileRef?: TemplateRef<any>;
  @ViewChild('fileInput', { static: true })
  public fileInput?: ElementRef<HTMLInputElement>;
  public selectedFile = false;
  private lastSort?: string;
  public asc?: boolean;
  public topPageHeader?:string[];
  public links: string[];
  public hasRole?: boolean;
  public allRoles! : string[];
  constructor(private authService: AuthenticationService,@Inject(LOCALE_ID) public locale: string,private _swal : MessagesModalService,private _authenticationService : AuthenticationService,private _userService : UserService, private _serviceService : ServiceService, private modalService: NgbModal,private formBuilder: FormBuilder,private keycloak: KeycloakService,private router: Router ) {
    this.topPageHeader = locale == "ar" ?["إدارة المستخدمين", "إدارة الخدمات", "تتبع العمل"] : ["Gestion des utilisateurs","Gestion des services","Suivi des actions"];
    this.links = ["/user-management","/service-management","/history"]
  }

  parentEventHandlerFunction(user:User){
    this.isEdit = true;
    this.userToEdit = user;
    this.modalTitle = this.locale == "ar"?"تعديل مستخدم": "Modifier utilisateur";
    this.registerForm.get("email")?.setValue(user.email);
    this.registerForm.get("password")?.setValue(user.password);
    this.registerForm.get("fullname")?.setValue(user.firstname + " " + user.lastname);
    this.registerForm.get("service")?.setValue(user.service?.id);
    this.registerForm.get("id")?.setValue(user.id);
    this.modalService.open(this.templateRef);
  }

  leftArrowClick() {
    if (this.start > 1) {
      this.endIndex -= this.select;
      this.startIndex -= this.select;
      this.data = this.allUserData?.slice(this.startIndex, this.endIndex);
      this.start--;
    }
  }

  rightArrowClick() {
    // @ts-ignore
    if (Number.parseInt(this.endIndex) + Number.parseInt(this.select) <= this.allUserData.length) {
      this.startIndex = Number.parseInt(String(this.endIndex));
      this.endIndex += Number.parseInt(String(this.select));
      this.data = this.allUserData?.slice(this.startIndex, this.endIndex);
      this.start++;
    }
  }


  openFileModal(){
    this.modalService.open(this.fileRef);
  }


  title = 'appBootstrap';

  closeResult: string = '';
  open(content :any) {
    this.registerForm.reset();
    this.isEdit = false;
    this.modalTitle = this.locale == "ar"?"إضافة مستخدم" : "Ajouter utilisateur";
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    const user = new User();
    user.email = this.registerForm.get("email")?.value;
    user.password = this.registerForm.get("password")?.value;
    let fullname = this.registerForm.get("fullname")?.value;
    let arr = fullname.split(" ");
    user.firstname = arr[0];
    arr.shift();
    user.lastname = arr.join(" ");
    user.role = this.registerForm.get("role")?.value;
    const service= new Service();
    service.id = this.registerForm.get("service")?.value;
    user.service = service;
    if (!this.isEdit) {
    this._authenticationService.register(user, "fr").subscribe(e => {
      this._userService.getAll().subscribe(e => this.data = e.splice(0, this.select));
      this.modalService.dismissAll();
      this._swal.toastSuccess(this.locale == "ar "?"تمت إضافة المستخدم بنجاح " : "L'utilisateur a été ajouté avec succès");
    }, error => this._swal.toastError(error.error.message));
    }else {
      user.id = this.registerForm.get("id")?.value;
      this.fields = 'id,firstname,lastname,password,email,service';
      this._userService.updatePartial(user, this.fields).subscribe(e => {
        this._userService.getAll().subscribe(e => {this.data = e.splice(0, this.select) ; this._swal.toastSuccess(this.locale == "ar" ? "تم تعديل المستخدم بنجاح " : "L'utilisateur a été modifié avec succès");});
        this.modalService.dismissAll();
      }, error => console.log(error));
    }



  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      fullname: ['', [Validators.required, Validators.minLength(3)]],
      service: ['', [Validators.required]],
      role: ['', [Validators.required]],
      id : ['']
    });
    this._userService.getAll().subscribe(e => {this.allUserData = e ;this.data = e.splice(0 , this.select);
      const range = Array.from({ length: this.allUserData.length / this.select + 1 }, (_, i) => i * this.select);
      console.log(range);
    });
    this._serviceService.getAll().subscribe(e=> this.services = e);
    this.authService.getKeycloakRoles().subscribe(e => this.roles = e);
  }


  generateEventHandler(value : any) {
    this._authenticationService.sendUserCredentials(value, "fr").subscribe(data =>{ this._swal.toastSuccess( this.locale == "ar" ? "تم إرسال البريد الإلكتروني بنجاح" : "E-mail envoyé avec succès"); console.log(data)}, error => this._swal.toastError(this.locale == "ar" ?" لم يتم إرسال البريد الإلكتروني" : "L'e-mail n'a pas été envoyé"))
  }

  setSelectedPayPeriod(v: any) {
    this._userService.getAll().subscribe(e => this.data = e.splice(0 , v));
  }

  search(e : string) {
    if (e.length > 3){
      this.data = this.allUserData?.filter(data => data.email?.includes(e) || data.firstname?.includes(e) || data.lastname?.includes(e) || data.role?.includes(e));
    }
    else
      this._userService.getAll().subscribe(e => {this.data = e.splice(0 , this.select);});

  }

  onSwitchChange(val: any) {
    const user = new User()
    user.id = val.target.value;
    this.fields = 'disabled';
    if (val.target.checked){

      user.disabled = false;
      this._userService.updatePartial(user, this.fields).subscribe(e => {
        this._userService.getAll().subscribe(e => {this.data = e.splice(0, this.select);this._swal.toastSuccess(this.locale == "ar" ? "تم تفعيل المستخدم بنجاح " : "L'utilisateur a été activé avec succès")});
      }, error => console.log(error));
    }else {
      user.disabled = true;
      this._userService.updatePartial(user, this.fields).subscribe(e => {
        this._userService.getAll().subscribe(e => {this.data = e.splice(0, this.select); this._swal.toastSuccess(this.locale == "ar" ? "تم تعطيل المستخدم بنجاح" : "L'utilisateur a été disactivé avec succès")});
      }, error => console.log(error));
    }
  }

  sort (v : string) {
    if (this.lastSort != v) {
      this.asc = true;
      if (v && this.data != undefined && v == "fullname") {
        this.lastSort = "fullname";
        this.data = this.data.sort((a, b) => {
          ;
          if (b.firstname != undefined && a.firstname != undefined && a.firstname.toLowerCase() > b.firstname.toLowerCase())
            return 1
          else
            return -1
        });
      } else if (v && this.data != undefined && v == "role") {
        this.lastSort = "role";
        this.data = this.data.sort((a, b) => {
          if (b.role != undefined && a.role != undefined && a.role.toLowerCase() > b.role.toLowerCase())
            return 1
          else
            return -1
        });
      } else if (v && this.data != undefined && v == "email") {
        this.lastSort = "email";
        this.data = this.data.sort((a, b) => {
          if (b.email != undefined && a.email != undefined && a.email.toLowerCase() > b.email.toLowerCase())
            return 1
          else
            return -1
        });
      } else if (v && this.data != undefined && v == "service") {
        this.lastSort = "service";
        this.data = this.data.sort((a, b) => {
          if (b.service?.serviceName != undefined && a.service?.serviceName != undefined && a.service.serviceName.toLowerCase() > b.service.serviceName.toLowerCase())
            return 1
          else
            return -1
        });
      } else
        this._userService.getAll().subscribe(e => {
          this.allUserData = e;
          this.data = e.splice(0, this.select);
        });
    } else {
      this.asc = false;
      if (v && this.data != undefined && v == "fullname") {
        this.lastSort = "";
        this.data = this.data.sort((a, b) => {
          ;
          if (b.firstname != undefined && a.firstname != undefined && a.firstname.toLowerCase() > b.firstname.toLowerCase())
            return -1
          else
            return 1
        });
      } else if (v && this.data != undefined && v == "role") {
        this.lastSort = "";
        this.data = this.data.sort((a, b) => {
          if (b.role != undefined && a.role != undefined && a.role.toLowerCase() > b.role.toLowerCase())
            return -1
          else
            return 1
        });
      } else if (v && this.data != undefined && v == "email") {
        this.lastSort = "";
        this.data = this.data.sort((a, b) => {
          if (b.email != undefined && a.email != undefined && a.email.toLowerCase() > b.email.toLowerCase())
            return -1
          else
            return 1
        });
      } else if (v && this.data != undefined && v == "service") {
        this.lastSort = "";
        this.data = this.data.sort((a, b) => {
          if (b.service?.serviceName != undefined && a.service?.serviceName != undefined && a.service.serviceName.toLowerCase() > b.service.serviceName.toLowerCase())
            return -1
          else
            return 1
        });
      }
    }
  }

  checkFile(v : any) {
   this.file = v.target.files[0];
   this.selectedFile = v.target.files[0] !== undefined;
  }

  importData(){
    this.isUploading = true;
    if (this.file)
    this._userService.importUsers(this.file).subscribe(e => {this._swal.toastSuccess(this.locale == "ar" ? "تم إنشاء جميع المستخدمين!": "Tous les utilisateurs sont créés!") ; console.log(e) ; this.isUploading = false; this.modalService.dismissAll(); this._userService.getAll().subscribe(e => {this.allUserData = e ;this.data = e.splice(0 , this.select);});}, error => {this._swal.toastError(error.error.message) ; this.isUploading = false; this.selectedFile = false;});
  }
}
