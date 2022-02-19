
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ConnectivityService } from './services/connectivity.service';
import { AlertController } from '@ionic/angular';

import { Device } from '@awesome-cordova-plugins/device/ngx';
import { Platform, NavController, IonRouterOutlet } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    public alertController: AlertController,private platform: Platform,
    private connectivity: ConnectivityService,private device: Device) {
      // this.platform.ready().then(() => {
      //   console.log('Platform ready');
      //   console.log('Device UUID is: ' + this.device.uuid);
      // });

      


      this.backButtonEvent();
    }

  ngOnInit() {

    this.connectivity.appIsOnline$.subscribe(online => {

      if (online) {
          console.log('App is online');
      } else {
          console.log('App is offline');
          this.presentAlert();
      }

    });

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Connection Not Available',
      message: 'Internet Access not available. Check your data or WiFi.',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
    // eslint-disable-next-line @typescript-eslint/dot-notation
    (navigator as any).app.exitApp();
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {

        this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
            if (outlet && outlet.canGoBack()) {
                outlet.pop();
            } else  {
              App.exitApp();
            }
        });
    });
}

}
