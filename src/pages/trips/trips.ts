import {Component, OnInit} from "@angular/core";
import { NavController, LoadingController } from 'ionic-angular';
import {TripService} from "../../services/trip-service";
import {TripDetailPage} from "../trip-detail/trip-detail";
import axios from 'axios';
@Component({
  selector: 'page-trips',
  templateUrl: 'trips.html'
}) 
export class TripsPage implements OnInit {
  // list of trips
  public trips: any;
  cheffs: any = [];
  public search = {
    date: new Date().toISOString()
  }
 
  constructor(public nav: NavController, 
    public tripService: TripService,
    private loadingCtrl: LoadingController) {
    // set sample data
    this.trips = tripService.getAll();
    
  }

  // view trip detail
  viewDetail(cheff) {
    this.nav.push(TripDetailPage, {cheff: cheff});
  }
 
  ngOnInit() {
    let loading = this.loadingCtrl.create({
      content: "...Getting Cheffs..."

    }); 

    loading.present();
    axios.get('https://ichef-14324.firebaseapp.com/api/v1/readcheffs')
    .then(serverResponse => {
        this.cheffs = serverResponse.data.body;
        loading.dismiss();
    })
    .catch(error => {

       console.log(error);
       loading.dismiss();

    })
  }
}
