import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import * as firebase from 'firebase';
import { HomePage } from "../home/home";
@Component({
  selector: 'page-paypal',
  templateUrl: 'paypal.html',
})
export class PaypalPage {
  totalPrice : any ;
  recipes: any;
  status : string;
  paymentAmount: string = '3.33';
  currency: string = 'USD'; 
  currencyIcon: string = '$';
  ref: any = firebase.firestore().collection('packages');
  paypal: any = {};
  payPalConfig = {};
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private payPal: PayPal,
     private toastCtrl: ToastController,
     private nav: NavController) {

      this.totalPrice = this.navParams.get("totalPrice");
      this.recipes = this.navParams.get("recipes");
      this.status = this.navParams.get("status");
      this.payPalConfig = { 

        env: 'sandbox',
        client: {
          sandbox: 'AVfNjkF2qU40r54DFGrfrvtNn7cA6ohEE0ZK3SQhzVn7xhoc6Rz9Nkr95tOTxS5ufR2XCZ71mHWF_zFn',
        },
        commit: false,
        payment: (data, actions) => {
          console.log("data is", data, actions);
          return actions.payment.create({
            payment: {
              transactions: [
                { amount: { total: this.paymentAmount, currency: 'USD' } }
              ]
            }
          });
        }


      }
  }


  payWithPaypal() {
    console.log("Pay ????");
    //access_token$sandbox$2jt4td34x98r5jf6$a424be890214da648710f8bf6958f3e9
    this.payPal.init({
      PayPalEnvironmentProduction: 'ATKTI4FB51HDpwA5KkD46lO7l_Kw1WF5hLTVp-k6wr8n4e1uvgRl1j94FXLmMY8Pm5jSomtKFTrMnLHB',
      PayPalEnvironmentSandbox: 'AVfNjkF2qU40r54DFGrfrvtNn7cA6ohEE0ZK3SQhzVn7xhoc6Rz9Nkr95tOTxS5ufR2XCZ71mHWF_zFn'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(this.totalPrice, this.currency, 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          console.log(res);
          console.log("Pay Res====");

          let toast = this.toastCtrl.create({
            showCloseButton: true,
            cssClass: 'profile-bg',
            message: 'Payment was Success!',
            position: 'top',
            closeButtonText: 'OK',
      
          });

          this.addPackageDetail(this.status).then(data => {
            toast.present();
            toast.onDidDismiss(data=>{
              this.nav.setRoot(HomePage);
            })

          })

          // Successfully paid

          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          // Error or render dialog closed without being successful
        });
      }, (err) => {
        console.log("ERRRRRR1");
        console.log(err);
        // Error in configuration
      });
    }, (err) => {
      console.log("ERRRRRR222");
      console.log(err);
      // Error in initialization, maybe PayPal isn't supported or something else
    });
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

  payButtonHandler() {   
    
    this.paypal.Buttons(this.payPalConfig).render('#paypal-button');
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaypalPage');
  }

}
