import { Component, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent {
  isVisible: WritableSignal<boolean> = signal(true);
  constructor(private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe((data) => {
      if (this.router.url === '/login' || this.router.url === '/register') {
        this.isVisible.set(false);
      } else {
        this.isVisible.set(true);
      }
    });
  }
}
