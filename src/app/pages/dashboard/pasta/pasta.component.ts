import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators'
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

  constructor(private api: ApiService, private helper: HelperService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getData();
    this.data = {
      title: '',
      ingredients: '',
      size:'Normal',
      price: 0
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
      price: 0
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
            price: 0
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
            price: 0
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

}
