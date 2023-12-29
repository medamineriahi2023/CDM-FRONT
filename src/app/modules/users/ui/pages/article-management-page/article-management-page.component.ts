import {Component, ElementRef, Inject, LOCALE_ID, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Service} from "../../../../core/models/entities/Service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessagesModalService} from "../../../../core/services/messages-modal.service";
import {AuthenticationService} from "../../../../core/services/authentication/authentication.service";
import {UserService} from "../../../../core/services/user/user.service";
import {ServiceService} from "../../../../core/services/service/service.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {faCircleNotch, faEnvelope, faPencil, faPlus, faUpload,faArchive,faBell} from '@fortawesome/free-solid-svg-icons';
import {Article} from "../../../../core/models/entities/Article";
import {ArticleService} from "../../../../core/services/article/article.service";
import {Category} from "../../../../core/models/entities/Category";
import {SousCategory} from "../../../../core/models/entities/SousCategory";
import {CategoryService} from "../../../../core/services/category/category.service";
import {SousCategoryService} from "../../../../core/services/sous-category/sous-category.service";
import {FileService} from "../../../../core/services/file/file.service";


@Component({
  selector: 'app-article-management-page',
  templateUrl: './article-management-page.component.html',
  styleUrls: ['./article-management-page.component.css']
})
export class ArticleManagementPageComponent implements OnInit {
  faPlus=faPlus;
  faUpload=faUpload;
  faEnvelope= faEnvelope;
  faPencil=faPencil;
  faCircleNotch= faCircleNotch;
  faArchive=faArchive;
  faBell=faBell;
  data?: Article[];
  articles?: Article[];
  submitted = false;
  formGroup!: FormGroup;
  isEdit? :boolean;
  modalTitle?: string;
  articlesToEdit?:Article;
  allArticlesData?: Article[];
  select = 5;
  isLoading = false;
  fields?: string;
  file? : File;
  isUploading?: boolean;
  sousCategories?: SousCategory[];
  categories?: Category[];
  start = 0;
  startIndex = 0;
  endIndex = this.select;
  @ViewChild('mymodal') templateRef?: TemplateRef<any>;
  @ViewChild('sousCat') sousCat?: TemplateRef<any>;
  @ViewChild('categoryModal') categoryModal?: TemplateRef<any>;
  public fileInput?: ElementRef<HTMLInputElement>;
  public selectedFile = false;
  topPageHeader? : string[];
  public links: string[];
  constructor(@Inject(LOCALE_ID) public locale: string,
              private _swal : MessagesModalService,
              private _authenticationService : AuthenticationService,
              private _userService : UserService,
              private articleService : ArticleService,
              private categoryService : CategoryService,
              private sousCategoryService : SousCategoryService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private fileService:FileService) {
    this.topPageHeader = locale == "ar" ?["إدارة المواد","المستودع","حالة المستودع"] : ["Gestion des Articles","Sortie stock","Etat du stock"];
    this.links = ["/article-management","/out-stock","/etat-stock"]
  }

  leftArrowClick() {
    if (this.start > 0) {
      this.endIndex -= this.select;
      this.startIndex -= this.select;
      this.articles = this.allArticlesData?.slice(this.startIndex, this.endIndex);
      this.start--;
    }
  }

  rightArrowClick() {
    // @ts-ignore
    if (Number.parseInt(this.endIndex) + Number.parseInt(this.select) <= this.allArticlesData.length) {
      this.startIndex = Number.parseInt(String(this.endIndex));
      this.endIndex += Number.parseInt(String(this.select));
      this.articles = this.allArticlesData?.slice(this.startIndex, this.endIndex);
      this.start++;
    }
  }


  editArticle(article:Article){
    this.isEdit = true;
    this.articlesToEdit = article;
    this.modalTitle = this.locale == "ar" ? "تعديل المادة" : "Modifier un article";
    this.formGroup.get("articleName")?.setValue(article.name);
    this.formGroup.get("code")?.setValue(article.code);
    this.formGroup.get("min")?.setValue(article.stockMin);
    this.formGroup.get("critic")?.setValue(article.stockCri);
    this.formGroup.get("id")?.setValue(article.id);
    this.formGroup.get("sousCategory")?.setValue(article.sousCategory?.id);
    this.formGroup.get("category")?.setValue(article.category?.id);
    this.modalService.open(this.templateRef);
  }


  title = 'appBootstrap';

