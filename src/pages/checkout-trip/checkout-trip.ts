import { Component, OnInit } from "@angular/core";
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { TripService } from "../../services/trip-service";
import { HomePage } from "../home/home";
import axios from 'axios';
// import { AngularFirestore } from '@angular/fire/firestore';
import { PaypalPage } from '../paypal/paypal';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

@Component({
  selector: 'page-checkout-trip',
  templateUrl: 'checkout-trip.html'
})
export class CheckoutTripPage implements OnInit {
  // trip data 
  public trip: any;
  // number of adults
  public adults = 2;
  // date
  public date = new Date();

  public paymethods = 'creditcard';
  totalPrice: number = 0;
  recipes: any = [];

  ref: any = firebase.firestore().collection('packages');

  constructor(public nav: NavController,
    public tripService: TripService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController) {
    // set sample data
    this.trip = tripService.getItem(1);
    this.totalPrice = JSON.parse(localStorage.getItem("totalPrice"));
    this.recipes = JSON.parse(localStorage.getItem("recipes"));

  }


  onSend(form) {

    console.log(form.value);

    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    // show message
    let toast = this.toastCtrl.create({
      showCloseButton: true,
      cssClass: 'profile-bg',
      message: 'Recipe request Activity Success!',
      position: 'top',
      closeButtonText: 'OK',

    });

    

    if (form.value.payoption === "Yes") {

      loader.present();
      
      let status = "Awaiting Payment";
      this.sendEmail(form).then(data => {
        this.addPackageDetail(status).then(data => {

          loader.dismiss().then(response => {
            toast.present();
            toast.onDidDismiss(data=>{
              this.nav.setRoot(HomePage);
            })
          })


        })
      })

    } else if (form.value.payoption === "No") {

         let  status = "Paid";
         this.nav.push(PaypalPage, { totalPrice: this.totalPrice,recipes: this.recipes, status: status });

    }else {

      const alert = this.alertCtrl.create({
        title: 'Information Missing',
        message: "Please select pay upon recipe option ",
        buttons: ['OK']
      })
      alert.present();
    }

  }

  addPackageDetail(status) {
    return new Promise((resolve, reject) => {

      let clientPackage = {
        clientID: localStorage.getItem("userEmail"),
        status: status,
        recipes: []

      }

      for (let i = 0; i < this.recipes.length; i++) {
        if (this.recipes[i].isAdded) {

          clientPackage.recipes.push(this.recipes[i]);

        }

      }

      console.log(clientPackage);

      this.ref.add(clientPackage).then((doc) => {
        console.log(doc.id);
        if (doc.id) {
          resolve({ id: doc.id });
        } else {
          resolve({ id: "Error" });
        }
      });


    })

  }

  sendEmail(form) {
    return new Promise((resolve, reject) => {


      let html = `
        Good day <br><br>
        This is to confirm that you have made requests for recipes with the following amount R`+ this.totalPrice + `.
        <br>
        The product will be delivered to the following address: <br><br>
        `+ form.value.addrLn1 + `<br>` + form.value.addrLn2 + `<br>` + form.value.region + `<br>` + form.value.code + `<br><br>Kind Regards`;
      let mailContent = {

        to: localStorage.getItem("userEmail"),
        subject: "Confirmation",
        html: html

      };

      axios.post('https://ichef-14324.firebaseapp.com/api/v1/sendmail', mailContent)
        .then(serverResponse => {
          console.log(serverResponse);
          resolve(serverResponse);
        })
        .catch(error => {

          console.log(error);
          resolve(error);

        })


    })

  }



  ngOnInit() {


  }



}
