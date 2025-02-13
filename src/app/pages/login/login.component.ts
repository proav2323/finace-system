import { Component, WritableSignal, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  error: WritableSignal<{ email: string; password: string; gen: string }> =
    signal({ email: '', password: '', gen: '' });
  loading: WritableSignal<boolean> = signal(false);
  isSubmited = signal(false);
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService) {
    this.form.valueChanges.subscribe(() => {
      console.log('smnadjn');
      if (!this.form.valid) {
        if (this.isSubmited()) {
          if (this.form.controls['email'].hasError('email')) {
            this.error.set({
              email: 'email is not valid',
              password: this.error().password,
              gen: '',
            });
          } else {
            if (this.form.controls['email'].hasError('required')) {
              this.error.set({
                email: 'email is required',
                password: '',
                gen: '',
              });
            } else {
              this.error.set({
                email: '',
                password: this.error().password,
                gen: '',
              });
            }
          }
        }
        if (this.isSubmited()) {
          if (this.form.controls['password'].hasError('required')) {
            this.error.set({
              email: this.error().email,
              password: 'password is required',
              gen: '',
            });
          } else {
            this.error.set({
              email: this.error().email,
              password: '',
              gen: '',
            });
          }
        }
      } else {
        this.error.set({ email: '', password: '', gen: '' });
      }
    });
  }

  submit() {
    this.isSubmited.set(true);
    if (this.form.valid) {
      this.loading.set(true);
      this.form.disable();
      const email = this.form.controls['email'].value;
      const password = this.form.controls['password'].value;
      this.authService.login(email, password, this.loading, this.error);
      this.form.enable();
    } else {
      if (this.form.controls['email'].hasError('email')) {
        this.error.set({
          email: 'email is not valid',
          password: '',
          gen: '',
        });
      } else {
        if (this.form.controls['email'].hasError('required')) {
          this.error.set({
            email: 'email is required',
            password: '',
            gen: '',
          });
        }
      }

      if (this.form.controls['password'].hasError('required')) {
        this.error.set({
          email: this.error().email,
          password: 'password is required',
          gen: '',
        });
      }
    }
  }
}
