import { tripInfoStart } from "./trips.service"


export interface searchArgs{
    destCountry: string,
    minPrice:string,
    maxPrice:string,
    startDate:string,
    endDate:string,
    raiting:string[]
  }

export interface firestoreSnapshotData{
    payload: {
        doc: {
        data():tripInfoStart, 
        id:string
        }
    }
}