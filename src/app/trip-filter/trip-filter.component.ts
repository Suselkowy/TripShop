import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { tripInfo } from '../trips.service';

export interface searchArgs{
  destCountry: string,
  minPrice:string,
  maxPrice:string,
  startDate:string,
  endDate:string,
  raiting:string[]
}

@Component({
  selector: 'app-trip-filter',
  templateUrl: './trip-filter.component.html',
  styleUrls: ['./trip-filter.component.css']
})
export class TripFilterComponent implements OnInit {

  @Output() searchArgsChanged = new EventEmitter<searchArgs>();

  filterForm!: FormGroup;
  public searchArgs:searchArgs = {"destCountry":"","minPrice":"","maxPrice":"","startDate":"","endDate":"","raiting":[]};
  
  constructor(private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      destCountry: [''],
      minPrice:[''],
      maxPrice:[''],
      startDate:[''],
      endDate:[''],
      "raiting--1":'',
      "raiting--2":'',
      "raiting--3":'',
      "raiting--4":'',
      "raiting--5":'',
      "raiting--0":'',
    });

    this.onChanges();
  }

  onChanges(): void {
    this.filterForm.get('destCountry')?.valueChanges.subscribe(val => {this.searchArgs['destCountry']=val; this.searchArgsChanged.emit(this.searchArgs);});
    this.filterForm.get('minPrice')?.valueChanges.subscribe(val => {this.searchArgs['minPrice']=val; this.searchArgsChanged.emit(this.searchArgs);});
    this.filterForm.get('maxPrice')?.valueChanges.subscribe(val => {this.searchArgs['maxPrice']=val; this.searchArgsChanged.emit(this.searchArgs);});
    this.filterForm.get('startDate')?.valueChanges.subscribe(val => {this.searchArgs['startDate']=val; this.searchArgsChanged.emit(this.searchArgs);});
    this.filterForm.get('endDate')?.valueChanges.subscribe(val => {this.searchArgs['endDate']=val; this.searchArgsChanged.emit(this.searchArgs);});
    this.filterForm.get('raiting--0')?.valueChanges.subscribe(val => {val ? this.searchArgs['raiting'] = [...this.searchArgs['raiting'],"0"] : this.searchArgs['raiting']= this.searchArgs['raiting'].filter(a => a != "0"); this.searchArgsChanged.emit(this.searchArgs);});
    this.filterForm.get('raiting--1')?.valueChanges.subscribe(val => {val ? this.searchArgs['raiting'] = [...this.searchArgs['raiting'],"1"] : this.searchArgs['raiting']= this.searchArgs['raiting'].filter(a => a != "1"); this.searchArgsChanged.emit(this.searchArgs);});
    this.filterForm.get('raiting--2')?.valueChanges.subscribe(val => {val ? this.searchArgs['raiting'] = [...this.searchArgs['raiting'],"2"] : this.searchArgs['raiting']= this.searchArgs['raiting'].filter(a => a != "2"); this.searchArgsChanged.emit(this.searchArgs);});
    this.filterForm.get('raiting--3')?.valueChanges.subscribe(val => {val ? this.searchArgs['raiting'] = [...this.searchArgs['raiting'],"3"] : this.searchArgs['raiting']= this.searchArgs['raiting'].filter(a => a != "3"); this.searchArgsChanged.emit(this.searchArgs);});
    this.filterForm.get('raiting--4')?.valueChanges.subscribe(val => {val ? this.searchArgs['raiting'] = [...this.searchArgs['raiting'],"4"] : this.searchArgs['raiting']= this.searchArgs['raiting'].filter(a => a != "4"); this.searchArgsChanged.emit(this.searchArgs);});
    this.filterForm.get('raiting--5')?.valueChanges.subscribe(val => {val ? this.searchArgs['raiting'] = [...this.searchArgs['raiting'],"5"] : this.searchArgs['raiting']= this.searchArgs['raiting'].filter(a => a != "5"); this.searchArgsChanged.emit(this.searchArgs);});

  }
}

@Pipe({ name: 'countryPipe'})
export class CountryPipe implements PipeTransform {
  transform(trips: tripInfo[], searchText: string): tripInfo[] {
    if (!trips)
    {
      return [];
    }
    if (searchText==""){
      return trips;
    }
    searchText = searchText.toLowerCase();

    return trips.filter(trip => {
      return trip.destCountry.toLowerCase().includes(searchText);
    });
  }
}

@Pipe({ name: 'pricePipe'})
export class PricePipe implements PipeTransform {
  transform(trips: tripInfo[], minPrice: string, maxPrice: string): tripInfo[] {
    if (!trips)
    {
      return [];
    }
    if (maxPrice == "" && minPrice == ""){
      return trips;
    }
    if(maxPrice == "") maxPrice = "999999999999999"
    if(minPrice == "") minPrice = "0"
    let numMaxPrice = Number(maxPrice);
    let numMinPrice = Number(minPrice); 

    return trips.filter(trip => trip.price >= numMinPrice).filter(trip => trip.price <= numMaxPrice);
  }
}

@Pipe({ name: 'datePipe'})
export class DatePipe implements PipeTransform {
  transform(trips: tripInfo[], startDate: string, endDate: string): tripInfo[] {
    if (!trips)
    {
      return [];
    }
    if (startDate == "" && endDate == ""){
      return trips;
    }
    let dateStartDate = startDate == "" ? new Date(new Date().toDateString()) : new Date(startDate);
    let dateEndDate = endDate == "" ? new Date(new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toDateString()) : new Date(endDate);
    
    return trips.filter(trip => new Date(trip.startDate) >= dateStartDate).filter(trip => new Date(trip.endDate) <= dateEndDate);
  }
}

@Pipe({ name: 'raitingPipe'})
export class RaitingPipe implements PipeTransform {
  transform(trips: tripInfo[], raiting: string[]): tripInfo[] {
    if (!trips)
    {
      return [];
    }
    if (raiting.length == 0){
      return trips;
    }
    let raitingNum = raiting.map(a => Number(a));
    return trips.filter(trip =>{
      let reviews = trip.reviews;
      let reviewslen = reviews.length;
      if (reviewslen == 0) return raitingNum.includes(0);
      let sum = 0;
  
      reviews.forEach(review => {
        if(review.raiting == 0){
          reviewslen -=1;
        }else{
          sum += review.raiting
        }
      });
  
      sum = Math.round(sum/reviewslen);
      return raitingNum.includes(sum);

    })
  }
}
