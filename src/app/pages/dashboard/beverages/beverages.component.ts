import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper/helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-beverages',
  templateUrl: './beverages.component.html',
  styleUrls: ['./beverages.component.css']
})
export class BeveragesComponent implements OnInit {

  food = {
    title: ''
  };
  showSpinner = true;
  bev;
  data;
  openforedit = false;

  constructor(private api: ApiService, private helper: HelperService, private toastr: ToastrService) { }

  ngOnInit() {
    this.data = {
      title: '',
      ingredients: '',
      price: 0,
      size: 'Normal'
    };
    this.getData()
  }

  getData(){
      this.api.getAllBeverages()
        .pipe(map(actions => actions.map(a =>{
          const data = a.payload.doc.data();
          const did = a.payload.doc.id;
          return {did, ...data};
        })))    
          .subscribe(res =>{
            this.bev = res;
            this.showSpinner = false;
          })
  }

  
  addBeverage(content){
    this.helper.openModelLg(content);
    this.openforedit = false;
  }

  addToBeverage(){
    if(this.data.title !== '' && this.data.size !== '' && this.data.price > 0 ){
      this.api.addBeverage(this.data)
        .then(res =>{
          this.toastr.success('Beverage Added.','Operation Completed Successfully.');
          this.helper.closeModel();
          this.data.title = '';
          this.data.price = 0;
          this.data.ingredients = '';
          this.data.size = 'Normal';

        }, err =>{
          this.helper.closeModel();
          this.toastr.error(err.message, 'Error!');
        });
    }
    else{
      this.toastr.warning('Please Fill the details correctly.','Warning, Cannot proceed.');
    }
  }

  update(){
    if(this.data.title !== '' && this.data.size !== '' && this.data.price > 0 ){
      let id = this.data.did;
      delete this.data['did'];
      this.api.updateBeverage(id,this.data)
        .then(res =>{
          this.toastr.success('Beverage Updated.','Operation Completed Successfully.');
          this.helper.closeModel();
          this.data.title = '';
          this.data.price = 0;
          this.data.ingredients = '';
          this.data.size = 'Normal';

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
          this.toastr.success('Pizza deleted.','Operation Completed');
        }, err =>{
          this.toastr.error(err.message,'Error While Deleting.');
        })
    }
  }


}
