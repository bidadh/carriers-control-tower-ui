import {GeoJsonPoint} from "./shared";

export class Asset {
  constructor(
    public id: string,
    public name: string,
    public deviceId: string,
    public assetType: AssetTypeInfo,
    public currentPosition: LocationUpdate,
    public currentLocations: Array<string>
  ) {
  }
}

export class AssetTypeInfo {
  constructor(
    public name: string,
    public enterpriseId: string
  ) {
  }
}

export class LocationUpdate {
  constructor(
    public position: GeoJsonPoint,
    public updatedAt: Date,
    public properties: Map<string, any>
  ) {
  }
}
