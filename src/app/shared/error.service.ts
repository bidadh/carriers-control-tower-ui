import {Injectable} from '@angular/core';
import {Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandler {

  constructor() {
  }

  handleError(error: any): Observable<never> {
    console.error(error);
    return throwError(error.error);
  }
}
