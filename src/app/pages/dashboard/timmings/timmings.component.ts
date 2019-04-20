import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-timmings',
  templateUrl: './timmings.component.html',
  styleUrls: ['./timmings.component.css']
})
export class TimmingsComponent implements OnInit {
  
  daily;
  showSpinner = true;
  showSpinner1 = true;
  data;
  index;
  special;
  openforspecial=false;

  constructor(private api: ApiService, private helper: HelperService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.api.getTimings('daily')
      .subscribe(res =>{
        this.daily = res;
        this.showSpinner = false;
      });
    this.api.getTimings('special')
      .subscribe(res =>{
        this.special = res;
        this.showSpinner1 = false;
      })
  }

  view(content,item, i){
    this.helper.openModelLg(content);
    this.data = item;
    this.index = i;
    this.openforspecial = false;
    // console.log(this.daily);

  }

  update(){
    if(this.data.from !=='' && this.data.to !==''){
      this.daily.timings[this.index] = this.data;
      this.api.updateTimings('daily',this.daily)
        .then(res =>{
          this.helper.closeModel();
          this.toastr.success('Timings updated.','Opretation Successful');
        }, err =>{
          this.toastr.error(err.message, 'Error!');
        })
    }
  }

  addNewSpecialTiming(content){
    this.helper.openModelLg(content);
    this.openforspecial = true;
    this.data = {
      date: '',
      from:'00:00',
      to: '00:00',
      status: 'open'
    }
  }

  addToNewSpecial(){
    if(this.data.date !== '' &&  this.data.status !== '' ){
      // console.log(this.special)
      this.special.timings.push(this.data);
      this.api.updateTimings('special',this.special)
        .then(res =>{
          this.helper.closeModel();
          this.toastr.success('Timing Added.','Operation Completed');
        },err =>{
          this.toastr.error('Failed to Add.');
        })
    }
    else{
      this.toastr.warning('Please fill the form correctly.','Cannot Continue.');
    }
  }

  delete(i){
    if(confirm(`Are you sure you want to delete ${this.special.timings[i].date}`)){
      this.special.timings.splice(i,1);
      this.api.updateTimings('special',this.special)
        .then(res =>{
          this.helper.closeModel();
          this.toastr.success('Timing Deleted.','Operation Completed');
        },err =>{
          this.toastr.error('Failed to Delete.');
        })
    }
  }

}