  closeResult: string = '';
  sousCatName?: string;
  categoryName?: string;
  open(content :any) {
    this.formGroup.reset();
    this.isEdit = false;
    this.modalTitle = this.locale == "ar"? "إضافة مادة" : "Ajouter un article";
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
    const article = new Article();
    article.name = this.formGroup.get("articleName")?.value;
    article.stockCri = this.formGroup.get("critic")?.value;
    article.stockMin = this.formGroup.get("min")?.value;
    article.code = this.formGroup.get("code")?.value;
    const cat = new Category();
    const sousCat = new SousCategory();
    cat.id = this.formGroup.get("category")?.value;
    sousCat.id = this.formGroup.get("sousCategory")?.value;
    article.category = cat;
    article.sousCategory = sousCat;
    if (!this.isEdit) {
      this.articleService.create(article).subscribe(e => {
        this.articleService.getAll().subscribe(e => this.articles = e.filter(ar => !ar.archived).splice(0, this.select));
        this.modalService.dismissAll();
        this._swal.toastSuccess(this.locale == "ar"? "تمت إضافة المادة بنجاح " : "L'article a été ajouté avec succès");
      }, error => this._swal.toastError(error.error.message));
    }
    else {
      article.id = this.formGroup.get("id")?.value;
      this.fields = 'id,name,stockCri,stockMin,code,category,sousCategory';
      this.articleService.updatePartial(article, this.fields).subscribe(e => {
        this.articleService.getAll().subscribe(e => {this.articles = e.filter(ar => !ar.archived).splice(0, this.select) ; this._swal.toastSuccess(this.locale=="ar"?"تم تعديل المادة بنجاح " :"L'article a été modifié avec succès");});
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
    this.formGroup = this.formBuilder.group({
      articleName: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', [Validators.required, Validators.minLength(3)]],
      min: ['', [Validators.required]],
      critic: ['', [Validators.required]],
      sousCategory: ['', [Validators.required]],
      category: ['', [Validators.required]],
      id : ['']
    });
    this.articleService.getAll().subscribe(e=> {this.allArticlesData = e ; this.articles = e.filter(ar => !ar.archived).splice(0, this.select);
      const range = Array.from({ length: this.allArticlesData.length / this.select + 1 }, (_, i) => i * this.select);
      console.log(range);
    });
    this.categoryService.getAll().subscribe(e=> this.categories = e );
    this.sousCategoryService.getAll().subscribe(e=> this.sousCategories = e);


  }




  selectPaginator(v: any) {
    this.articleService.getAll().subscribe(e => this.articles = e.filter(ar => !ar.archived).splice(0 , v));
  }

  search(e : string) {
    if (e.length > 3){
      this.articles = this.allArticlesData?.filter(data => data.name?.toLowerCase()?.includes(e.toLowerCase()) || data.code?.toString().toLowerCase()?.includes(e.toLowerCase()) ||data?.sousCategory?.sousCatName?.toLowerCase()?.includes(e.toLowerCase()) || data?.category?.catName?.toLowerCase()?.includes(e.toLowerCase()));
    }
    else
      this.articleService.getAll().subscribe(e => {this.articles = e.filter(ar => !ar.archived).splice(0 , this.select);});
  }

  onSwitchChange(val: any) {
    const service = new Service()
    service.id = val.target.value;
    this.fields = 'disabled';
    if (val.target.checked){
      service.disabled = false;
      this.articleService.updatePartial(service, this.fields).subscribe(e => {
        this.articleService.getAll().subscribe(e => {this.articles = e.filter(ar => !ar.archived).splice(0, this.select);this._swal.toastSuccess(this.locale == "ar" ? "تم تفعيل الخدمة بنجاح " : "Le service a été activé avec succès")});
      }, error => console.log(error));
    }else {
      service.disabled = true;
      this.articleService.updatePartial(service, this.fields).subscribe(e => {
        this.articleService.getAll().subscribe(e => {this.articles = e.filter(ar => !ar.archived).splice(0, this.select); this._swal.toastSuccess(this.locale == "ar" ? "تم تعطيل الخدمة بنجاح" : "Le service a été disactivé avec succès")});
      }, error => console.log(error));
    }
  }




  sort (v : string){

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
    this.articleService.updatePartial(article, this.fields).subscribe(e => {
      this.articleService.getAll().subscribe(e => {this.articles = e.filter(ar => !ar.archived).splice(0, this.select) ; this._swal.toastSuccess(this.locale=="ar"?"تم أرشفة المادة بنجاح " :"L'article a été archivé avec succès");});
      this.modalService.dismissAll();
    }, error => console.log(error));
  }

  addSousCategory(val :any) {
    if(val.target.value== ""){
      this.modalService.open(this.sousCat);
    }
  }

  categoryChange(val :any) {
    if(val.target.value== ""){
      this.modalService.open(this.categoryModal);
    }
  }

  addSousCat() {
    let cat = new SousCategory();
    cat.sousCatName= this.sousCatName;
    this.sousCategoryService.create(cat).subscribe(e => {this._swal.toastSuccess("add success");this.sousCategoryService.getAll().subscribe(e => {this.sousCategories = e;});}, error => this._swal.toastError("error"));
  }

  addCat() {
    let cat = new Category();
    cat.catName= this.categoryName;
    this.categoryService.create(cat).subscribe(e => {this._swal.toastSuccess("add success"); this.categoryService.getAll().subscribe(e => {this.categories = e;});}, error => this._swal.toastError("error"));
  }
}
