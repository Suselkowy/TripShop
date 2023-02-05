import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Review, tripInfoHistory, TripsService } from '../trips.service';
import { FormBuilder} from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';

interface ReviewErrorMessage{
  rate: string[],
  comment: string[],
  buyDate: string[]
}

interface errors{
  required: string;
}

interface ReviewErrorMessages{
  rate: errors,
  comment: errors,
  buyDate: errors,
}

@Component({
  selector: 'app-trip-review',
  templateUrl: './trip-review.component.html',
  styleUrls: ['./trip-review.component.css']
})
export class TripReviewComponent implements OnInit {

  @Input("tripId") tripId:number = 0;
  @Input("reviews") reviews:Review[] = []
  @Output() addReviewParent = new EventEmitter<Review>();

  tempCurrUser:string = "admin";
  userData: any = null;
  items: tripInfoHistory[] = this._cartService.getHistory();
  available: boolean = false;

  rated:number = 0;
  public raiting:number = 0;
  constructor(private _tripsService: TripsService, private formBuilder:FormBuilder, public authService: AuthService, private _cartService: CartService) {
    authService.getUserData().subscribe(data => {
      this.userData = data
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['reviews'].firstChange) {
      this.checkIfAvilableForReview();
    }
  }

  ngOnInit(): void {

  }

  reviewForm = this.formBuilder.group({
    rate: [''],
    comment: ['',[Validators.required]],
    buyDate: ['',[]],
  });

  private validationMessages = {
    rate: {required:'filed required'},
    comment: {required:'filed required', minlength:'length must be grater than 50', maxlength:'length must be less than 500'},
    buyDate: {required:'filed required'}
  }

  formErrors:ReviewErrorMessage = {
    rate: [],
    comment: [],
    buyDate: []
  }

  rate(rating:number){
    this.rated = rating;
  }

  checkRating(rating:number){
    if(this.authService.isManager()) return true
    if(rating > 0) return true
    this.formErrors.rate.push('filed required');
    return false
  }

  checkIfAvilableForReview(){
    if(this.authService.isAdmin() || this.authService.isManager()){
      this.available = true;
      return
    }
    if(this.authService.isBanned()) return;
    if(this._cartService.getHistory().filter(position => position.user === this.authService.userAuthData.uid && position.id == this.tripId).length <= 0) return;
    if(this.reviews.filter(review => review.user === this.userData.name).length > 0) return;
    this.available = true;
  }


  addReview(){
    for (let field in this.formErrors) {
      this.formErrors[field as keyof ReviewErrorMessage] = [];
    }
    if(!this.reviewForm.valid){
      for (let field in this.formErrors) {
        this.formErrors[field as keyof ReviewErrorMessage] = [];
        let control = this.reviewForm.get(field); 
        console.log(control?.errors);
        if (control && !control.valid) {
          const validationMessages = this.validationMessages[field as keyof ReviewErrorMessages];
          for (const key in control.errors) {
            this.formErrors[field as keyof ReviewErrorMessage].push(validationMessages[key as keyof errors]);
          }
        }
  
      }
      return
    }

    if(!this.checkRating(Number(this.reviewForm.get("rate")?.value))) return;

    let newReview = {
      "tripId": this.tripId, 
      "raiting":Number(this.reviewForm.get("rate")?.value),
      "comment":this.reviewForm.get("comment")?.value || "", 
      "user": this.userData.name || "",
      "buyDate":this.reviewForm.get("buyDate")?.value || ""
    };

    this.addReviewParent.emit(newReview);
    this._tripsService.addReview(newReview);

    this.reviewForm.reset();
    this.rate(0);
    for (let field in this.formErrors) {
      this.formErrors[field as keyof ReviewErrorMessage] = [];
    }
    this.available = false;
  }

}
