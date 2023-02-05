import { Pipe, PipeTransform } from "@angular/core";
import { tripInfo } from "./trips.service";


//Pipes
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