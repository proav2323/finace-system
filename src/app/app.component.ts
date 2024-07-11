import { Component, effect } from '@angular/core';
import { AuthService } from './services/auth.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'finace-system';
  loading = false;
  userLoading = false;
  user: User | null = null;

  constructor(private authSevice: AuthService) {
    this.authSevice.getUser();
    effect(() => {
      this.loading = this.authSevice.loading();
      this.userLoading = this.authSevice.userLoading();
      this.user = this.authSevice.user();
    });
  }
}
