import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { HelperService } from '../../../services/helper/helper.service';
import * as moment from 'moment';
import { Http, RequestOptions,Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  food = {
    email: ''
  };
  orders;
  showSpinner = true;
  data;
  pageNumber: number = 1;
  constructor(private api: ApiService, private helper: HelperService, private http: Http, private toastr: ToastrService) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.api.getAllOrders()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
      .subscribe(res =>{
        this.orders = res;
        this.showSpinner = false;
      })
  }

  view(content,item){
    this.helper.openModelLg(content);
    this.data = item;
    this.getCountries().subscribe(res =>{
      console.log(res)
    })
  }

  setDate(date){
    var orderDate =  moment(new Date(date)).locale('de');
    return moment.utc(orderDate).format('DD, MMMM-YYYY HH:MM');

  }

  getTotal(){
    let total = 0;
    this.data.orderDetails.forEach(a =>{
      total += a.price;
    });
    return total;
  }

  getDiscount(total){
    let discount = (5 * total) / 100;
    return discount;
  }

  getCountries(){
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: myHeaders });
    //callrequest
    return this.http.post('http://localhost:3000/sendemail',{
      order: this.data
    }, options);
  }

  extractData(res){
    let body = res.json();
    return body;
  }

  delete(item){
    if(confirm(`Are you sure you want to delete order ${item.name}`)){
      this.api.deleteOrder(item.did)
        .then(res =>{
          this.toastr.success('Order Deleted.','Operation Completed');
        }, err =>{
          this.toastr.error(err.message, 'Error!');
        })
    }
  }


}
