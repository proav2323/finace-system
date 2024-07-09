import { Component, effect } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  user: User | null = null;
  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {
    effect(() => {
      console.log(this.authService.user());
      this.user = this.authService.user();
    });
  }

  setDarkTheme() {
    this.themeService.setDark();
  }

  setLight() {
    this.themeService.setLight();
  }

  logout() {
    this.authService.logout();
  }
}
