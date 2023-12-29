import {Component, ElementRef, Inject, LOCALE_ID, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Article} from "../../../../core/models/entities/Article";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SousCategory} from "../../../../core/models/entities/SousCategory";
import {Category} from "../../../../core/models/entities/Category";
import {MessagesModalService} from "../../../../core/services/messages-modal.service";
import {AuthenticationService} from "../../../../core/services/authentication/authentication.service";
import {UserService} from "../../../../core/services/user/user.service";
import {SousCategoryService} from "../../../../core/services/sous-category/sous-category.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Service} from "../../../../core/models/entities/Service";
import {
  faArchive,
  faBell,
  faCircleNotch,
  faEnvelope,
  faFilePdf,
  faPencil,
  faPlus,
  faUpload,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import {Receiver} from "../../../../core/models/entities/Receiver";
import {ReceiverService} from "../../../../core/services/receiver/receiver.service";
import {FileService} from "../../../../core/services/file/file.service";
// @ts-ignore
import {saveAs} from "file-saver";
import {Canal} from "../../../../core/models/entities/Canal";
import {CanalService} from "../../../../core/services/canal/canal.service";
import {FileBlob} from "../../../../core/models/entities/FileBlob";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {TrackingMotionService} from "../../../../core/services/trackingMotion/tracking-motion.service";
import {TrackingMotion} from "../../../../core/models/entities/TrackingMotion";

@Component({
  selector: 'app-receiver-page',
  templateUrl: './receiver-page.component.html',
  styleUrls: ['./receiver-page.component.css']
})
export class ReceiverPageComponent implements OnInit {

  faPlus = faPlus;
  faDownload = faDownload;
  faEnvelope = faEnvelope;
  faPencil = faPencil;
  faCircleNotch = faCircleNotch;
  faArchive = faArchive;
  faBell = faBell;
  faFilePdf=faFilePdf
  data?: Receiver[];
  receivers?: Receiver[];
  submitted = false;
  formGroup!: FormGroup;
  isEdit?: boolean;
  modalTitle?: string;
  ReceiverToEdit?: Receiver;
  allReceiversData?: Receiver[];
  select = 5;
  isLoading = false;
  fields?: string;
  file?: File;
  isUploading?: boolean;
  canals?: Canal[];
  @ViewChild('mymodal') templateRef?: TemplateRef<any>;
  public fileInput?: ElementRef<HTMLInputElement>;
  public selectedFile = false;
  topPageHeader?: string[];
  public links: string[];

  constructor(@Inject(LOCALE_ID) public locale: string,
              private _swal: MessagesModalService,
              private _authenticationService: AuthenticationService,
              private _userService: UserService,
              private receiverService: ReceiverService,
              private canalService: CanalService,
              private sousCategoryService: SousCategoryService,
              private trackingService: TrackingMotionService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private fileService:FileService) {
    this.topPageHeader = locale == "ar" ? ["البريد", "المبعوث", "تتبع التحركات"] : ["Reçus", "Emis", "Suivi mouvement"];
    this.links = ["/receiver", "/sender", "/tracking"]
  }

  downloadFile(fileId?:any ) {
    if (fileId?.id) {
      this.fileService.get(fileId?.id).subscribe(response=> {
        const blob = response.body;
        saveAs(blob, "document."+fileId?.extention);
      });
    }
  }

  title = 'appBootstrap';

  closeResult: string = '';
  sousCatName?: string;
  categoryName?: string;

  open(content: any) {
    this.formGroup.reset();
    this.isEdit = false;
    this.modalTitle = this.locale == "ar" ? "إضافة بريد" : "Ajouter un mail";
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const receiver = new Receiver();
    receiver.numReceiver = this.formGroup.get("numReceiver")?.value;
    const date = this.formGroup.get("date")?.value;
    let d = new Date();
    d.setFullYear(date.year, date.month, date.day);
    receiver.date = d;
    receiver.objet = this.formGroup.get("objet")?.value;
    receiver.emitteur = this.formGroup.get("emitteur")?.value;
    const canal = new Canal();
    canal.id = this.formGroup.get("canal")?.value;
    receiver.canal = canal;
    if (this.file){
    this.fileService.importFile(this.file!).subscribe(e => {
      const fileBlob = new FileBlob();
      // @ts-ignore
      fileBlob.id = e?.id;
      receiver.fileBlob= fileBlob;
      this.receiverService.create(receiver).subscribe(e => {
        let tracking = new TrackingMotion();
        let r = new Receiver();
        // @ts-ignore
        r.id = e.id;
        tracking.receiver = r;
        this.trackingService.create(tracking).subscribe(a => console.log(a));
        this.receiverService.getAll().subscribe(e => this.receivers = e.splice(0, this.select));
        this.modalService.dismissAll();
        this._swal.toastSuccess(this.locale == "ar" ? "تمت إضافة البريد بنجاح " : "L'email a été ajouté avec succès");
      }, error => this._swal.toastError(error.error.message));
    })
    }else {
      this.receiverService.create(receiver).subscribe(e => {
        this.receiverService.getAll().subscribe(e => this.receivers = e.splice(0, this.select));
        this.modalService.dismissAll();
        this._swal.toastSuccess(this.locale == "ar" ? "تمت إضافة البريد بنجاح " : "L'email a été ajouté avec succès");
      }, error => this._swal.toastError(error.error.message));
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
    this.formGroup = this.formBuilder.group({
      numReceiver: ['', [Validators.required, Validators.minLength(3)]],
      date: [new Date(), [Validators.required, Validators.minLength(3)]],
      emitteur: ['', [Validators.required]],
      objet: ['', [Validators.required]],
      canal: ['', [Validators.required]],
      id : ['']
    });
    this.receiverService.getAll().subscribe(e => {
      this.allReceiversData = e;
      this.receivers = e.splice(0, this.select)
    });
    this.canalService.getAll().subscribe(e => this.canals = e);

  }


  selectPaginator(v: any) {
    this.receiverService.getAll().subscribe(e => this.receivers = e.splice(0, v));
  }

  search(e: string) {
    if (e.length >= 1) {
      this.receivers = this.allReceiversData?.filter(data => data.numReceiver?.toString()?.toLowerCase()?.includes(e.toLowerCase()) || data.canal?.canalName?.toString().toLowerCase()?.includes(e.toLowerCase()) || data?.emitteur?.toLowerCase()?.includes(e.toLowerCase()) || data?.objet?.toLowerCase()?.includes(e.toLowerCase()));
    } else
      this.receiverService.getAll().subscribe(e => {
        this.receivers = e.splice(0, this.select);
      });
  }

  onSwitchChange(val: any) {
    const service = new Service()
    service.id = val.target.value;
    this.fields = 'disabled';
    if (val.target.checked) {
      service.disabled = false;
      this.receiverService.updatePartial(service, this.fields).subscribe(e => {
        this.receiverService.getAll().subscribe(e => {
          this.receivers = e.splice(0, this.select);
          this._swal.toastSuccess(this.locale == "ar" ? "تم تفعيل الخدمة بنجاح " : "Le service a été activé avec succès")
        });
      }, error => console.log(error));
    } else {
      service.disabled = true;
      this.receiverService.updatePartial(service, this.fields).subscribe(e => {
        this.receiverService.getAll().subscribe(e => {
          this.receivers = e.splice(0, this.select);
          this._swal.toastSuccess(this.locale == "ar" ? "تم تعطيل الخدمة بنجاح" : "Le service a été disactivé avec succès")
        });
      }, error => console.log(error));
    }
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

  archive(id: any) {
    const article = new Article();
    article.id = id;
    article.archived = true;
    this.fields = 'id,archived';
    this.receiverService.updatePartial(article, this.fields).subscribe(e => {
      this.receiverService.getAll().subscribe(e => {
        this.receivers = e.splice(0, this.select);
        this._swal.toastSuccess(this.locale == "ar" ? "تم أرشفة المادة بنجاح " : "L'article a été archivé avec succès");
      });
      this.modalService.dismissAll();
    }, error => console.log(error));
  }

  checkFile(v : any) {
    this.file = v.target.files[0];
    this.selectedFile = v.target.files[0] !== undefined;
  }

  public openPDF(): void {
    // @ts-ignore
    document.getElementById('toHide').style.display = 'block';
    // @ts-ignore
    document.getElementById('hide').style.opacity = '0';
    let DATA: any = document.getElementById('toPDF');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('resume.pdf');
      // @ts-ignore
      document.getElementById('toHide').style.display = 'none';
      // @ts-ignore
      document.getElementById('hide').style.opacity = '1';
    });
  }
}
