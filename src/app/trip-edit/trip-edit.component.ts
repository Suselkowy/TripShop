import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { first } from 'rxjs';
import { errorMessage, errorMessages, errors } from '../trip-form/trip-form.component';
import { firestoreData } from '../trips-container/trips-container.component';
import { tripInfoAdd, TripsService } from '../trips.service';

@Component({
  selector: 'app-trip-edit',
  templateUrl: './trip-edit.component.html',
  styleUrls: ['./trip-edit.component.css']
})
export class TripEditComponent implements OnInit {

  constructor(private formBuilder : FormBuilder, private _tripsService: TripsService, private route: ActivatedRoute) { 
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


  ngOnInit(): void {
    this.id =  this.route.snapshot.paramMap.get('id');
    this._tripsService.getData().subscribe((trips: any[]) => {
      for (let trip of trips) {
        if (trip.payload.doc.data().id == this.id) {
          this.tripForm.patchValue(trip.payload.doc.data());
          break;
        }
      }})
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

  let nextId = await this._tripsService.getNextId();
  newTrip.id = nextId;
  (<FormArray>this.tripForm.get('imgLinks')).clear();

  this._tripsService.addData(newTrip);
  //console.log(newTrip);

  this.tripForm.reset();
  for (let field in this.formErrors) {
    this.formErrors[field as keyof errorMessage] = [];
  }

 }

}
