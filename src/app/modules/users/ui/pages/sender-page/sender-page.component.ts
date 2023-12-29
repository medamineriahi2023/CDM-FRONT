import {Component, ElementRef, Inject, LOCALE_ID, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Canal} from "../../../../core/models/entities/Canal";
import {MessagesModalService} from "../../../../core/services/messages-modal.service";
import {AuthenticationService} from "../../../../core/services/authentication/authentication.service";
import {UserService} from "../../../../core/services/user/user.service";
import {CanalService} from "../../../../core/services/canal/canal.service";
import {SousCategoryService} from "../../../../core/services/sous-category/sous-category.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FileService} from "../../../../core/services/file/file.service";
import {FileBlob} from "../../../../core/models/entities/FileBlob";
import {Service} from "../../../../core/models/entities/Service";
import {Article} from "../../../../core/models/entities/Article";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// @ts-ignore
import {saveAs} from "file-saver";
import {
  faArchive,
  faBell,
  faCircleNotch,
  faDownload,
  faEnvelope,
  faFilePdf,
  faPencil,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import {Sender} from "../../../../core/models/entities/Sender";
import {SenderService} from "../../../../core/services/sender/sender.service";
import {ServiceService} from "../../../../core/services/service/service.service";

@Component({
  selector: 'app-sender-page',
  templateUrl: './sender-page.component.html',
  styleUrls: ['./sender-page.component.css']
})
export class SenderPageComponent implements OnInit {

  faPlus = faPlus;
  faDownload = faDownload;
  faEnvelope = faEnvelope;
  faPencil = faPencil;
  faCircleNotch = faCircleNotch;
  faArchive = faArchive;
  faBell = faBell;
  faFilePdf=faFilePdf
  data?: Sender[];
  senders?: Sender[];
  submitted = false;
  formGroup!: FormGroup;
  isEdit?: boolean;
  modalTitle?: string;
  allSendersData?: Sender[];
  select = 5;
  isLoading = false;
  fields?: string;
  file?: File;
  isUploading?: boolean;
  canals?: Canal[];
  services?: Service[];
  @ViewChild('mymodal') templateRef?: TemplateRef<any>;
  public fileInput?: ElementRef<HTMLInputElement>;
  public selectedFile = false;
  topPageHeader?: string[];
  public links: string[];

  constructor(@Inject(LOCALE_ID) public locale: string,
              private _swal: MessagesModalService,
              private _authenticationService: AuthenticationService,
              private _userService: UserService,
              private senderService: SenderService,
              private canalService: CanalService,
              private serviceService: ServiceService,
              private sousCategoryService: SousCategoryService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private fileService:FileService) {
    this.topPageHeader = locale == "ar" ? ["البريد", "المبعوث", "تتبع التحركات"] : ["Reçus", "Emis", "Suivi mouvement"];
    this.links = ["/receiver", "/sender", "/tracking"]
  }

  downloadFile(fileId?:any ) {
    console.log(fileId);
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
    const sender = new Sender();
    sender.numSender = this.formGroup.get("numSender")?.value;
    const date = this.formGroup.get("date")?.value;
    let d = new Date();
    d.setFullYear(date.year, date.month, date.day);
    sender.date = d;
    sender.objet = this.formGroup.get("objet")?.value;
    sender.distinataire = this.formGroup.get("destinataire")?.value;
    const emitteur = new Service();
    emitteur.id = this.formGroup.get("emitteur")?.value;
    sender.emitteur = emitteur;
    const canal = new Canal();
    canal.id = this.formGroup.get("canal")?.value;
    sender.canal = canal;
    if (this.file){
      this.fileService.importFile(this.file!).subscribe(e => {
        const fileBlob = new FileBlob();
        // @ts-ignore
        fileBlob.id = e?.id;
        sender.fileBlob= fileBlob;
        this.senderService.create(sender).subscribe(e => {
          this.senderService.getAll().subscribe(e => this.senders = e.splice(0, this.select));
          this.modalService.dismissAll();
          this._swal.toastSuccess(this.locale == "ar" ? "تمت إضافة البريد بنجاح " : "L'email a été ajouté avec succès");
        }, error => this._swal.toastError(error.error.message));
      })
    }else {
      this.senderService.create(sender).subscribe(e => {
        this.senderService.getAll().subscribe(e => this.senders = e.splice(0, this.select));
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
      numSender: [null, [Validators.required]],
      date: [null, [Validators.required]],
      emitteur: [null, [Validators.required]],
      objet: [null, [Validators.required]],
      canal: [null, [Validators.required]],
      destinataire: [null, [Validators.required]],
      id : [null]
    });
    this.senderService.getAll().subscribe(e => {
      this.allSendersData = e;
      this.senders = e.splice(0, this.select)
    });
    this.canalService.getAll().subscribe(e => this.canals = e);
    this.serviceService.getAll().subscribe(e => this.services = e);

  }


  selectPaginator(v: any) {
    this.senderService.getAll().subscribe(e => this.senders = e.splice(0, v));
  }

  search(e: string) {
    if (e.length >= 1) {
      this.senders = this.allSendersData?.filter(data => data.numSender?.toString()?.toLowerCase()?.includes(e.toLowerCase()) || data.canal?.canalName?.toString().toLowerCase()?.includes(e.toLowerCase()) || data?.emitteur?.serviceName?.toLowerCase()?.includes(e.toLowerCase()) || data?.objet?.toLowerCase()?.includes(e.toLowerCase()));
    } else
      this.senderService.getAll().subscribe(e => {
        this.senders = e.splice(0, this.select);
      });
  }

  onSwitchChange(val: any) {
    const service = new Service()
    service.id = val.target.value;
    this.fields = 'disabled';
    if (val.target.checked) {
      service.disabled = false;
      this.senderService.updatePartial(service, this.fields).subscribe(e => {
        this.senderService.getAll().subscribe(e => {
          this.senders = e.splice(0, this.select);
          this._swal.toastSuccess(this.locale == "ar" ? "تم تفعيل الخدمة بنجاح " : "Le service a été activé avec succès")
        });
      }, error => console.log(error));
    } else {
      service.disabled = true;
      this.senderService.updatePartial(service, this.fields).subscribe(e => {
        this.senderService.getAll().subscribe(e => {
          this.senders = e.splice(0, this.select);
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
    this.senderService.updatePartial(article, this.fields).subscribe(e => {
      this.senderService.getAll().subscribe(e => {
        this.senders = e.splice(0, this.select);
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
