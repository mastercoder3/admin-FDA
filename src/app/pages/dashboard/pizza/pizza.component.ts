import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper/helper.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private api: ApiService, private helper: HelperService, private toastr: ToastrService) { }

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
      ]
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
      ]
    }
  }

  addToPizza(){
    if(this.data.title !== '' && this.data.ingredients !== ''){
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
            ]
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
    if(this.data.title !== ''  && this.data.ingredients !== ''){
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
            ]
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

}
