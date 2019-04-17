import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private afs: AngularFirestore) { }

  // Vorspeisen

  getAllVorspeisen(){
    return this.afs.collection('vorspeisen').snapshotChanges();
  }

  addVorspeisen(data){
    return this.afs.collection('vorspeisen').add(data);
  }

  updateVorspeisen(id,data){
    return this.afs.doc('vorspeisen/'+id).update(data);
  }

  deleteVorspeisen(id){
    return this.afs.doc('vorspeisen/'+id).delete();
  }

  // Pizza

  getAllPizza(){
    return this.afs.collection('pizza').snapshotChanges();
  }

  addPizza(data){
    return this.afs.collection('pizza').add(data);
  }

  updatePizza(id,data){
    return this.afs.doc('pizza/'+id).update(data);
  }

  deletePizza(id){
    return this.afs.doc('pizza/'+id).delete();
  }

  // Pizza Extras

  getAllPizzaExtras(){
    return this.afs.collection('pextras').snapshotChanges();
  }

  addExtras(data){
    return this.afs.collection('pextras').add(data);
  }

  updateExtras(id,data){
    return this.afs.doc('pextras/'+id).update(data);
  }

  deleteExtras(id){
    return this.afs.doc('pextras/'+id).delete();
  }

  // Pasta

  getAllPasta(){
    return this.afs.collection('pasta').snapshotChanges();
  }

  addPasta(data){
    return this.afs.collection('pasta').add(data);
  }

  updatePasta(id,data){
    return this.afs.doc('pasta/'+id).update(data);
  }

  deletePasta(id){
    return this.afs.doc('pasta/'+id).delete();
  }

  // Pasta Extras

  getAllPastaExtras(){
    return this.afs.collection('pastaextras').snapshotChanges();
  }

  addPastaExtras(data){
    return this.afs.collection('pastaextras').add(data);
  }

  updatePastaExtras(id,data){
    return this.afs.doc('pastaextras/'+id).update(data);
  }

  deletePastaExtras(id){
    return this.afs.doc('pastaextras/'+id).delete();
  }

  // Salads

  getAllSalads(){
    return this.afs.collection('salads').snapshotChanges();
  }

  addSalads(data){
    return this.afs.collection('salads').add(data);
  }

  updateSalads(id,data){
    return this.afs.doc('salads/'+id).update(data);
  }

  deleteSalads(id){
    return this.afs.doc('salads/'+id).delete();
  }

  // Dessert

  getAllDessert(){
    return this.afs.collection('dessert').snapshotChanges();
  }

  addDessert(data){
    return this.afs.collection('dessert').add(data);
  }

  updateDessert(id,data){
    return this.afs.doc('dessert/'+id).update(data);
  }

  deleteDessert(id){
    return this.afs.doc('dessert/'+id).delete();
  }

  // Beverages

  getAllBeverages(){
    return this.afs.collection('beverages').snapshotChanges();
  }

  addBeverage(data){
    return this.afs.collection('beverages').add(data);
  }

  updateBeverage(id,data){
    return this.afs.doc('beverages/'+id).update(data);
  }

  deleteBeverage(id){
    return this.afs.doc('beverages/'+id).delete();
  }

  // Push notifications

  setPushNotification(data){
    return this.afs.doc('notifications/push').update(data);
  }

  // Zip codes

  getAllZipCodes(){
    return this.afs.collection('zips').snapshotChanges();
  }

  addZipCode(data){
    return this.afs.collection('zips').add(data);
  }

  updateZipCode(id,data){
    return this.afs.doc('zips/'+id).update(data);
  }

  deleteZipCode(id){
    return this.afs.doc('zips/'+id).delete();
  }

  // Deals

  getAllDeals(){
    return this.afs.collection('deals').snapshotChanges();
  }

  addDeal(deal){
    return this.afs.collection('deals').add(deal);
  }

  updateDeal(id,data){
    return this.afs.doc('deals/'+id).update(data);
  }

  deleteDeal(id){
    return this.afs.doc('deals/'+id).delete();
  }

  // Timings

  getTimings(id){
    return this.afs.doc('timing/'+id).valueChanges();
  }

  updateTimings(id,data){
    return this.afs.doc('timing/'+id).update(data);
  }

}
