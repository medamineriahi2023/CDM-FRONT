import {Component, ElementRef, Inject, LOCALE_ID, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  faArchive,
  faBell,
  faCircleNotch,
  faEnvelope,
  faFilePdf,
  faInfoCircle,
  faPencil,
  faPlus,
  faPlusSquare,
  faQrcode,
  faSquareXmark,
  faUpload
} from "@fortawesome/free-solid-svg-icons";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SousCategory} from "../../../../core/models/entities/SousCategory";
import {Category} from "../../../../core/models/entities/Category";
import {Article} from "../../../../core/models/entities/Article";
import {Service} from "../../../../core/models/entities/Service";
import {Equipment} from "../../../../core/models/entities/Equipment";
import {MessagesModalService} from "../../../../core/services/messages-modal.service";
import {AuthenticationService} from "../../../../core/services/authentication/authentication.service";
import {UserService} from "../../../../core/services/user/user.service";
import {SortieStockService} from "../../../../core/services/sortieStock/sortie-stock.service";
import {ArticleService} from "../../../../core/services/article/article.service";
import {CategoryService} from "../../../../core/services/category/category.service";
import {SousCategoryService} from "../../../../core/services/sous-category/sous-category.service";
import {ServiceService} from "../../../../core/services/service/service.service";
import {EquipmentService} from "../../../../core/services/equipment/equipment.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient} from "@angular/common/http";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {User} from "../../../../core/models/entities/User";
import {StockStateService} from "../../../../core/services/stockState/stock-state.service";
import {StockState} from "../../../../core/models/entities/StockState";
import {Etat} from "../../../../core/models/entities/Etat";
import {SortieStock} from "../../../../core/models/entities/SortieStock";

