import {Injectable} from '@angular/core';
import {Heartbeat} from "./app.service";
import {Asset} from "./model/asset";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {
  }

  showNewAssetNotification(assets: Array<Asset>) {
    assets.forEach(asset => {
      // console.info(`new Asset received '${asset.name}', id: ${asset.id}`);
      // console.info(JSON.stringify(asset));
    });
  }

  showHeartbeatNotification(hb: Heartbeat) {
    if (hb === null) {
      return;
    }

    console.debug(`Heartbeat: ${hb.status} ${JSON.stringify(hb)}`);
  }
}
