import {Injectable} from '@angular/core';
import {ErrorHandler} from "../error.service";
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {Enterprise} from "../model/enterprise";
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {catchError, map, tap} from "rxjs/operators";
import {EnterpriseAdapter} from "../adapter/enterprise.adapter";
import {Geofence} from "../model/geofence";
import {FavouriteLocation} from "../model/FavouriteLocation";
import {AppService} from "../app.service";
import {LocationEventUpdateContainer} from "../model/locationEventUpdate";

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {
  private readonly url: string;
  private _enterprise$: BehaviorSubject<Enterprise> = new BehaviorSubject<Enterprise>(null);
  public readonly enterprise$: Observable<Enterprise> = this._enterprise$.asObservable();
  private _locations$: BehaviorSubject<Array<Geofence>> = new BehaviorSubject<Array<Geofence>>([]);
  public readonly locations$: Observable<Array<Geofence>> = this._locations$.asObservable()
  private readonly _favouriteLocations$: BehaviorSubject<Array<FavouriteLocation>> = new BehaviorSubject<Array<FavouriteLocation>>([]);
  public readonly favouriteLocations$: Observable<Array<FavouriteLocation>> = this._favouriteLocations$.asObservable()

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandler,
    private appService: AppService,
    private enterpriseAdapter: EnterpriseAdapter
  ) {
    this.url = `${environment.base_url}/enterprise/${environment.enterprise.id}`
    this.get()
      .subscribe(en => console.info(`fetched en: !` + en.locations.length));

    let combined$: Observable<Array<any>> = combineLatest(this.locations$, this.appService.locationEventUpdates$)
    combined$
      .subscribe(items => {
        let locations: Array<Geofence> = items[0];
        let updatesContainer: LocationEventUpdateContainer = items[1];

        let fl = locations
          .filter(it => {
            return it.isFavourite
          })
          .map(it => {
            let lastAction = updatesContainer.actionForLocation(it.name);
            let lastActive = updatesContainer.lastActiveForLocation(it.name);
            let numberOfAssets = updatesContainer.countForLocation(it.name);
            return new FavouriteLocation(it.name, lastActive, numberOfAssets, lastAction);
          })

        this._favouriteLocations$.next(fl);
      });

  }

  private get(): Observable<Enterprise> {
    let options = {
      headers: {
        "Authorization": environment.auth
      }
    };

    let request$: Observable<Enterprise>;
    request$ = this.http.get<Enterprise>(this.url, options)
      .pipe(catchError(this.errorHandler.handleError))
      .pipe(
        map(data => this.enterpriseAdapter.adapt(data)),
        tap(en => {
          this._enterprise$.next(en)
          this._locations$.next(en.locations)
        })
      );

    return request$
  }
}
