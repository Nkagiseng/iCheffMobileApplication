import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modalinfo', 
  templateUrl: 'modalinfo.html',
})
export class ModalinfoPage {
 
  item: any;
  menu: any; 
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public viewCtrl: ViewController) {
      this.item = this.navParams.get("item");
      console.log(this.item);
      this.menu = this.item.recipes[0].comments;
      console.log(this.menu);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalinfoPage');
  }

}
