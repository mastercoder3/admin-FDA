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
  selector: 'app-vorspeisen',
  templateUrl: './vorspeisen.component.html',
  styleUrls: ['./vorspeisen.component.css']
})
export class VorspeisenComponent implements OnInit {

  food = {
    title: ''
  };
  showSpinner = true;
  vorspeisen;
  data;
  openforedit = false;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  image: string='./../../assets/app-assets/images/blank.png';
  pageNumber = 1;

  constructor(private api: ApiService, private helper: HelperService,private ngxService: NgxUiLoaderService, 
     private toastr: ToastrService, private fireStorage: AngularFireStorage) { }

  ngOnInit() {
    this.data = {
      title: '',
      ingredients: '',
      price: 0,
      size: 'Normal',
      imageURL: ''
    };
    this.getData()
  }

  getData(){
      this.api.getAllVorspeisen()
        .pipe(map(actions => actions.map(a =>{
          const data = a.payload.doc.data();
          const did = a.payload.doc.id;
          return {did, ...data};
        })))    
          .subscribe(res =>{
            this.vorspeisen = res;
            this.showSpinner = false;
          })
  }

  addVorspeisen(content){
    this.helper.openModelLg(content);
    this.openforedit = false;
  }

  addApetizers(){
    this.data.date = new Date();
    if(this.data.title !== '' && this.data.size !== '' && this.data.price > 0){
      this.api.addVorspeisen(this.data)
        .then(res =>{
          this.toastr.success('Ingredients Added.','Operation Completed Successfully.');
          this.helper.closeModel();
          this.data.title = '';
          this.data.price = 0;
          this.data.ingredients = '';
          this.data.size = 'Normal';
          this.data.imageURL = '';

        }, err =>{
          this.helper.closeModel();
          this.toastr.error(err.message, 'Error!');
        });
    }
    else{
      this.toastr.warning('Please Fill the details correctly.','Warning, Cannot proceed.');
    }
  }

  updateApetizers(){
    if(this.data.title !== '' && this.data.size !== '' && this.data.price > 0){
      let id = this.data.did;
      delete this.data['did'];
      this.api.updateVorspeisen(id,this.data)
        .then(res =>{
          this.toastr.success('Ingredients Updated.','Operation Completed Successfully.');
          this.helper.closeModel();
          this.data.title = '';
          this.data.price = 0;
          this.data.ingredients = '';
          this.data.size = 'Normal';
          this.data.imageURL = '';

        }, err =>{
          this.helper.closeModel();
          this.toastr.error(err.message, 'Error!');
        });
    }
    else{
      this.toastr.warning('Please Fill the details correctly.','Warning, Cannot proceed.');
    }
  }

  view(content,data) {
    this.data = data;
    this.helper.openModelLg(content);
    this.openforedit = true;
  }

  delete(item){
    if(confirm(`Are you sure you want to delete ${item.title}`)){
      this.api.deleteVorspeisen(item.did)
        .then(res => {
          this.toastr.success('Vorspeisen deleted.','Operation Completed');
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
