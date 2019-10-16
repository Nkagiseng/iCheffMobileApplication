import { Component, OnInit } from "@angular/core";
import { NavController, AlertController, ToastController, MenuController } from "ionic-angular";
import { HomePage } from "../home/home";
import { RegisterPage } from "../register/register";
import { LoadingController } from 'ionic-angular';
import { AuthService } from '../../runservice/auth';
import { Http, Headers, RequestOptions } from '@angular/http';
import { catchError } from 'rxjs/operators';
import axios from 'axios';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public loadingCtrl: LoadingController,
    public nav: NavController,
    public forgotCtrl: AlertController,
    public menu: MenuController,
    public toastCtrl: ToastController,
    private authService: AuthService,
    private loadinTrl: LoadingController,
    private alertCtrl: AlertController,
    private http: Http) {
    this.menu.swipeEnable(false);
  }


  // login 
  onLogin(form) {

    const loading = this.loadingCtrl.create({
      content: "Signing you in...."

    })

    localStorage.setItem("userEmail", form.value.email);
    // this.nav.setRoot(HomePage);

    let content = {
      email: form.value.email,
      password: form.value.password

    } 

    loading.present();

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    this.http.post('https://ichef-14324.firebaseapp.com/api/v1/signIn', content, options).subscribe(data => {

      let response = data.json();

      if (response.body.code == "406") {

        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Sign-In Failed :(',
          message: response.body.message,
          buttons: ['OK']
        })
        alert.present();

      } else {

        loading.dismiss().then(res => {

          this.nav.setRoot(HomePage);

        })

      }

    })


  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Forgot Password?',
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            
            if (!data.email) {

              this.prepareToast('Invalid Email entered.');

            } else {

              let content = {

                email: data.email
              }
              axios.post('http://transnodeichef.herokuapp.com/techDev/api/passwordReset/', content)
                .then(serverResponse => {

                  this.prepareToast(serverResponse.data.result.body.message);

                })
                .catch(error => {

                  this.prepareToast('An unexpected error occured');

                })



            }

          }
        }
      ]
    });
    forgot.present();
  }

  prepareToast(message) {

    let toast = this.toastCtrl.create({
      message: message,
      // duration: 3000,
      position: 'top',
      cssClass: 'dark-trans',
      closeButtonText: 'OK',
      showCloseButton: true
    });
    toast.present();

  }

}
