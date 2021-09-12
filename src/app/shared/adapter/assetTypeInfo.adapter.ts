import {Injectable} from "@angular/core";
import {Adapter} from "../adapter";
import {AssetTypeInfo} from "../model/asset";

@Injectable({
  providedIn: "root",
})
export class AssetTypeInfoAdapter implements Adapter<AssetTypeInfo> {
  adapt(item: any): AssetTypeInfo {
    return new AssetTypeInfo(item.name, item.enterpriseId)
  }
}
