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
}
