import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { HelperService } from 'src/app/services/helper/helper.service';

@Component({
  selector: 'app-timmings',
  templateUrl: './timmings.component.html',
  styleUrls: ['./timmings.component.css']
})
export class TimmingsComponent implements OnInit {
  
  daily;
  showSpinner = true;
  data;
  index;

  constructor(private api: ApiService, private helper: HelperService) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.api.getTimings()
      .subscribe(res =>{
        this.daily = res;
        this.showSpinner = false;
        console.log(res)
      })
  }

  view(content,item, i){
    this.helper.openModelLg(content);
    this.data = item;
    this.index = i;
  }

  update(){
    if(this.data.from !=='' && this.data.to !==''){
      console.log(this.data);
    }
  }

}