@Component({
  selector: 'app-etat-stock',
  templateUrl: './etat-stock.component.html',
  styleUrls: ['./etat-stock.component.css']
})
export class EtatStockComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable!: ElementRef;
  faPlus = faPlus;
  faUpload = faUpload;
  faEnvelope = faEnvelope;
  faPencil = faPencil;
  faCircleNotch = faCircleNotch;
  faArchive = faArchive;
  faBell = faBell;
  faMultiply = faSquareXmark
  faInfoCircle = faInfoCircle;
  faPlusSquare = faPlusSquare;
  faFilePdf = faFilePdf
  faQrcode=faQrcode;
  data?: StockState[];
  stockStates?: StockState[];
  submitted = false;
  formGroup1!: FormGroup;
  isEdit?: boolean;
  modalTitle?: string;
  sortieStockToEdit?: StockState;
  allSortieStockData?: StockState[];
  select = 5;
  isLoading = false;
  fields?: string;
  file?: File;
  isUploading?: boolean;
  sousCategories?: SousCategory[];
  categories?: Category[];
  articles?: Article[];
  services?: Service[];
  equipments: Equipment[] = [];
  @ViewChild('mymodal') templateRef?: TemplateRef<any>;
  @ViewChild('infoModal') infoModal?: TemplateRef<any>;
  public fileInput?: ElementRef<HTMLInputElement>;
  public selectedFile = false;
  topPageHeader?: string[];
  public links: string[];
  date?: Date;
  stockStateToDisplay?: StockState;
  sortieStockToDisplay?: SortieStock;
  users?:User[];
  equs?: Equipment[];
  infoToDisplay?: Equipment[];
  stockStatesFiltred?: StockState[] = [];
  public articleToDisplay?: Article;

  constructor(@Inject(LOCALE_ID) public locale: string,
              private _swal: MessagesModalService,
              private _authenticationService: AuthenticationService,
              private _userService: UserService,
              private stockStateService: StockStateService,
              private sortieStockService: SortieStockService,
              private articleService: ArticleService,
              private categoryService: CategoryService,
              private sousCategoryService: SousCategoryService,
              private serviceService: ServiceService,
              private equipmentService: EquipmentService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private _http: HttpClient) {
    this.topPageHeader = locale == "ar" ? ["إدارة المواد", "المستودع", "حالة المستودع"] : ["Gestion des Articles", "Sortie stock", "Etat du stock"];
    this.links = ["/article-management", "/out-stock", "/etat-stock"]
  }

  title = 'appBootstrap';

  closeResult: string = '';

  async openInfoModal(article : any) {
    this.articleToDisplay = article;
    this.infoToDisplay = this.equs?.filter(e=> e?.article?.id == article.id);

   await this.infoToDisplay?.forEach((e) => {this.stockStateService.getByEquipment(e).subscribe(a=> {
     e.service = a?.fournisseur;
     e.etatStock = a;
     this.sortieStockService.getByEquipment(e).subscribe(a=> {
       if (!e.service)
       e.service = a?.service;
       e.sortieStock = a;
     });
   })
   });
   console.log(this.infoToDisplay);
    await this.modalService.open(this.infoModal, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});

  }

  open(content: any) {
    this.formGroup1.reset();
    this.equipment.removeAt(this.equipment.length - 1);
    this.addEquipmentField();


    this.isEdit = false;
    this.modalTitle = this.locale == "ar" ? "إضافة توصيل جديد" : "Ajouter nouvelle livraison";
    this.modalService.open(content, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async onSubmit(value: any) {
    this.stockStateToDisplay = new StockState();
    this.date = new Date();
    this.submitted = true;
    // if (this.formGroup.invalid) {
    //   return;
    // }
    const stockState = new StockState();
    stockState.numBl = this.formGroup1.get("numCde")?.value;
    const user = new User();
    user.id = this.formGroup1.get("signataire")?.value;
    stockState.signataire = user;
    const service = new Service();
    service.id = this.formGroup1.get("services")?.value;
    stockState.fournisseur = service;
    let fields = "id,qteTotal";
    value.equipment.map((e: any) => {
      let equipment = new Equipment();
      equipment.qte = e.qte1;
      let article = new Article();
      article.id = e.article;
      let ar = this.articles?.find(article => article.id == e.article);
      article.qteTotal = e.qte1 + ar?.qteTotal;
      this.articleService.updatePartial(article,fields).subscribe(e => e);
      equipment.article = article;
      let category = new Category();
      category.id = e.category;
      equipment.category = category;
      let sousCategory = new SousCategory();
      sousCategory.id = e.sousCategory;
      equipment.sousCategory = sousCategory;
      equipment.etat = Etat.ENTREE;
      this.equipments.push(equipment);
    })
    stockState.equipments = [];
    this.equipmentService.createAll(this.equipments).subscribe(e => {
        e.map(s => {
          let equipment = new Equipment();
          equipment.id = s.id;
          stockState.equipments?.push(equipment);
        })
        this.stockStateService.create(stockState).subscribe(e => {
          this.stockStateToDisplay = <StockState>e;
          this.stockStateService.getAll().subscribe(e => this.stockStates = e.splice(0, this.select));
          this._swal.toastSuccess(this.locale == "ar" ? "تمت إضافة الخروج من المستودع بنجاح " : "Le sortie du stock a été ajouté avec succès");
        }, error => this._swal.toastError(error.error.message));
      }
      , error => console.log(error));


  }

  private getDismissReason(reason: any): string {
    this.formGroup1.reset();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  ngOnInit(): void {
    this.formGroup1 = this.formBuilder.group({
      numCde: ['', [Validators.required, Validators.minLength(3)]],
      signataire: ['', [Validators.required]],
      services: ['', [Validators.required]],
      equipment: this.buildEquipments([{category: null, article: null, sousCategory: null, qte1: null}]),
      id: ['']
    });
    this.stockStateService.getAll().subscribe(e => {
      this.allSortieStockData = e;
      this.stockStates = e.splice(0, this.select)
    });
    this.categoryService.getAll().subscribe(e => this.categories = e);
    this.articleService.getAll().subscribe(e=> this.articles = e.filter(s=> !s.archived));
    this.sousCategoryService.getAll().subscribe(e => this.sousCategories = e);
    this.serviceService.getAll().subscribe(e => this.services = e);
    this._userService.getAll().subscribe(e => this.users = e);
    this.equipmentService.getAll().subscribe(e => this.equs = e);
  }


  buildEquipments(equipement: { category: string | null; article: string | null; sousCategory: string | null; qte1: string | null }[] = []) {
    return this.formBuilder.array(equipement.map(e => this.formBuilder.group(e)));
  }

  addEquipmentField() {
    this.equipment.push(this.formBuilder.group({
      category: [null, Validators.required],
      article: [null, Validators.required],
      sousCategory: [null, Validators.required],
      qte1: [null, Validators.required ]
    }))
  }

  removeEquipmentField(index: number): void {
    if (this.equipment.length > 1) this.equipment.removeAt(index);
    else this.equipment.patchValue([{
      category: [null, Validators.required],
      article: [null, Validators.required],
      sousCategory: [null, Validators.required],
      qte1: [null, Validators.required]
    }]);
  }

  get equipment(): FormArray {
    return this.formGroup1.get('equipment') as FormArray;
  }


  selectPaginator(v: any) {
    this.stockStateService.getAll().subscribe(e => this.stockStates = e.splice(0, v));
  }

  search(e: string) {
    if (e.length > 3) {
      this.stockStates = this.allSortieStockData?.filter(data => data.signataire?.firstname?.toLowerCase()?.includes(e.toLowerCase()) || data.numBl?.toString().toLowerCase()?.includes(e.toLowerCase()) || data?.fournisseur?.serviceName?.toLowerCase()?.includes(e.toLowerCase()));
    } else
      this.stockStateService.getAll().subscribe(e => {
        this.stockStates = e.splice(0, this.select);
      });
  }

  onSwitchChange(val: any) {
    const service = new Service()
    service.id = val.target.value;
    this.fields = 'disabled';
    if (val.target.checked) {
      service.disabled = false;
      this.stockStateService.updatePartial(service, this.fields).subscribe(e => {
        this.stockStateService.getAll().subscribe(e => {
          this.stockStates = e.splice(0, this.select);
          this._swal.toastSuccess(this.locale == "ar" ? "تم تفعيل الخدمة بنجاح " : "Le service a été activé avec succès")
        });
      }, error => console.log(error));
    } else {
      service.disabled = true;
      this.stockStateService.updatePartial(service, this.fields).subscribe(e => {
        this.stockStateService.getAll().subscribe(e => {
          this.stockStates = e.splice(0, this.select);
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
    this.stockStateService.updatePartial(article, this.fields).subscribe(e => {
      this.stockStateService.getAll().subscribe(e => {
        this.stockStates = e.splice(0, this.select);
        this._swal.toastSuccess(this.locale == "ar" ? "تم أرشفة المادة بنجاح " : "L'article a été archivé avec succès");
      });
      this.modalService.dismissAll();
    }, error => console.log(error));
  }

  public openPDF(e?: any): void {
    let DATA: any;
    if (e?.numBl != null){
    this.stockStateToDisplay= e;
    }else if (e?.numCommande != null){
      this.sortieStockToDisplay =e;
    }
    setTimeout(()=> {
      if (e?.numBl != null){
      DATA= document.getElementById('toPDF');
      }else {
        DATA= document.getElementById('sortieToPDF');
      }

    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('justification.pdf');
    });
    },1000)
  }
}
