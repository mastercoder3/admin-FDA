import { Injectable } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private modalService: NgbModal) { }

  openModel(content){
    this.modalService.open(content, {backdrop: 'static'});
  }

  openModelLg(content){
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  closeModel(){
    this.modalService.dismissAll();
  }
}
