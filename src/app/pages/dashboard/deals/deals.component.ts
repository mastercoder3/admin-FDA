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
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {

  deals;
  showSpinner = true;
  food = {
    title: ''
  }

  data;
  openforedit = false;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  image: string='./../../assets/app-assets/images/blank.png';
  pageNumber= 1;

  constructor(private api: ApiService, private helper: HelperService,private ngxService: NgxUiLoaderService, 
    private toastr: ToastrService, private fireStorage: AngularFireStorage) { }

  ngOnInit() {
    this.data = {
      title: '',
      items: '',
      price: 0,
      date: '',
      imageURL: ''
    };
    this.getData();
  }

  getData(){
    this.api.getAllDeals()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.deals = res;
          this.showSpinner = false;
        })
  }

  create(content){  
    this.helper.openModelLg(content);
    this.openforedit = false;
  }

  addToDeals(){
    if(this.data.title !== '' && this.data.items !== '' && this.data.price > 0 && this.data.date !== ''){
      let date = new Date(this.data.date);
      this.data.date = date;
      this.api.addDeal(this.data)
        .then(res =>{
          this.toastr.success('Deal Added.','Operation Completed Successfully.');
          this.helper.closeModel();
          this.data = {
            title: '',
            items: '',
            price: 0,
            date: '',
            imageURL: ''
          };

        }, err =>{
          this.helper.closeModel();
          this.toastr.error(err.message, 'Error!');
        });
    }
    else{
      this.toastr.warning('Please Fill the details correctly.','Warning, Cannot proceed.');
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

    view(content,data) {
    this.data = data;
    this.helper.openModelLg(content);
    this.openforedit = true;
    let date = this.data.date;
    this.data.date = this.getDate(date);
    // this.data.date = data.date.;
  }

  delete(item){
    if(confirm(`Are you sure you want to delete ${item.title}`)){
      this.api.deleteDeal(item.did)
        .then(res => {
          this.toastr.success('Deal deleted.','Operation Completed');
        }, err =>{
          this.toastr.error(err.message,'Error While Deleting.');
        })
    }
  }

  update(){
    if(this.data.title !== '' && this.data.items !== '' && this.data.price > 0 && this.data.date !== ''){
      let id = this.data.did;
      delete this.data['did'];
      this.api.updateDeal(id,this.data)
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

  getDate(datee){
      let year = new Date(datee).getFullYear();
      let month = new Date(datee).getMonth() + 1;
      let date = new Date(datee).getDate();
      let t = '';
      if(month< 10 && date < 10)
        t = `${year}-0${month}-0${date}`;
      else if(month<10)
        t = `${year}-0${month}-${date}`;
      else if(date < 10)
        t = `${year}-${month}-0${date}`;
      else
        t = `${year}-${month}-${date}`;
  
      return t;
    
  }

}
