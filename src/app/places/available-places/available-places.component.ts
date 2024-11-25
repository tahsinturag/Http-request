import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import {HttpClient} from "@angular/common/http";
import {resetFakeAsyncZone} from "@angular/core/testing";

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);

  private httpClient = inject(HttpClient);
  private destroyRef = inject (DestroyRef);
//  1-----
  ngOnInit() {
   const subscripion= this.httpClient
     .get<{ places: Place[]}>('http://localhost:3000/places')
     .subscribe({
      next: (resData) => {
        console.log(resData.places);


        // ,{
     // // observe: 'response'
  //    //     observe: 'events'
  //
  // }
  //    )
  //    .subscribe({
  //       next: (event) => {
  //         console.log(event);

          // console.log(response);
          // console.log(response.body?.places);
        },
      });
    this.destroyRef.onDestroy(() =>{
      subscripion.unsubscribe();
    });
  }
}
// 2------
