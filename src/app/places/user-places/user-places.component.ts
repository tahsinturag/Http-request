import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {Place} from '../place.model';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import {PlacesService} from "../places.service";
@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placesService.loadUserPlaces()
      .subscribe({
        next: (places) => {
          this.places.set(places);
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
        complete: () => {
          this.isFetching.set(false);
        },

      });

  //   this.destroyRef.onDestroy(() => {
  //     subscripion.unsubscribe();
  //   });
  // }

  // onSelectPlace(selectedPlace: Place) {
  //   const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace.id).subscribe({
  //     next: (resData) => console.log(resData),
  //   });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
