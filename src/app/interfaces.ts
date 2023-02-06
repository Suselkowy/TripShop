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

export interface tripHistoryDatabase{
    tripId: number,
    amount: number,
    buyPrice: number,
    buyDate: string,
    user:string
  }

  export interface tripHistory extends tripHistoryDatabase{
    startDate:string,
    endDate:string,
    name:string
  }