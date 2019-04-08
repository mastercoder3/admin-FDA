import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators'
import { AngularFireStorage,  AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-pasta',
  templateUrl: './pasta.component.html',
  styleUrls: ['./pasta.component.css']
})
export class PastaComponent implements OnInit {
  food = {
    title: ''
  };
  showSpinner = true; 
  pasta;
  openforedit = false;
  data;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  image: string='./../../assets/app-assets/images/blank.png';

  constructor(private api: ApiService, private helper: HelperService, private toastr: ToastrService,
    private ngxService: NgxUiLoaderService, private fireStorage: AngularFireStorage) { }

  ngOnInit() {
    this.getData();
    this.data = {
      title: '',
      ingredients: '',
      size:'Normal',
      price: 0,
      imageURL: ''
    }
  }

  getData(){
    this.api.getAllPasta()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))

        .subscribe(res =>{
          this.pasta = res;
          this.showSpinner = false;
        });
  }

  addPasta(content){
    this.helper.openModelLg(content);
    this.openforedit = false;
    this.data = {
      title: '',
      ingredients: '',
      size:'Normal',
      price: 0,
      imageURL: ''

    }
  }

  view(content,item){
    this.helper.openModelLg(content);
    this.openforedit = true;
    this.data = item;
  }

  addToPasta(){
    if(this.data.title !== '' && this.data.ingredients !== ''){
      this.api.addPasta(this.data)
        .then(res =>{
          this.toastr.success('Pasta Added.','Operation Completed Successfully.');
          this.helper.closeModel();
          this.data = {
            title: '',
            ingredients: '',
            size:'Normal',
            price: 0,
            imageURL: ''

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

  updatePasta(){
    if(this.data.title !== ''  && this.data.ingredients !== ''){
      let id = this.data.did;
      delete this.data['did'];
      this.api.updatePasta(id,this.data)
        .then(res =>{
          this.toastr.success('Pasta Updated.','Operation Completed Successfully.');
          this.helper.closeModel();
          this.data = {
            title: '',
            ingredients: '',
            size:'Normal',
            price: 0,
            imageURL: ''

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
      this.api.deletePasta(item.did)
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
