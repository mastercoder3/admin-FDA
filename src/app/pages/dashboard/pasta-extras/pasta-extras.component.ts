import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TagInputModule } from 'ngx-chips';

@Component({
  selector: 'app-pasta-extras',
  templateUrl: './pasta-extras.component.html',
  styleUrls: ['./pasta-extras.component.css']
})
export class PastaExtrasComponent implements OnInit {

  pextras;
  data;
  showSpinner = true;
  openforedit = false;


  constructor(private api: ApiService, private helper: HelperService, private toastr: ToastrService) { }

  ngOnInit() {
    TagInputModule.withDefaults({
      tagInput: {
          placeholder: 'Item Name',
      }
  });
  this.data = {
    price: 0,
    items:[]
  }
    this.getData();
  }

  
  getData(){
    this.api.getAllPastaExtras()
      .pipe(map (Actions => Actions.map(a=>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return { did, ...data};
      })))
      .subscribe(res =>{
        this.pextras = res;
        this.showSpinner = false;
      })
  }

  
  addExtras(content){
    this.helper.openModelLg(content);
    this.openforedit = false;
    this.data =  {
      price: 0,
      items:[]
    }
  }

  view(content, item){
    this.helper.openModelLg(content);
    this.openforedit = true;
    this.data = item;
  }

  addToExtra(){
    if(this.data.price >= 0){
      let x = this.pextras.filter(data => data.price === this.data.price)
      if(x.length > 0){
        this.toastr.error('Price Already Exists','Cannot create Price.');
      }
      else{
        this.api.addPastaExtras(this.data)
          .then(res =>{
            this.helper.closeModel();
            this.data =  {
              price: 0,
              items:[]
            }
            this.toastr.success('Price Added', 'Operation Completed');
          }, err =>{
            this.toastr.error(err.message, 'Error!')
          })
      }
    }
  }

  update(){
    if(this.data.price > 0 ){
      let id = this.data.did;
      delete this.data['did'];
      this.api.updatePastaExtras(id,this.data)
        .then(res =>{
          this.toastr.success('Extras Updated.','Operation Completed Successfully.');
          this.helper.closeModel();
          this.data =  {
            price: 0,
            items:[]
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
    if(confirm(`Are you sure you want to delete Extras of ${item.price} €`)){
      this.api.deletePastaExtras(item.did)
        .then(res => {
          this.toastr.success('Extras deleted.','Operation Completed');
        }, err =>{
          this.toastr.error(err.message,'Error While Deleting.');
        })
    }
  }



}
