import {Injectable} from "@angular/core";
import {Adapter} from "../adapter";
import {Asset} from "../model/asset";
import {AssetTypeInfoAdapter} from "./assetTypeInfo.adapter";
import {LocationUpdateAdapter} from "./locationUpdate.adapter";

@Injectable({
  providedIn: 'root'
})
export class AssetAdapter implements Adapter<Asset> {
  constructor(
    private assetTypeInfoAdapter: AssetTypeInfoAdapter,
    private locationUpdateAdapter: LocationUpdateAdapter
  ) {
  }

  adapt(item: any): Asset {
    let assetType = this.assetTypeInfoAdapter.adapt(item.assetType);
    let currentPosition = item.currentPosition === null ? null : this.locationUpdateAdapter.adapt(item.currentPosition);
    return new Asset(
      item.id,
      item.name,
      item.deviceId,
      assetType,
      currentPosition,
      item.currentLocations
    );
  }
}
