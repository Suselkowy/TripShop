import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { tripInfo } from '../trips.service';
import { searchArgs } from '../interfaces';
import { CountryPipe, DatePipe, PricePipe, RaitingPipe } from '../pipes';

@Component({
  selector: 'app-trip-filter',
  templateUrl: './trip-filter.component.html',
  styleUrls: ['./trip-filter.component.css'],
  providers: [CountryPipe, PricePipe, RaitingPipe, DatePipe]
})
export class TripFilterComponent implements OnInit,OnChanges {

  @Output() filteredTrips = new EventEmitter<tripInfo[]>();
  @Input() trips: tripInfo[] = [];

  filterForm!: FormGroup;

  public searchArgs:searchArgs = {
    destCountry:"",
    minPrice:"",
    maxPrice:"",
    startDate:"",
    endDate:"",
    raiting:[]
  };
  
  constructor(private formBuilder : FormBuilder,
    private countryPipe: CountryPipe, private pricePipe: PricePipe, private datePipe: DatePipe, private raitingPipe: RaitingPipe) 
  { }

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
    this.subscribeFilterFields();
  }

  //emiter
  emitFilteredTrips(){
    this.filteredTrips.emit(this.filterTrips(this.trips, this.searchArgs));
  }

  //On input change
  ngOnChanges(changes: SimpleChanges): void {
    this.emitFilteredTrips();
  }

  //On field change
  subscribeFilterFields(): void {
    this.filterForm.get('destCountry')?.valueChanges.subscribe(val => {this.searchArgs['destCountry']=val; this.emitFilteredTrips();});
    this.filterForm.get('minPrice')?.valueChanges.subscribe(val => {this.searchArgs['minPrice']=val;this.emitFilteredTrips();});
    this.filterForm.get('maxPrice')?.valueChanges.subscribe(val => {this.searchArgs['maxPrice']=val; this.emitFilteredTrips();});
    this.filterForm.get('startDate')?.valueChanges.subscribe(val => {this.searchArgs['startDate']=val; this.emitFilteredTrips();});
    this.filterForm.get('endDate')?.valueChanges.subscribe(val => {this.searchArgs['endDate']=val; this.emitFilteredTrips();});
    
    this.filterForm.get('raiting--0')?.valueChanges.subscribe(ischecked => {this.checkboxHandler(ischecked,"0");this.emitFilteredTrips();});
    this.filterForm.get('raiting--1')?.valueChanges.subscribe(ischecked => {this.checkboxHandler(ischecked,"1");this.emitFilteredTrips();});
    this.filterForm.get('raiting--2')?.valueChanges.subscribe(ischecked => {this.checkboxHandler(ischecked,"2");this.emitFilteredTrips();});
    this.filterForm.get('raiting--3')?.valueChanges.subscribe(ischecked => {this.checkboxHandler(ischecked,"3");this.emitFilteredTrips();});
    this.filterForm.get('raiting--4')?.valueChanges.subscribe(ischecked => {this.checkboxHandler(ischecked,"4");this.emitFilteredTrips();});
    this.filterForm.get('raiting--5')?.valueChanges.subscribe(ischecked => {this.checkboxHandler(ischecked,"5");this.emitFilteredTrips();});
  }

  checkboxHandler(ischecked:number, val:string){
    ischecked ? this.searchArgs['raiting'] = [...this.searchArgs['raiting'],val] : this.searchArgs['raiting']= this.searchArgs['raiting'].filter(a => a != val)
  }

  filterTrips(trips:tripInfo[], searchArgs:searchArgs){
    let filtered = trips;

    filtered = this.countryPipe.transform(filtered, searchArgs['destCountry'])
    filtered = this.pricePipe.transform(filtered, searchArgs['minPrice'], searchArgs['maxPrice'])
    filtered = this.datePipe.transform(filtered, searchArgs['startDate'], searchArgs['endDate'])
    filtered = this.raitingPipe.transform(filtered, searchArgs['raiting'])

    return filtered
  }
}

