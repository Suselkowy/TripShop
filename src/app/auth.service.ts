import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map } from '@firebase/util';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from './register/register.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  persistence: string = 'local';
  public userAuthData: any;
  userData: any;
  items: Observable<any>;

  public currUser = new BehaviorSubject<any>({
    name: "",
    email: "",
    parmissions: "0000"
  });

  constructor(private angularFireAuth: AngularFireAuth, private firestore: AngularFirestore,private router: Router) {
    angularFireAuth.authState.subscribe(res => {
      this.userAuthData = res;
      this.firestore.collection("Users").doc(res?.uid).valueChanges().subscribe(data => {
        this.userData = data;
        this.currUser.next(data);
      });
    });
    this.items = firestore.collection<any>('Users').snapshotChanges();
  }

  getUsers(){
    return this.items;
  }

  async addUser(email: string, password: string, user: User){
    try {
      let isUsernameInvalid = await this.isUsernameTaken(user.name)
      if(isUsernameInvalid) throw new Error("Invalid username")
      const res = await this.angularFireAuth.createUserWithEmailAndPassword(email, password);
      this.addUserData(res.user!.uid, user);
      this.login(email, password);
    } catch (err) {
      throw err;
    }
  }

  updatePermissions(permissions:string, key:string){
    this.firestore.collection("Users").doc(key).update({"permissions":permissions});
  }

  isUsernameTaken(name:string){
    return new Promise<any>((resolve)=> {
      this.firestore.collection("Users", ref => ref.where('name', "==", name)).valueChanges().subscribe(res => resolve(res.length > 0));
      })
  }

  addUserData(id:string,user: User){
    this.firestore.collection("Users").doc(id).set({...user});
  }

  getUserData(){
    return this.currUser;
  }

  getUserByID(key:string){
    return this.firestore.collection("Users").doc(key).get();
  }

  getUserName(){
    return this.userData.name;
  }

  async login(email: string, password: string){
      try {
        const persistanceResponse = await this.angularFireAuth.setPersistence(this.persistence);
        const ev = await this.angularFireAuth.signInWithEmailAndPassword(email, password);
        console.log("logged in");
        this.router.navigate(['home']);
      } catch (error) {
        throw error;
      }
  }

  signOut(){
    this.angularFireAuth.signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      throw error;
    });
  }

  getAuthenticated(): Observable<any> {
    return this.angularFireAuth.authState;
  }

  isLoggedIn(){
    return this.userAuthData != null;
  }

  log(){
    console.log(this.userAuthData);
  }

  isManager(){
    return this.userData?.permissions[1] == "1";
  }

  
  isAdmin(){
    return this.userData?.permissions[2] == "1";
  }

  isUser(){
    return this.userData?.permissions[0] == "1";
  }

  isBanned(){
    return this.userData?.permissions[3] == "1";
  }



}
