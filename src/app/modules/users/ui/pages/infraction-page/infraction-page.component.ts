import {Component, ElementRef, Inject, LOCALE_ID, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TrackingMotion} from "../../../../core/models/entities/TrackingMotion";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Canal} from "../../../../core/models/entities/Canal";
import {MessagesModalService} from "../../../../core/services/messages-modal.service";
import {AuthenticationService} from "../../../../core/services/authentication/authentication.service";
import {UserService} from "../../../../core/services/user/user.service";
import {ReceiverService} from "../../../../core/services/receiver/receiver.service";
import {CanalService} from "../../../../core/services/canal/canal.service";
import {SousCategoryService} from "../../../../core/services/sous-category/sous-category.service";
import {TrackingMotionService} from "../../../../core/services/trackingMotion/tracking-motion.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FileService} from "../../../../core/services/file/file.service";
import {Receiver} from "../../../../core/models/entities/Receiver";
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
  faEnvelope,
  faFilePdf,
  faPencil,
  faPlayCircle,
  faUpload,
  faDownload,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import {Infraction} from "../../../../core/models/entities/Infraction";
import {InfractionService} from "../../../../core/services/Infraction/infraction.service";
import {PlainteService} from "../../../../core/services/plainte/plainte.service";
import {Plainte} from "../../../../core/models/entities/Plainte";
@Component({
  selector: 'app-infraction-page',
  templateUrl: './infraction-page.component.html',
  styleUrls: ['./infraction-page.component.css']
})
export class InfractionPageComponent implements OnInit {
  faPlayCircle = faPlayCircle;
  faDownload = faDownload;
  faEnvelope = faEnvelope;
  faPencil = faPencil;
  faCircleNotch = faCircleNotch;
  faArchive = faArchive;
  faBell = faBell;
  faFilePdf=faFilePdf
  faPlus=faPlus
  data?: Infraction[];
  infractions?: Infraction[];
  submitted = false;
  formGroup!: FormGroup;
  isEdit?: boolean;
  modalTitle?: string;
  allInfractionData?: Infraction[];
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
  selectedItems?: string[] = [];
   plaintes?: Plainte[];

