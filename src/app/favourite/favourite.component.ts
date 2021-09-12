import {Component} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {FavouriteLocation} from "../shared/model/FavouriteLocation";
import {EnterpriseService} from "../shared/service/enterprise.service";

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css']
})
export class FavouriteComponent {
  private _locations$ = new BehaviorSubject<Array<FavouriteLocation>>([]);
  public readonly locations$: Observable<Array<FavouriteLocation>> = this._locations$.asObservable();

  constructor(
    private enterpriseService: EnterpriseService
  ) {
    this.enterpriseService
      .favouriteLocations$
      .subscribe(items => {
        this._locations$.next(items);
      });
  }
}
