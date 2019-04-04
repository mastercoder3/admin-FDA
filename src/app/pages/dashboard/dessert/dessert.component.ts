import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper/helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dessert',
  templateUrl: './dessert.component.html',
  styleUrls: ['./dessert.component.css']
})
export class DessertComponent implements OnInit {

  food = {
    title: ''
  };
  showSpinner = true;
  dessert;
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
      this.api.getAllDessert()
        .pipe(map(actions => actions.map(a =>{
          const data = a.payload.doc.data();
          const did = a.payload.doc.id;
          return {did, ...data};
        })))    
          .subscribe(res =>{
            this.dessert = res;
            this.showSpinner = false;
          })
  }

  addDessert(content){
    this.helper.openModelLg(content);
    this.openforedit = false;
  }

  addToDessert(){
    if(this.data.title !== '' && this.data.size !== '' && this.data.price > 0 && this.data.ingredients !== ''){
      this.api.addDessert(this.data)
        .then(res =>{
          this.toastr.success('Dessert Added.','Operation Completed Successfully.');
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
    if(this.data.title !== '' && this.data.size !== '' && this.data.price > 0 && this.data.ingredients !== ''){
      let id = this.data.did;
      delete this.data['did'];
      this.api.updateDessert(id,this.data)
        .then(res =>{
          this.toastr.success('Dessert Updated.','Operation Completed Successfully.');
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