  constructor(@Inject(LOCALE_ID) public locale: string,
              private _swal: MessagesModalService,
              private _authenticationService: AuthenticationService,
              private _userService: UserService,
              private infractionService1: InfractionService,
              private plainteService: PlainteService,
              private canalService: CanalService,
              private sousCategoryService: SousCategoryService,
              private infractionService: InfractionService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private fileService:FileService) {
    this.topPageHeader = locale == "ar" ? ["جدول القرارات", "جدول المخالفات", "جدول الشكاوي"] : ["Tableaux des plaintes", "Tableaux des infractions", "Tableaux des décisions"];
    this.links = ["/decision", "/infraction", "/plaintes"]
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
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size :'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  createForm(){
    this.formGroup = this.formBuilder.group({
      numPlainte: ['', [Validators.required]],
      date: [new Date(), [Validators.required, Validators.minLength(3)]],
      time: [{ hour: 0, minute: 0 }, [Validators.required]],
      numInfraction: ['', [Validators.required]],
      aideAffectee: ['', [Validators.required]],
      cin: ['', [Validators.required]],
      objet: ['', [Validators.required]],
      niveauTravaux: ['', [Validators.required]],
      dommages: ['', [Validators.required]],
      decision: ['', [Validators.required]],
      id: ['']
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    const infraction = new Infraction();
    infraction.numInfraction = this.formGroup.get("numInfraction")?.value;
    const date = this.formGroup.get("date")?.value;
    const time = this.formGroup.get("time")?.value;
    let d = new Date();
    d.setFullYear(date.year, date.month, date.day);
    d.setHours(time.hour , time.minute);
    infraction.date = d;
    infraction.objet = this.formGroup.get("objet")?.value;
    infraction.aideAffectee = this.formGroup.get("aideAffectee")?.value;
    infraction.cin = this.formGroup.get("cin")?.value;
    infraction.objet = this.formGroup.get("objet")?.value;
    infraction.niveauTravaux = this.formGroup.get("niveauTravaux")?.value;
    infraction.dommages = this.formGroup.get("dommages")?.value;
    infraction.decision = this.formGroup.get("decision")?.value;
    const plainte = new Plainte();
    plainte.id = this.formGroup.get("numPlainte")?.value;
    infraction.plainte = plainte;
    if (this.file){
      this.fileService.importFile(this.file!).subscribe(e => {
        const fileBlob = new FileBlob();
        // @ts-ignore
        fileBlob.id = e?.id;
        infraction.fileBlob= fileBlob;
        this.infractionService1.create(infraction).subscribe(e => {
          this.infractionService1.getAll().subscribe(e => this.infractions = e.splice(0, this.select));
          this.modalService.dismissAll();
          this._swal.toastSuccess(this.locale == "ar" ? "تمت إضافة المخالفة بنجاح " : "L'infraction a été ajouté avec succès");
        }, error => this._swal.toastError(error.error.message));
      })
    }else {
      this.infractionService1.create(infraction).subscribe(e => {
        this.infractionService1.getAll().subscribe(e => this.infractions = e.splice(0, this.select));
        this.modalService.dismissAll();
        this._swal.toastSuccess(this.locale == "ar" ? "تمت إضافة المخالفة بنجاح " : "L'infraction a été ajouté avec succès");
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


  async ngOnInit(): Promise<void> {
    this.createForm();
    await this.getAllData();
    this.canals = await this.canalService.getAll().toPromise();
  }



  async getAllData(): Promise<void> {
    try {
      const allInfractionData = await this.infractionService.getAll().toPromise();
      this.allInfractionData = allInfractionData;
      this.infractions = allInfractionData?.splice(0, this.select);
      this.plainteService.getAll().subscribe(e => this.plaintes = e);
    } catch (error) {
      console.error(error);
    }
  }


  selectPaginator(v: any) {
    this.infractionService.getAll().subscribe(e => this.infractions = e.splice(0, v));
  }

  search(e: string) {
    // if (e.length >= 1) {
    //   this.trackingMotions = this.allTrackingData?.filter(data => data.numReceiver?.toString()?.toLowerCase()?.includes(e.toLowerCase()) || data.canal?.canalName?.toString().toLowerCase()?.includes(e.toLowerCase()) || data?.emitteur?.toLowerCase()?.includes(e.toLowerCase()) || data?.objet?.toLowerCase()?.includes(e.toLowerCase()));
    // } else
    //   this.infractionService1.getAll().subscribe(e => {
    //     this.trackingMotions = e.splice(0, this.select);
    //   });
  }

  onSwitchChange(val: any) {
    const service = new Service()
    service.id = val.target.value;
    this.fields = 'disabled';
    if (val.target.checked) {
      service.disabled = false;
      this.infractionService1.updatePartial(service, this.fields).subscribe(e => {
        this.infractionService1.getAll().subscribe(e => {
          this.infractions = e.splice(0, this.select);
          this._swal.toastSuccess(this.locale == "ar" ? "تم تفعيل الخدمة بنجاح " : "Le service a été activé avec succès")
        });
      }, error => console.log(error));
    } else {
      service.disabled = true;
      this.infractionService1.updatePartial(service, this.fields).subscribe(e => {
        this.infractionService1.getAll().subscribe(e => {
          this.infractions = e.splice(0, this.select);
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
    this.infractionService1.updatePartial(article, this.fields).subscribe(e => {
      this.infractionService1.getAll().subscribe(e => {
        this.infractions = e.splice(0, this.select);
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

  addValue(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.handleChecked(checkbox.value);
    } else {
      this.handleUnChecked(checkbox.value);
    }
  }

  handleChecked(checkedValue:string){
    if (!this.selectedItems?.includes(checkedValue))
      this.selectedItems?.push(checkedValue);
  }

  handleUnChecked(checkedValue:string){
    if (this.selectedItems?.includes(checkedValue))
      this.selectedItems?.splice(this.selectedItems.indexOf(checkedValue), 1);
  }
}
