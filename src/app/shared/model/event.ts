import {Asset} from "./asset";
import {Geofence} from "./geofence";
import {Criticality, CriticalityUtil} from "./criticality";

export class Event {
  constructor(
    public id: string,
    public asset: Asset,
    public locations: Array<Geofence>,
    public action: LocationEventAction,
    public time: Date,
    public criticality: Criticality
  ) {
  }

  // noinspection JSUnusedGlobalSymbols
  location(): string {
    // if(this.locations.length === 0) {
    //   return `<a class="subtle-link" (click)="showOnMap">Show On Map</a>`
    // }

    return this.locations[0].name
  }

  style(): string {
    return CriticalityUtil.style(this.criticality)
  }

  styleColor(): string {
    return CriticalityUtil.styleColor(this.criticality)
  }

  eventIconStyle(): string {
    return CriticalityUtil.eventIconStyle(this.criticality)
  }

  mapIconBGColor(): string {
    return CriticalityUtil.mapIconBGColor(this.criticality)
  }

  mapIconFGColor(): string {
    return CriticalityUtil.mapIconFGColor(this.criticality)
  }

  criticalityLevel(): number {
    return CriticalityUtil.level(this.criticality);
  }

  criticalityLevelText(): string {
    return CriticalityUtil.title(this.criticality)
  }

  property(): string {
    // @ts-ignore
    let message = this.asset.currentPosition.properties.message

    if(message !== undefined) {
      return message
    }

    return ""
  }
}

// noinspection JSUnusedGlobalSymbols
export enum LocationEventAction {
  SHOCK = "DG_ALERT",
  TEMPERATURE_APPROACHING = "TEMPERATURE_APPROACHING",
  TEMPERATURE_EXCEEDED = "TEMPERATURE_EXCEEDED",
  ENTERED = "ENTERED",
  EXITED = "EXITED",
  DG_ALERT = "DG_ALERT",
  SECURITY_ALERT = "SECURITY_ALERT",
  PERSONAL_ALERT = "PERSONAL_ALERT"
}

