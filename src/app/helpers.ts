import { CartService } from "./cart.service";
import { firestoreSnapshotData } from "./interfaces";
import { TripsService } from "./trips.service";

export function getTripInfoFromFirestore(data:any, _cartService:CartService, _tripsService:TripsService){
    return data.map( (trip: firestoreSnapshotData) => ({...trip.payload.doc.data(),
        key:trip.payload.doc.id, 
        "amount":_cartService.getAmountOfItem(trip.payload.doc.data().id), 
        "reviews":[]})
        )
}