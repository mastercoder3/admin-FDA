import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper/helper.service';
import { ToastrService } from 'ngx-toastr';

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
    if(this.data.title !== '' && this.data.size !== '' && this.data.price > 0 && this.data.ingredients !== ''){
      this.api.addVorspeisen(this.data)
        .then(res =>{
          this.toastr.success('Ingredients Added.','Operation Completed Successfully.');
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

  updateApetizers(){
    if(this.data.title !== '' && this.data.size !== '' && this.data.price > 0 && this.data.ingredients !== ''){
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

}
