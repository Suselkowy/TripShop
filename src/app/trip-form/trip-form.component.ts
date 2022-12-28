import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl} from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tripInfo, tripInfoAdd, tripInfoStart, TripsService } from '../trips.service';

export interface errorMessage{
  name: string[],
  destCountry: string[],
  startDate: string[],
  endDate: string[],
  price: string[],
  description: string[],
  availableTrips: string[],
  imgLink: string[],
  imgLinks: string[]
}

export interface errors{
  required: string;
}

export interface errorMessages{
  name: errors,
  destCountry: errors,
  startDate: errors,
  endDate: errors,
  price: errors,
  description: errors,
  availableTrips: errors,
  imgLink: errors,
  imgLinks: errors
}


@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.css']
})
export class TripFormComponent implements OnInit {
  
  constructor(private formBuilder : FormBuilder, private _tripsService: TripsService, private router: Router, private route:ActivatedRoute) { 
  }
  
  public dateError = "";
  public dateError2 = "";
  
  formErrors:errorMessage = {
    name: [],
    destCountry: [],
    startDate: [],
    endDate: [],
    price: [],
    description: [],
    availableTrips: [],
    imgLink: [],
    imgLinks: []
  }

  private validationMessages = {
    name: {required:'filed required'},
    destCountry: {required:'filed required'},
    startDate: {required:'filed required'},
    endDate: {required:'filed required'},
    price: {required:'filed required', pattern:"Invalid number - field can only be natural number"},
    description: {required:'filed required'},
    availableTrips: {required:'filed required',pattern:"Invalid number - number of available trips can only be natural number"},
    imgLink: {required:'filed required'},
    imgLinks: {required: 'filed required'}
  }

  tripForm = this.formBuilder.group({
    name: ['',[Validators.required]],
    destCountry: ['',[Validators.required]],
    startDate: ['',[Validators.required]],
    endDate: ['',[Validators.required]],
    price: ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
    description: ['',[Validators.required]],
    availableTrips: ['',[Validators.required, Validators.pattern('^[^.]+$'), Validators.pattern('^[0-9]+$')]],
    imgLink: ['',[Validators.required]],
    imgLinks: new FormArray([])
  });

  id: string | null = null;
  uid: string = "";
  edit: boolean = false;

  ngOnInit(): void {
    if(/edit/.test(this.router.url)){
      this.id =  this.route.snapshot.paramMap.get('id');
      this._tripsService.getData().subscribe((trips: any[]) => {
        for (let trip of trips) {
          if (trip.payload.doc.data().id == this.id) {
            this.tripForm.patchValue(trip.payload.doc.data());
            if(trip.payload.doc.data().imgLink.length > 1){
              this.tripForm.controls['imgLink'].setValue(trip.payload.doc.data().imgLink[0])
              for(let i = 0; i < trip.payload.doc.data().imgLink.length-1; i++){
                  this.onAddLink();
              }
              try{
                this.tripForm.controls['imgLinks'].setValue(trip.payload.doc.data().imgLink.slice(1,trip.payload.doc.data().imgLink.length));
              }catch(e){
              }
              
            }
            this.uid = trip.payload.doc.id;
            break;
          }
        }})
        this.edit = true;
    }
  }


  endAfterStart():boolean{
    if (new Date(this.tripForm.get("startDate")?.value || "") > new Date(this.tripForm.get("endDate")?.value || "")){
       this.dateError="End Date can't be before start date";
       return false;
    }
    return true;
  }

  startAfterToday():boolean{
    if (new Date(this.tripForm.get("startDate")?.value || "") < new Date(new Date().toDateString())){
       this.dateError2="Start date can't be before current date";
       return false;
    }
    return true;
  }

  onAddLink(){
    const control = new FormControl(null, [Validators.required]);
    (<FormArray>this.tripForm.get('imgLinks')).push(control)
  }

  onDeleteLink(i:number){
    (<FormArray>this.tripForm.get('imgLinks')).removeAt(i);
  }

  get linkControls(){
    return (<FormArray>this.tripForm.get('imgLinks')).controls
  }

  checkFormArrayInvalid(){
    return (<FormArray>this.tripForm.get('imgLinks')).controls.some((control) => control.invalid);
  }


  async submitForm(){

    this.dateError = "";
    this.dateError2 = "";

    if(!this.tripForm.valid){
      for (let field in this.formErrors) {
        this.formErrors[field as keyof errorMessage] = [];
        let control = this.tripForm.get(field); 
        if (control && !control.valid) {
          const validationMessages = this.validationMessages[field as keyof errorMessages];
          for (const key in control.errors) {
            this.formErrors[field as keyof errorMessage].push(validationMessages[key as keyof errors]);
          }
        }
  
      }
      return
    }
    if(!this.endAfterStart()){
      return
    }
    if(!this.startAfterToday()){
      return
    }

  let newTrip:tripInfoAdd = {
    id: 0,
    name: this.tripForm.get("name")?.value || "",
    destCountry: this.tripForm.get("destCountry")?.value || "",
    startDate: this.tripForm.get("startDate")?.value|| "" ,
    endDate: this.tripForm.get("endDate")?.value|| "",
    price: Number(this.tripForm.get("price")?.value || 0),
    description: this.tripForm.get("description")?.value || "",
    availableTrips:  Number(this.tripForm.get("availableTrips")?.value || 0),
    imgLink: [this.tripForm.get("imgLink")?.value || "", ...this.tripForm.get("imgLinks")!.value],
  }
  if(!this.edit){
    let nextId = await this._tripsService.getNextId();
    newTrip.id = nextId;
  }else{
    newTrip.id = +(this.id || 0);
  }
  (<FormArray>this.tripForm.get('imgLinks')).clear();

  if(this.edit){
    this._tripsService.modifyData(this!.uid, newTrip);
  }else{
    this._tripsService.addData(newTrip);
  }
  
  //console.log(newTrip);

  this.tripForm.reset();
  for (let field in this.formErrors) {
    this.formErrors[field as keyof errorMessage] = [];
  }
  if(this.edit){
    this.router.navigate(['manage']);
  }
 }


}
