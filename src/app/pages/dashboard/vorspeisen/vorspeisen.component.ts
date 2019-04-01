import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper/helper.service';

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
  data = {
    title: '',
    ingredients: '',
    price: ''
  }

  constructor(private api: ApiService, private helper: HelperService) { }

  ngOnInit() {
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
  }

}
