import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, merge, Observable} from "rxjs";
import {Asset} from "../shared/model/asset";
import {AppService} from "../shared/app.service";
import {AssetService} from "../shared/service/asset.service";

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css']
})
export class AssetListComponent implements OnInit {
  private _assets$: BehaviorSubject<Array<Asset>> = new BehaviorSubject<Array<Asset>>([]);
  public readonly assets$: Observable<Array<Asset>> = this._assets$.asObservable();

  constructor(private assetService: AssetService, private appService: AppService) {
  }

  ngOnInit(): void {
/*
    let all$: Observable<Array<Asset>> = merge(this.assetService.findAll(), this.appService.newAssets$)
    all$.subscribe(aa => {
      let oldValue = this._assets$.value;
      let all = [].concat(oldValue, aa);
      this._assets$.next(all);
    });
*/
  }
}
