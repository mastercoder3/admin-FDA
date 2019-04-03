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
}
