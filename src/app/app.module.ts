import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { FiltersComponent } from './components/filters/filters.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { RegisterComponent } from './pages/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LogoComponent } from './components/logo/logo.component';
import { ProfilePhotoComponent } from './components/profile-photo/profile-photo.component';

import {
  HlmAvatarImageDirective,
  HlmAvatarComponent,
  HlmAvatarFallbackDirective,
} from '@spartan-ng/ui-avatar-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuComponent,
} from '@spartan-ng/ui-menu-helm';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { uk_UA } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import uk from '@angular/common/locales/uk';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideChevronDown,
  lucideChevronUp,
} from '@ng-icons/lucide';
import { BrnSelectImports, BrnSelectModule } from '@spartan-ng/ui-select-brain';
import {
  HlmSelectDirective,
  HlmSelectImports,
  HlmSelectModule,
} from '@spartan-ng/ui-select-helm';
import { HlmIconComponent } from '../lib/ui-icon-helm/src/lib/hlm-icon.component';
import { HlmIconModule } from 'src/lib/ui-icon-helm/src';

@NgModule({
  declarations: [
    AppComponent,
    FiltersComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    NavbarComponent,
    LogoComponent,
    ProfilePhotoComponent,
    DateRangePickerComponent,
  ],
  imports: [
    HlmAvatarImageDirective,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
    HlmMenuComponent,
    HlmMenuGroupComponent,
    BrnSelectModule,
    HlmSelectDirective,
    HlmSelectModule,
    HlmMenuItemDirective,
    HlmMenuItemIconDirective,
    HlmMenuItemSubIndicatorComponent,
    HlmMenuLabelComponent,
    HlmMenuSeparatorComponent,
    HlmMenuShortcutComponent,
    BrnMenuTriggerDirective,
    HlmSubMenuComponent,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HlmSpinnerComponent,
    MatDatepickerModule,
    MatButtonModule,
    HlmIconComponent,
    HlmIconModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: NZ_I18N, useValue: uk_UA },
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNativeDateAdapter(),
    provideIcons({ lucideChevronDown, lucideChevronUp }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
