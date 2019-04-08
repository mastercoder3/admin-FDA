import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/services/helper/helper.service';
import { ApiService } from 'src/app/services/api/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  push={
    title: '',
    message: ''
  };

  constructor(private helper: HelperService, private api: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
  }

  sendNotifications(content){
    this.helper.openModelLg(content);
  }

  sendPushNotification(){
    if(this.push.title !== '' && this.push.message){
      this.api.setPushNotification(this.push)
      .then(res =>{
        this.toastr.success('Push Notification sent.','Operation Successfull.');
        this.helper.closeModel();
      }, err =>{
        this.toastr.error(err.message, 'Error!');
      })
    }
  }

}
