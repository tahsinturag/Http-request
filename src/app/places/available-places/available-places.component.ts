import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import {HttpClient} from "@angular/common/http";
import {resetFakeAsyncZone} from "@angular/core/testing";
import {map} from "rxjs";

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  // 3-------

  private httpClient = inject(HttpClient);
  private destroyRef = inject (DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
   //  3---------
   const subscripion= this.httpClient
     .get<{ places: Place[]}>('http://localhost:3000/places')
     .pipe(
       map((resData) => resData.places)
     )
     // 2------------
     .subscribe({
      next: (places) => {
      this.places.set(places);
      //  1-----
        },
       complete: () => {
        this.isFetching.set(false);
       }
      //  4-------
      });
    this.destroyRef.onDestroy(() =>{
      subscripion.unsubscribe();
    });
  }
}

