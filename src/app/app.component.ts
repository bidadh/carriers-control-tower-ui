import {Component, OnInit} from '@angular/core';
import {NotificationService} from "./shared/notification.service";
import {AppService} from "./shared/app.service";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CAThookie client';

  product = environment.product
  catStyle = `bg-${environment.catStyle}`
  logo = `assets/${environment.logo}`
  acronym = environment.acronym

  constructor(private appService: AppService, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.appService.startedMovingAssets$
      .subscribe(assets => {
        this.notificationService.showNewAssetNotification(assets);
      });

    this.appService.sseHeartbeats$
      .subscribe(hb => {
        this.notificationService.showHeartbeatNotification(hb);
      });
  }

}
