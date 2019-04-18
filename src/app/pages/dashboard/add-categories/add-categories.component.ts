import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import {map} from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper/helper.service';
import { TagInputModule } from 'ngx-chips';
import { ToastrService } from 'ngx-toastr';
import { AngularFireStorage,  AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.css']
})
export class AddCategoriesComponent implements OnInit {

  showSpinner = true;
  food= {
    title: ''
  };
  pageNumber = 1;
  categories;
  data;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  image: string='./../../assets/app-assets/images/blank.png';
  openforedit = false;

  constructor(private api: ApiService, private helper: HelperService,
     private toastr: ToastrService,private ngxService: NgxUiLoaderService,  private fireStorage: AngularFireStorage, 
     private router: Router) { }

  ngOnInit() {
    this.getData();
    TagInputModule.withDefaults({
      tagInput: {
          placeholder: 'Sizes',
      }
  });
  }

  getData(){
    this.api.getAllCategories()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
      .subscribe(res =>{
        this.categories = res;
        this.showSpinner = false;
      })
  }

  addCategories(content){
    this.helper.openModelLg(content);
    this.data = {
      title: '',
      size: [],
      total: 0,
      imageURL: ''
    }
    this.openforedit = false;
  }

  upload(event){

    this.ngxService.start();
    let id = Math.floor(Date.now() / 1000);
      this.ref = this.fireStorage.ref('Thumbnails/'+id.toString());
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
           this.data.imageURL = url;    
           this.ngxService.stop();    
        });
      })
    ).subscribe();

  }

  addToCategories(){
    if(this.data.title !== '' && this.data.imageURL !== ''){
      this.api.addToCategories(this.data)
        .then(res =>{
          this.helper.closeModel();
          this.toastr.success('Category added.', 'Operation Completed');
        }, err =>{
          this.toastr.error(err.message, 'Error!');
        })
    }
    else{
      this.toastr.warning('Please Provide a valid title and image for category.','Cannot proceed.');
    }
  }

  view(content, item){
    this.helper.openModelLg(content);
    this.openforedit = true;
    this.data = item;
  }

  update(){
    if(this.data.title !== '' && this.data.imageURL !== ''){
      let id = this.data.did;
      delete this.data['did'];
      this.api.updateCategory(id,this.data)
        .then(res =>{
          this.helper.closeModel();
          this.toastr.success('Category Updated.', 'Operation Completed');
        }, err =>{
          this.toastr.error(err.message, 'Error!');
        })
    }
    else{
      this.toastr.warning('Please Provide a valid title and image for category.','Cannot proceed.');
    }
  }

  delete(item){
    if(confirm(`Are you sure you want to delete ${item.title}`)){
      this.api.deleteCategory(item.did)
        .then(res => {
          this.toastr.success('Category deleted.','Operation Completed');
        }, err =>{
          this.toastr.error(err.message,'Error While Deleting.');
        })
    }
  }

  add(item){
    this.router.navigate(['/dashboard/category-items',{
      category: JSON.stringify(item)
    }])
  }

}
