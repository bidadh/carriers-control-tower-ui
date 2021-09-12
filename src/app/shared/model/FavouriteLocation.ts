import {LocationEventAction} from "./locationEventUpdate";

export class FavouriteLocation {
  constructor(
    public name: string,
    public lastActive: string,
    public numberOfAssets: number,
    public eventAction: LocationEventAction
  ) {
  }

  icon() {
    switch (this.eventAction) {
      case LocationEventAction.ENTERED:
        return "icon-download-save"
      case LocationEventAction.EXITED:
        return "icon-upload"
      default:
        return ""
    }
  }
}
