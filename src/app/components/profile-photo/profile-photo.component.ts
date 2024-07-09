import { Component, effect } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrl: './profile-photo.component.css',
})
export class ProfilePhotoComponent {
  name: string[] = ['A', 'E'];

  constructor(private authService: AuthService) {
    effect(() => {
      if (this.authService.user() != null) {
        this.name = this.authService.user()!.name.split(' ');
      }
    });
  }
}
