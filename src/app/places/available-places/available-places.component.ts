import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

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
  error = signal('');
  private httpClient = inject(HttpClient);
  private destroyRef = inject (DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);

   const subscripion= this.httpClient
     .get<{ places: Place[]}>('http://localhost:3000/places')
     .pipe(
       map((resData) => resData.places)
     )

     .subscribe({
      next: (places) => {
      this.places.set(places);

        },
       error: (error)=> {
         console.log(error);
        this.error.set("Something went wrong fetching the available places");
       },

       complete: () => {
        this.isFetching.set(false);
       }
      });
    this.destroyRef.onDestroy(() =>{
      subscripion.unsubscribe();
    });
  }

  onSelectPlace(selectedPlace: Place) {
  this.httpClient.put('http://localhost:3000/user-places', {
    placeId: selectedPlace.id,
  }).subscribe({
    next: (resData) => console.log(resData),
  });
  }
  // 2--------------
}


