import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandler} from "./shared/error.service";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import {Geofence} from "./shared/model/geofence";
import {GeofenceAdapter} from "./shared/adapter/geofence.adapter";

@Injectable({
  providedIn: 'root'
})
export class GeofenceService {
  private readonly locationsUrl: string;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandler,
    private geofenceAdapter: GeofenceAdapter
  ) {
    this.locationsUrl = `${environment.base_url}/enterprise/locations`;
  }

  public findAll(): Observable<Array<Geofence>> {
    let options = {
      headers: {
        "Authorization": environment.auth
      }
    };

    let request$: Observable<Geofence[]>;
    request$ = this.http.get<Geofence[]>(this.locationsUrl, options)
      .pipe(catchError(this.errorHandler.handleError))
      .pipe(
        map((data: any[]) =>
          data.map(it => this.geofenceAdapter.adapt(it))
        )
      )
      .pipe(
        tap(list => console.info(`fetched ${list.length} locations!`))
      );

    return request$
  }
}
