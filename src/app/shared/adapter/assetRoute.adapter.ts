import {Injectable} from "@angular/core";
import {Adapter} from "../adapter";
import {AssetRoute, RouteRequest} from "../model/asset.route";

@Injectable({
  providedIn: 'root'
})
export class AssetRouteAdapter implements Adapter<AssetRoute> {
  adapt(item: any): AssetRoute {
    let route: any = item.route
    let routeRequest = new RouteRequest(route.coordinates, route.forceFit, route.forceFollow)
    return  new AssetRoute(
      item.asset,
      routeRequest
    );
  }
}
