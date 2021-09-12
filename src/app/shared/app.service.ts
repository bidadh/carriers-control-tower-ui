import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {EventSourcePolyfill} from 'event-source-polyfill';
import {Asset} from "./model/asset";
import {Event} from "./model/event";
import {environment} from "../../environments/environment";
import {AssetAdapter} from "./adapter/asset.adapter";
import {EventAdapter} from "./adapter/event.adapter";
import {LocationEventUpdateAdapter} from "./adapter/locationEventUpdate.adapter";
import {LocationEventUpdate, LocationEventUpdateContainer} from "./model/locationEventUpdate";
import {AssetRoute, ZoomAt} from "./model/asset.route";
import {AssetRouteAdapter} from "./adapter/assetRoute.adapter";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private readonly _startedMovingAssets$: BehaviorSubject<Array<Asset>> = new BehaviorSubject<Array<Asset>>([]);
  public readonly startedMovingAssets$: Observable<Array<Asset>> = this._startedMovingAssets$.asObservable();

  private readonly _movedAssets$: BehaviorSubject<Array<Asset>> = new BehaviorSubject<Array<Asset>>([]);
  public readonly movedAssets$: Observable<Array<Asset>> = this._movedAssets$.asObservable();

  private readonly _sseHeartbeats$: BehaviorSubject<Heartbeat> = new BehaviorSubject<Heartbeat>(null);
  public readonly sseHeartbeats$: Observable<Heartbeat> = this._sseHeartbeats$.asObservable();

  private readonly _assetCountData$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly assetCountData$: Observable<number> = this._assetCountData$.asObservable();

  private readonly _positionCountData$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly positionCountData$: Observable<number> = this._positionCountData$.asObservable();

  private readonly _eventCountData$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly eventCountData$: Observable<number> = this._eventCountData$.asObservable();

  private readonly _newEvents$: BehaviorSubject<Array<Event>> = new BehaviorSubject<Array<Event>>([]);
  public readonly newEvents$: Observable<Array<Event>> = this._newEvents$.asObservable();

  private readonly _newPropertyEvents$: BehaviorSubject<Array<Event>> = new BehaviorSubject<Array<Event>>([]);
  public readonly newPropertyEvents$: Observable<Array<Event>> = this._newPropertyEvents$.asObservable();

  private readonly _newAssets$: BehaviorSubject<Array<Asset>> = new BehaviorSubject<Array<Asset>>([]);
  public readonly newAssets$: Observable<Array<Asset>> = this._newAssets$.asObservable();

  private readonly _assetsWithEventsCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly assetsWithEventsCount$: Observable<number> = this._assetsWithEventsCount$.asObservable();

  private readonly _locationEventUpdates$: BehaviorSubject<LocationEventUpdateContainer> = new BehaviorSubject<LocationEventUpdateContainer>(new LocationEventUpdateContainer([]));
  public readonly locationEventUpdates$: Observable<LocationEventUpdateContainer> = this._locationEventUpdates$.asObservable()

  private readonly _assetRoute$: BehaviorSubject<AssetRoute> = new BehaviorSubject(null);
  public readonly assetRoute$: Observable<AssetRoute> = this._assetRoute$.asObservable();

  private readonly _assetZoomAt$: BehaviorSubject<ZoomAt> = new BehaviorSubject(null);
  public readonly assetZoomAt$: Observable<ZoomAt> = this._assetZoomAt$.asObservable();

  private readonly _eventTypes$: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>([]);
  private readonly eventTypes$: Observable<Array<string>> = this._eventTypes$.asObservable();

  constructor(
    private assetAdapter: AssetAdapter,
    private assetRouteAdapter: AssetRouteAdapter,
    private eventAdapter: EventAdapter,
    private locationEventUpdateAdapter: LocationEventUpdateAdapter
  ) {
    this.sseStream()
      .subscribe();
  }

  createEventSource(): EventSource {
    return new EventSourcePolyfill(`${environment.base_url}/events/${environment.enterprise.id}`, {
      headers: {
        "Authorization": environment.auth
      }
    });
  }

  sseStream(): Observable<ServerEvent> {
    return new Observable(observer => {
      const eventSource = this.createEventSource();

      eventSource.onmessage = event => {
        observer.next(event);
      };

      eventSource.addEventListener('EventTypesEvent', event => {
        // @ts-ignore
        let data = JSON.parse(event.data);
        this._eventTypes$.next(data.value)
      });

      eventSource.addEventListener('CountEvent', event => {
        // @ts-ignore
        let data = JSON.parse(event.data);
        this._assetCountData$.next(data.asset)
        this._positionCountData$.next(data.position)
        this._eventCountData$.next(data.event)
      });

      eventSource.addEventListener('EventCount', event => {
        // @ts-ignore
        let data = JSON.parse(event.data);
        this._eventCountData$.next(data.value)
      });

      eventSource.addEventListener('AssetCount', event => {
        // @ts-ignore
        let data = JSON.parse(event.data);
        this._assetCountData$.next(data.value)
      });

      eventSource.addEventListener('AssetsWithEventsCount', event => {
        // @ts-ignore
        let data = JSON.parse(event.data);
        this._assetsWithEventsCount$.next(data.value)
      });

      eventSource.addEventListener('EnterpriseLocationEvents', event => {
        // @ts-ignore
        let data = JSON.parse(event.data);
        let list: Array<LocationEventUpdate> = data.value.map(it => this.locationEventUpdateAdapter.adapt(it))
        this._locationEventUpdates$.next(new LocationEventUpdateContainer(list));
      });

      eventSource.addEventListener('PositionUpdateCount', event => {
        // @ts-ignore
        let data = JSON.parse(event.data);
        this._positionCountData$.next(data.value)
      });

      eventSource.addEventListener('AssetStartedMoving', event => {
        // @ts-ignore
        let item = JSON.parse(event.data);
        let asset: Asset = this.assetAdapter.adapt(item.value);
        this._startedMovingAssets$.next(new Array(asset));
      });

      eventSource.addEventListener('AssetMoved', event => {
        // @ts-ignore
        let item = JSON.parse(event.data);
        let asset: Asset = this.assetAdapter.adapt(item.value);
        this._movedAssets$.next(new Array(asset));
      });

      eventSource.addEventListener('NewAsset', event => {
        // @ts-ignore
        let item = JSON.parse(event.data);
        let asset: Asset = this.assetAdapter.adapt(item.value);
        this._newAssets$.next(new Array(asset));
      });

      eventSource.addEventListener('ENTERED', event => this.handleLocationEvent(event));

      eventSource.addEventListener('EXITED', event => this.handleLocationEvent(event));

      this.eventTypes$
        .subscribe(list => {
          list
            .filter(it => !["ENTERED", "EXITED"].includes(it))
            .forEach(it => {
              eventSource.addEventListener(it, event => {
                // @ts-ignore
                let data = JSON.parse(event.data)
                let ev: Event = this.eventAdapter.adapt(data);
                this._newEvents$.next(new Array(ev));
                this._newPropertyEvents$.next(new Array(ev));
                // console.warn("Asset: " + asset + " " + action + "  locations: " + locations);
                // console.warn(ev);
              });
            });
        });

      eventSource.addEventListener('Heartbeat', event => {
        // console.log(event);
        // @ts-ignore
        this._sseHeartbeats$.next(JSON.parse(event.data));
      });

      eventSource.addEventListener('AssetRoute', event => {
        // console.log(event);
        // @ts-ignore
        let data = JSON.parse(event.data);
        let assetRoute: AssetRoute = this.assetRouteAdapter.adapt(data.value);
        this._assetRoute$.next(assetRoute);
      });

      eventSource.addEventListener('ZoomAt', event => {
        // console.log(event);
        // @ts-ignore
        let data = JSON.parse(event.data);
        let value = data.value;
        let zoomAt: ZoomAt = new ZoomAt(value.asset, value.points);
        this._assetZoomAt$.next(zoomAt);

      });

      eventSource.onerror = error => {
        observer.error(error);
      };
    });
  }

  handleLocationEvent(event) {
    // @ts-ignore
    let data = JSON.parse(event.data)
    let asset = data.asset.name;
    let action = data.action;
    let locations = data.locations.map(it => it.name)
    let ev: Event = this.eventAdapter.adapt(data);
    this._newEvents$.next(new Array(ev));
    // console.info("Asset: " + asset + " " + action + "  locations: " + locations);
  }
}

export class ServerEvent {
  type: string;
  data: any;
}

export class Heartbeat {
  status: string;
  sequence: bigint;
}

export class CountEvent {
  constructor(
    public asset: number,
    public position: number,
    public event: number
  ) {
  }
}
