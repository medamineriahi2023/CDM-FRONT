import {Component, ElementRef, Inject, LOCALE_ID, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Service} from "../../../../core/models/entities/Service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessagesModalService} from "../../../../core/services/messages-modal.service";
import {AuthenticationService} from "../../../../core/services/authentication/authentication.service";
import {UserService} from "../../../../core/services/user/user.service";
import {ServiceService} from "../../../../core/services/service/service.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {faCircleNotch, faEnvelope, faPencil, faPlus, faUpload,faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {History} from "../../../../core/models/entities/History";
import {HistoryService} from "../../../../core/services/history/history.service";


@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit {
  faPlus = faPlus;
  faUpload = faUpload;
  faEnvelope = faEnvelope;
  faPencil = faPencil;
  faCircleNotch = faCircleNotch;
  faInfoCircle=faInfoCircle;
  data?: History[];
  histories?: History[];
  submitted = false;
  serviceForm!: FormGroup;
  isEdit?: boolean;
  modalTitle?: string;
  historyToEdit?: History;
  allHistoryData?: History[];
  select = 5;
  isLoading = false;
  fields?: string;
  file?: File;
  isUploading?: boolean;
  @ViewChild('mymodal') templateRef?: TemplateRef<any>;
  @ViewChild('file') fileRef?: TemplateRef<any>;
  @ViewChild('fileInput', {static: true})
  public fileInput?: ElementRef<HTMLInputElement>;
  public selectedFile = false;
  topPageHeader?: string[];
  public links: string[];

  constructor(private _swal: MessagesModalService,
              private _authenticationService: AuthenticationService,
              private _userService: UserService,
              private historyService: HistoryService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              @Inject(LOCALE_ID) public locale: string) {
    this.topPageHeader = locale == "ar" ?["إدارة المستخدمين", "إدارة الخدمات", "تتبع العمل"] : ["Gestion des utilisateurs","Gestion des services","Suivi des actions"];
    this.links = ["/user-management","/service-management","/history"]

  }

  editService(service: Service) {
    this.isEdit = true;
    this.historyToEdit = service;
    this.modalTitle = "تعديل الخدمة";
    this.serviceForm.get("serviceName")?.setValue(service.serviceName);
    this.serviceForm.get("responsable")?.setValue(service.responsable);
    this.serviceForm.get("id")?.setValue(service.id);
    this.modalService.open(this.templateRef);
  }


  openFileModal() {
    this.modalService.open(this.fileRef);
  }


  title = 'appBootstrap';

  closeResult: string = '';

  open(content: any) {
    this.serviceForm.reset();
    this.isEdit = false;
    this.modalTitle = "إضافة خدمة";
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.serviceForm.invalid) {
      return;
    }
    const service = new Service();
    service.serviceName = this.serviceForm.get("serviceName")?.value;
    service.responsable = this.serviceForm.get("responsable")?.value;
    if (!this.isEdit) {
      this.historyService.create(service).subscribe(e => {
        this.historyService.getAll().subscribe(e => this.histories = e.splice(0, this.select));
        this.modalService.dismissAll();
        this._swal.toastSuccess("تمت إضافة الخدمة بنجاح ");
      }, error => this._swal.toastError(error.error.message));
    } else {
      service.id = this.serviceForm.get("id")?.value;
      this.fields = 'id,serviceName,responsable';
      this.historyService.updatePartial(service, this.fields).subscribe(e => {
        this.historyService.getAll().subscribe(e => {
          this.histories = e.splice(0, this.select);
          this._swal.toastSuccess("تم تعديل الخدمة بنجاح ");
        });
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
      return `with: ${reason}`;
    }
  }


  ngOnInit(): void {
    this.serviceForm = this.formBuilder.group({
      serviceName: ['', [Validators.required, Validators.minLength(3)]],
      responsable: ['', [Validators.required, Validators.minLength(3)]],
      id: ['']
    });
    this.historyService.getAll().subscribe(e => {
      this.histories = e.splice(0, this.select);
    });

    this.historyService.getAll().subscribe(e => {
      this.allHistoryData = e;
    });

  }


  selectPaginator(v: any) {
    this.historyService.getAll().subscribe(e => this.histories = e.splice(0, v));
  }

  search(e: string) {
    console.log(this.histories);
    if (e.length > 3) {
      this.histories = this.allHistoryData?.filter(data => data.action?.toLowerCase().includes(e.toLowerCase()) || data?.user?.firstname?.toLowerCase().includes(e.toLowerCase()) || data?.user?.lastname?.toLowerCase().includes(e.toLowerCase()));
      console.log(this.histories);
    } else
      this.historyService.getAll().subscribe(e => {
        this.histories = e.splice(0, this.select);
      });
  }

  onSwitchChange(val: any) {
    const service = new Service()
    service.id = val.target.value;
    this.fields = 'disabled';
    if (val.target.checked) {
      service.disabled = false;
      this.historyService.updatePartial(service, this.fields).subscribe(e => {
        this.historyService.getAll().subscribe(e => {
          this.histories = e.splice(0, this.select);
          this._swal.toastSuccess("تم تفعيل الخدمة بنجاح ")
        });
      }, error => console.log(error));
    } else {
      service.disabled = true;
      this.historyService.updatePartial(service, this.fields).subscribe(e => {
        this.historyService.getAll().subscribe(e => {
          this.histories = e.splice(0, this.select);
          this._swal.toastSuccess("تم تعطيل الخدمة بنجاح")
        });
      }, error => console.log(error));
    }
  }

  checkFile(v: any) {
    this.file = v.target.files[0];
    this.selectedFile = v.target.files[0] !== undefined;
  }

  importData() {
    // this.isUploading = true;
    // if (this.file)
    //   this.historyService.importServices(this.file).subscribe(e => {
    //     this._swal.toastSuccess("all services are created !");
    //     this.isUploading = false;
    //     this.modalService.dismissAll();
    //     this.selectedFile = false;
    //     this.ngOnInit()
    //   }, error => {
    //     this._swal.toastError(error.error.message);
    //     this.isUploading = false;
    //     this.selectedFile = false;
    //   });
  }


  sort(v: string) {

    // if (v&& this.data != undefined && v == "fullname"){
    //   this.data = this.data.sort((a,b) => {;
    //     if (b.firstname != undefined && a.firstname != undefined && a.firstname.toLowerCase() > b.firstname.toLowerCase())
    //       return 1
    //     else
    //       return -1
    //   });
    // }else if (v&& this.data != undefined && v == "role") {
    //   this.data = this.data.sort((a, b) => {
    //     if (b.role != undefined && a.role != undefined && a.role.toLowerCase() > b.role.toLowerCase())
    //       return 1
    //     else
    //       return -1
    //   });
    // }else if (v&& this.data != undefined && v == "email") {
    //   this.data = this.data.sort((a, b) => {
    //     if (b.email != undefined && a.email != undefined && a.email.toLowerCase() > b.email.toLowerCase())
    //       return 1
    //     else
    //       return -1
    //   });
    // }else if (v&& this.data != undefined && v == "service") {
    //   this.data = this.data.sort((a, b) => {
    //     if (b.service?.serviceName != undefined && a.service?.serviceName != undefined && a.service.serviceName.toLowerCase() > b.service.serviceName.toLowerCase())
    //       return 1
    //     else
    //       return -1
    //   });
    // } else
    //   this._userService.getAll().subscribe(e => {this.allUserData = e ;this.data = e.splice(0 , this.select);});

  }

  details(h:History) {
    this.historyToEdit = h;

      this.modalService.open(this.templateRef);


  }
}
