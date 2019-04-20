import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper/helper.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireStorage,  AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.css']
})
export class PizzaComponent implements OnInit {

  food = {
    title: ''
  };
  showSpinner = true;
  pizza;
  openforedit = false;
  data;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  image: string='./../../assets/app-assets/images/blank.png';
  pageNumber =1;

  constructor(private api: ApiService, private helper: HelperService, private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,  private fireStorage: AngularFireStorage) { }

  ngOnInit() {
    this.getData();
    this.data = {
      title: '',
      ingredients: '',
      size: [
        "Normal",
        "Familia"
      ],
      price: [
        0,
        0
      ],
      imageURL:''
    }
  }

  getData(){
    this.api.getAllPizza()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))

        .subscribe(res =>{
          this.pizza = res;
          this.showSpinner = false;
        });
  }

  addPizza(content){
    this.helper.openModelLg(content);
    this.openforedit = false;
    this.data = {
      title: '',
      ingredients: '',
      size: [
        "Normal",
        "Familia"
      ],
      price: [
        0,
        0
      ],
      imageURL:'',
      info:''
    }
  }

  addToPizza(){
    if(this.data.title !== ''){
      this.api.addPizza(this.data)
        .then(res =>{
          this.toastr.success('Ingredients Added.','Operation Completed Successfully.');
          this.helper.closeModel();
          this.data = {
            title: '',
            ingredients: '',
            size: [
              "Normal",
              "Familia"
            ],
            price: [
              0,
              0
            ],
            imageURL:'',
            info:''
          }

        }, err =>{
          this.helper.closeModel();
          this.toastr.error(err.message, 'Error!');
        });
    }
    else{
      this.toastr.warning('Please Fill the details correctly.','Warning, Cannot proceed.');
    }
  }

  view(content, item){
    this.helper.openModelLg(content);
    this.openforedit = true;
    this.data = item;
  }

  updatePizza(){
    if(this.data.title !== ''){
      let id = this.data.did;
      delete this.data['did'];
      this.api.updatePizza(id,this.data)
        .then(res =>{
          this.toastr.success('Pizza Updated.','Operation Completed Successfully.');
          this.helper.closeModel();
          this.data = {
            title: '',
            ingredients: '',
            size: [
              "Normal",
              "Familia"
            ],
            price: [
              0,
              0
            ],
            imageURL:'',
            info:''
          }

        }, err =>{
          this.helper.closeModel();
          this.toastr.error(err.message, 'Error!');
        });
    }
    else{
      this.toastr.warning('Please Fill the details correctly.','Warning, Cannot proceed.');
    }
  }

  delete(item){
    if(confirm(`Are you sure you want to delete ${item.title}`)){
      this.api.deletePizza(item.did)
        .then(res => {
          this.toastr.success('Pizza deleted.','Operation Completed');
        }, err =>{
          this.toastr.error(err.message,'Error While Deleting.');
        })
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

}
