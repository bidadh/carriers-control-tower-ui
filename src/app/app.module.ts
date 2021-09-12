import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {AssetListComponent} from './asset-list/asset-list.component';
import {MapComponent} from './map/map.component';
import {GoogleMapsModule} from "@angular/google-maps";
import {MapboxComponent} from './mapbox/mapbox.component';
import {SummaryComponent} from './summary/summary.component';
import {FavouriteComponent} from './favourite/favourite.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventCriticalityPipe } from './event-list/event-criticality.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AssetListComponent,
    MapComponent,
    MapboxComponent,
    SummaryComponent,
    FavouriteComponent,
    EventListComponent,
    EventCriticalityPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
