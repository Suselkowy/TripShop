import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface tripInfoAdd{
  id: number,
  name:string,
  destCountry:string,
  startDate:string,
  endDate:string,
  price:number,
  description:string,
  availableTrips:number,
  imgLink:string[],
}

export interface tripInfoHistory extends tripInfoStart{
  amount: number,
  buyDate: string,
  user: string
}

export interface tripInfoStart extends tripInfoAdd{
  key: string,
}

export interface tripInfo extends tripInfoStart {
  reviews:Review[],
  amount: number
}

export interface Review{
  tripId: number,
  raiting:number,
  comment:string,
  user:string,
  buyDate:string
}


@Injectable({
  providedIn: 'root'
})
export class TripsService{
  reviews: Review[] = []

  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.firestore.collection<Review>('Reviews').valueChanges().subscribe(reviews => this.reviews = reviews);
  }

  addData(trip: tripInfoAdd){
    try{
      const daneRef = this.firestore.collection('Trips');
      daneRef.add({ ... trip });
    }catch(e){
      console.log("Error");
    }
  }

  getData(){
    return this.firestore.collection<any>('Trips').snapshotChanges();
  }

  getTrip(id:number){
    return this.firestore.collection<any>('Trips', ref => ref.where('id' ,"==", id)).snapshotChanges();
  } 

  deleteData(key:string){
    const daneRef = this.firestore.collection('Trips');
    daneRef.doc(key).delete();
  }

  modifyData(key:string, trip:tripInfoAdd){
    try{
      const daneRef = this.firestore.collection('Trips');
      daneRef.doc(key).set(trip);
    }catch(e){
      console.log("Error");
    }
  }

  getNextId(){
    return new Promise<any>((resolve)=> {
      this.firestore.collection<tripInfoStart>('Trips', ref => ref.orderBy('id', 'desc').limit(1)).valueChanges().subscribe(product => resolve(product[0].id +1))
      })
  }

  getReviewsSingleTrip(id:number){
    return this.firestore.collection<Review>('Reviews', ref => ref.where('tripId' ,"==", id)).snapshotChanges();
  }

  getReview(id:number){
    return this.reviews.filter(review => review.tripId == id);
  }

  addReview(review: Review){
    this.firestore.collection("Reviews").add(review);
  }


  
}



