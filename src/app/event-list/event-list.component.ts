import {Component, OnInit} from '@angular/core';
import {AppService} from "../shared/app.service";
import {EventService} from "../shared/service/event.service";
import {Event} from "../shared/model/event";
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {Criticality} from "../shared/model/criticality";
import {CriticalityFilter, EventCriticalityPipe} from "./event-criticality.pipe";
import {MapboxService} from "../mapbox/mapbox.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  private _events$: BehaviorSubject<Array<Event>> = new BehaviorSubject<Array<Event>>([]);
  public readonly events$: Observable<Array<Event>> = this._events$.asObservable();

  catStyle = environment.catStyle
  textColor = environment.textColor
  filter: CriticalityFilter = {criticality: Criticality.Low};

  defaultPageSize = 100
  pipe = new EventCriticalityPipe()

  setFilterToExtreme() {
    this.setFilter(Criticality.Extreme)
  }

  setFilterToHigh() {
    this.setFilter(Criticality.High)
  }

  setFilterToNormal() {
    this.setFilter(Criticality.Normal)
  }

  setFilterToAll() {
    this.setFilter(Criticality.Low)
  }

  setFilter(c: Criticality) {
    this.filter = {
      criticality: c
    };
  }

  showOnMap(e: Event) {
    this.mapboxService.showEventOnMap(e);
  }

  constructor(
      private eventService: EventService,
      private appService: AppService,
      private mapboxService: MapboxService
  ) {
  }

  ngOnInit(): void {
    let all$: Observable<Array<Event>> = merge(this.eventService.findAll(this.defaultPageSize), this.appService.newEvents$)
    all$.subscribe(aa => {
      let oldValue = this._events$.value;
      let all = [].concat(aa, oldValue);
      this._events$.next(all);
    });
  }
}
