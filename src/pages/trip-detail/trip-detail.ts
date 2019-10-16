import { Component, OnInit } from "@angular/core";
import { NavController, NavParams } from 'ionic-angular';
import { TripService } from "../../services/trip-service";
import { CheckoutTripPage } from "../checkout-trip/checkout-trip";
import axios from 'axios'; 
@Component({
  selector: 'page-trip-detail',
  templateUrl: 'trip-detail.html'
}) 
export class TripDetailPage implements OnInit {
  // trip info
  public trip: any; 
  recipesCheff:any = [];
  totalPrice : number = 0.0;
  cheff: any;
 
  images: any =  [
    "assets/img/trip/thumb/img/Chff1.jpg",
    "assets/img/trip/thumb/img/cheff2.gif",
    "assets/img/trip/thumb/img/chff3.png",
 
  ]

  constructor(public nav: NavController, 
    public tripService: TripService, 
    private navParams: NavParams) {
    // set sample data
    this.trip = tripService.getItem(1);
  }

  addToBasket(id) {
 
    for (let i = 0; i < this.recipesCheff.length; i++) {

      if (id === this.recipesCheff[i].key) {
        this.recipesCheff[i].isAdded = true;
        this.totalPrice =this.totalPrice + parseFloat(this.recipesCheff[i].price);
 
        break;

      }

    }



  }

  removeFromBasket(id) {
    
    for (let i = 0; i < this.recipesCheff.length; i++) {

      if (id === this.recipesCheff[i].key) {
        this.recipesCheff[i].isAdded = false;
        this.totalPrice = this.totalPrice- parseFloat(this.recipesCheff[i].price);
        break;

      }

    }



  }

  // go to checkout page
  checkout() {
    localStorage.setItem("totalPrice",JSON.stringify(this.totalPrice));
    localStorage.setItem("recipes",JSON.stringify(this.recipesCheff));
    this.nav.push(CheckoutTripPage);
  } 

  ngOnInit() {

    this.cheff = this.navParams.get("cheff");

    axios.get('https://ichef-14324.firebaseapp.com/api/v1/readRecipes')
    .then(serverResponse => {
        console.log("Getting recipes");
        let readRecipes = serverResponse.data.body;
        for(let i = 0; i< readRecipes.length; i++)
        {

          if(readRecipes[i].cheffId=== this.cheff.mail)
          {
            readRecipes[i].isAdded = false;
            this.recipesCheff.push(readRecipes[i]);

          }

        }

        console.log(this.recipesCheff);
    })
    .catch(error => {

       console.log(error);

    })
  }
}
