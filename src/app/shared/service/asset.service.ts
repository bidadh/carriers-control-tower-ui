import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import {ErrorHandler} from "../error.service";
import {AssetAdapter} from "../adapter/asset.adapter";
import {environment} from "../../../environments/environment";
import {Asset} from "../model/asset";

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private readonly assetUrl: string;
  options = {
    headers: {
      "Authorization": environment.auth
    }
  };

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandler,
    private assetAdapter: AssetAdapter
  ) {
    this.assetUrl = `${environment.base_url}/asset/${environment.enterprise.id}`;
  }

  // noinspection JSUnusedGlobalSymbols
  public findAll(): Observable<Array<Asset>> {
    let request$: Observable<Array<Asset>>;
    request$ = this.http.get<Array<Asset>>(this.assetUrl, this.options)
      .pipe(catchError(this.errorHandler.handleError))
      .pipe(
        map(data => data.map(item => this.assetAdapter.adapt(item))),
        tap(list => console.info(`fetched ${list.length} assets!`))
      );

    return request$
  }

  public findAllMoving(): Observable<Array<Asset>> {
    let request$: Observable<Array<Asset>>;
    request$ = this.http.get<Array<Asset>>(`${this.assetUrl}/moving`, this.options)
      .pipe(catchError(this.errorHandler.handleError))
      .pipe(
        map(data => data.map(item => this.assetAdapter.adapt(item))),
        tap(list => console.info(`fetched ${list.length} moving assets!`))
      );

    return request$
  }
}
