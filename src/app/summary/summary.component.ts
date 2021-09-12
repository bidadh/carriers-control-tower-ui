import {Component, OnInit} from '@angular/core';
import {AppService} from "../shared/app.service";
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  public readonly assetCount$: Observable<number>
  public readonly assetsWithEventsCount$: Observable<number>
  public readonly locationCount$: Observable<number>
  public readonly _positionGeneratedEventsPercentage$: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  public readonly positionGeneratedEventsPercentage$: Observable<number> = this._positionGeneratedEventsPercentage$.asObservable()
  public readonly _assetsWithEventsPercentage$: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  public readonly assetsWithEventsPercentage$: Observable<number> = this._assetsWithEventsPercentage$.asObservable()
  public readonly eventCount$: Observable<number>

  constructor(private appService: AppService) {
    this.assetCount$ = this.appService.assetCountData$
    this.assetsWithEventsCount$ = this.appService.assetsWithEventsCount$
    this.locationCount$ = this.appService.positionCountData$
    this.eventCount$ = this.appService.eventCountData$
    let all$ = combineLatest(this.eventCount$, this.locationCount$)
    this.positionGeneratedEventsPercentage$ = all$
      .pipe(
        map(n => {
          let ec = n[0];
          let pc = n[1];
          if(pc == 0) {
            return 0;
          }
          return Math.ceil(100 * ec / pc);
        })
      );

    let assetsWithEventsAll$ = combineLatest(this.assetCount$, this.assetsWithEventsCount$)
    this.assetsWithEventsPercentage$ = assetsWithEventsAll$
      .pipe(
        map(n => {
          let ac = n[0];
          let awec = n[1];
          if(ac == 0) {
            return 0;
          }
          return Math.ceil(100 * awec / ac);
        })
      );
  }

  ngOnInit(): void {
  }

}
