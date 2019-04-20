import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import {map} from 'rxjs/operators';
import { AngularFireStorage,  AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-category-items',
  templateUrl: './category-items.component.html',
  styleUrls: ['./category-items.component.css']
})
export class CategoryItemsComponent implements OnInit {

  showSpinner = true;
  pageNumber = 1;
  food = {
    title: ''
  };
  category;
  items;
  data;
  openforedit = false;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  sizes: Array<any> = [];
  image: string='./../../assets/app-assets/images/blank.png';


  constructor(private api: ApiService, private helper: HelperService,private ngxService: NgxUiLoaderService,  private toastr: ToastrService, private route: ActivatedRoute,
    private fireStorage: AngularFireStorage) { }

  ngOnInit() {
    this.route.params.subscribe(res =>{
      if(res.category){
        this.category = JSON.parse(res.category);
        this.getData(this.category.did);
      }
    })
  }

  getData(id){
    this.api.getCategoryItems(id)
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
      .subscribe(res =>{
        this.items = res;
        this.showSpinner = false;
      });
  }

  addItems(content){
    this.helper.openModelLg(content);
    this.openforedit = false;
    this.checkSize();
  }

  checkSize(){
    if(this.category.size.length > 0){
      this.category.size.forEach(a =>{
        this.sizes.push(a.value);
      });
      this.data = {
        title: '',
        price: [],
        ingredients:'',
        size: this.sizes,
        imageURL: '',
        id: this.category.did
      }
    }
    else{
      this.data = {
        title: '',
        price: 0,
        ingredients:'',
        size: 'Normal',
        imageURL: '',
        id: this.category.did
      }
    }
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

  addItemsToDB(){
    if(this.data.title !== '' && this.data.imageURL !== ''){
      this.api.addToCategoryItems(this.data)
      .then(res =>{
        this.toastr.success('Item Added.','Operation Completed Successfully.');
        this.helper.closeModel();
        this.category.total = this.items.length;
        this.updateCategory();
      }, err =>{
        this.helper.closeModel();
        this.toastr.error(err.message, 'Error!');
      });
    }
    else{
      this.toastr.warning('Please Provide all fields. (Must Provide an Image)', 'Warning! cannot proceed.');
    }
  }

  update(){
    if(this.data.title !== '' && this.data.imageURL !== ''){
      let id = this.data.did;
      delete this.data['did'];
      this.api.updateCategoryItems(id,this.data)
      .then(res =>{
        this.toastr.success('Item Updated.','Operation Completed Successfully.');
        this.helper.closeModel();
      }, err =>{
        this.helper.closeModel();
        this.toastr.error(err.message, 'Error!');
      });
    }
    else{
      this.toastr.warning('Please Provide all fields. (Must provide an Image)', 'Warning! cannot proceed.');

    }
  }

  view(content,data) {
    this.data = data;
    this.helper.openModelLg(content);
    this.openforedit = true;
  }

  delete(item){
    if(confirm(`Are you sure you want to delete ${item.title}`)){
      this.api.deleteCategoryItem(item.did)
        .then(res => {
          this.toastr.success('Item deleted.','Operation Completed');
        }, err =>{
          this.toastr.error(err.message,'Error While Deleting.');
        })
    }
  }

  updateCategory(){
    let id = this.category.did;
    delete this.category['did']
    this.api.updateCategory(id,this.category)
    .then(res =>{
      this.category.did = id;
    }, err =>{
      this.toastr.error('Something went wrong, with the category.','Error!')
    })
  }



}
