import {Injectable} from '@angular/core';
import {EnterpriseService} from "../shared/service/enterprise.service";
import {BehaviorSubject, combineLatest, merge, Observable} from "rxjs";
import {Geofence, GeofenceWithCount} from "../shared/model/geofence";
import {AppService} from "../shared/app.service";
import {Asset} from "../shared/model/asset";
import {AssetService} from "../shared/service/asset.service";
import {LocationEventUpdateContainer} from "../shared/model/locationEventUpdate";
import {AssetRoute, ZoomAt} from "../shared/model/asset.route";
import { filter } from 'rxjs/operators';
import {Event} from "../shared/model/event";

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  private _locations$: BehaviorSubject<Array<GeofenceWithCount>> = new BehaviorSubject<Array<GeofenceWithCount>>([]);
  public readonly locations$: Observable<Array<GeofenceWithCount>> = this._locations$.asObservable();

  private _assets$: BehaviorSubject<Array<Asset>> = new BehaviorSubject<Array<Asset>>([]);
  public readonly assets$: Observable<Array<Asset>> = this._assets$.asObservable();

  private _events$: BehaviorSubject<Array<Event>> = new BehaviorSubject<Array<Event>>([]);
  public readonly events$: Observable<Array<Event>> = this._events$.asObservable();

  showEventOnMap(e: Event) {
    this._events$.next([e]);
  }

  public readonly assetRoute$: Observable<AssetRoute>;

  public readonly assetZoomAt$: Observable<ZoomAt>;

  constructor(
    private enterpriseService: EnterpriseService,
    private assetService: AssetService,
    public readonly appService: AppService
  ) {

    let combined$: Observable<Array<any>> = combineLatest(this.enterpriseService.locations$, this.appService.locationEventUpdates$)
    combined$
      .subscribe(items => {
        let locations: Array<Geofence> = items[0];
        let counts: LocationEventUpdateContainer = items[1];

        let data = locations.map(it => {
          return new GeofenceWithCount(it, counts.countForLocation(it.name))
        });

        this._locations$.next(data);
      });

    let all$: Observable<Array<Asset>> = merge(this.assetService.findAllMoving(), this.appService.startedMovingAssets$)
    all$.subscribe(aa => {
      let oldValue = this._assets$.value;
      let all = [].concat(oldValue, aa);
      this._assets$.next(all);
    });

    this.assetRoute$ = this.appService.assetRoute$
      .pipe(filter(it => it !== null))

    this.assetZoomAt$ = this.appService.assetZoomAt$
      .pipe(filter(it => it !== null))
  }
}
