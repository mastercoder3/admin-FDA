import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import {map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  orders;
  length=0;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getAllOrders()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
            this.orders = res;
            this.length = this.checkTodaysOrders();
        })
  }

  checkTodaysOrders(){
    let length = 0;
    this.orders.forEach(a =>{
      let date = new Date(a.date);
      if(this.isToday(date)){
        length++;
      }
    })
    return length;
  }

   isToday (someDate) {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

}
