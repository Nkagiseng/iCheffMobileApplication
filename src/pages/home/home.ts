import { Component, OnInit } from "@angular/core";
import { NavController, PopoverController, ModalController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { NotificationsPage } from "../notifications/notifications";
import { SettingsPage } from "../settings/settings";
import { TripsPage } from "../trips/trips";
import { SearchLocationPage } from "../search-location/search-location";
import firestore from 'firebase/firestore';
import  firebase from "firebase";
import { ModalinfoPage } from '../modalinfo/modalinfo';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {
  // search condition
  public search = {
    name: "Rio de Janeiro, Brazil",
    date: new Date().toISOString()
  }

  queryData:any =[];

  constructor(private storage: Storage,
     public nav: NavController, 
     public popoverCtrl: PopoverController,
     public modalCtrl: ModalController,
     private loadingCtrl : LoadingController) {
  }

  openModal(item) {

    let modal = this.modalCtrl.create(ModalinfoPage,{item:item});
    modal.present();
  }
  ngOnInit() {

    let loading = this.loadingCtrl.create({
      content: "...Loading recipes..."

    });

    loading.present();

    let res = firebase.firestore().collection('packages');
    res.onSnapshot((querySnapshot:any) => {
        querySnapshot.forEach((doc:any) => {
            let data = doc.data(); 
            let clientId = localStorage.getItem("userEmail");
            if(data.clientID === clientId)
            {
              this.queryData.push(data);
            }
            
        });
        if(this.queryData.length > 0)
        {
          loading.dismiss();
          
        }else{

          loading.dismiss();

        }

    });

 
  }
  ionViewWillEnter() {
 
  }

  // go to result page
  doSearch() {
    this.nav.push(TripsPage);
  }

  // choose place
  choosePlace(from) {
    this.nav.push(SearchLocationPage, from);
  }

  // to go account page
  goToAccount() {
    this.nav.push(SettingsPage);
  }



  presentNotifications(myEvent) {
    console.log(myEvent);
    let popover = this.popoverCtrl.create(NotificationsPage);
    popover.present({
      ev: myEvent
    });
  }

}

//
