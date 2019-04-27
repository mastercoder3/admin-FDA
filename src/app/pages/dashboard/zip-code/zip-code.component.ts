import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api/api.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-zip-code',
  templateUrl: './zip-code.component.html',
  styleUrls: ['./zip-code.component.css']
})
export class ZipCodeComponent implements OnInit {

  food = {
    code: ''
  };
  showSpinner = true;
  zips;
  data;
  openforedit = false;
  pageNumber = 1;
  discount;

  constructor(private api: ApiService, private helper: HelperService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getData();
    this.data = {
      code: 0,
      area: '',
      rate: 0,
      minOrder: 0
    }
  }

  getData(){
    this.api.getAllZipCodes()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))

        .subscribe(res =>{
          this.zips = res;
          this.showSpinner =  false;
        });
    this.api.getZipById('discount')
        .subscribe(res =>{
          this.discount = res;
          // console.log(res);
        })
  }

  addZipCodes(content){
    this.helper.openModelLg(content);
    this.openforedit = false;
  }

  addToZips(){
    if(this.data.code > 0 && this.data.area !== '' && this.data.rate > 0 && this.data.minOrder > 0){
      // let x: Array<any>;
      // x = this.zips.filter(data => data.code === this.data.code)
      // if(x.length > 0){
      //   this.toastr.warning('Zip Code Already Added.','Cannot Proceed');
      //   return;
      // }
      // else{
          this.api.addZipCode(this.data)
        .then(res =>{
          this.toastr.success('Zip Code Added Added.','Operation Completed Successfully.');
          this.helper.closeModel();
          this.data = {
            code: 0,
            area: '',
            rate: 0,
            minOrder: 0
          }

        }, err =>{
          this.helper.closeModel();
          this.toastr.error(err.message, 'Error!');
        });
      // }
    
    }
    else{
      this.toastr.warning('Please Fill the details correctly.','Warning, Cannot proceed.');
    }
  }

  update(){
    if(this.data.code > 0 && this.data.area !== '' && this.data.rate > 0 && this.data.minOrder > 0){
      let id = this.data.did;
      delete this.data['did'];
      this.api.updateZipCode(id,this.data)
        .then(res =>{
          this.toastr.success('Zip code Updated.','Operation Completed Successfully.');
          this.helper.closeModel();
          this.data = {
            code: 0,
            area: '',
            rate: 0,
            minOrder: 0
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

  view(content,data) {
    this.data = data;
    this.helper.openModelLg(content);
    this.openforedit = true;
  }

  delete(item){
    if(confirm(`Are you sure you want to delete ${item.title}`)){
      this.api.deleteZipCode(item.did)
        .then(res => {
          this.toastr.success('Pizza deleted.','Operation Completed');
        }, err =>{
          this.toastr.error(err.message,'Error While Deleting.');
        })
    }
  }

  setDiscount(content){
    this.helper.openModel(content);
  }

  updateDiscount(){
    if(this.discount.amount >= 0 && this.discount.amount < 100){
      this.api.updateZipCode('discount',this.discount)
        .then(res =>{
          this.helper.closeModel();
          this.toastr.success('Discount Price Updated.','Operation Successfull');
        }, err=>{
          this.toastr.error(err.message,'Error!');
        })
    }
    else{
      this.toastr.warning('Please Enter a discount percentage from 1 ~ 100.','Cannot proceed.');
    }
  }


}
