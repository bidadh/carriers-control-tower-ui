import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {ErrorHandler} from "../error.service";
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {EventAdapter} from "../adapter/event.adapter";
import {Event} from "../model/event";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly url: string;
  options = {
    headers: {
      "Authorization": environment.auth
    }
  };

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandler,
    private eventAdapter: EventAdapter
  ) {
    this.url = `${environment.base_url}/event/${environment.enterprise.id}`;
  }

  public findAll(size: number): Observable<Array<Event>> {
    let request$: Observable<Array<Event>>;
    request$ = this.http.get<Array<Event>>(`${this.url}?size=${size}`, this.options)
      .pipe(catchError(this.errorHandler.handleError))
      .pipe(
        map(data => data.map(item => this.eventAdapter.adapt(item))),
        tap(list => console.info(`fetched ${list.length} events!`))
      );

    return request$
  }

}
