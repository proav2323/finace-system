import { Component, WritableSignal, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  error: WritableSignal<{
    email: string;
    password: string;
    gen: string;
    name: string;
  }> = signal({ email: '', password: '', gen: '', name: '' });
  loading: WritableSignal<boolean> = signal(false);
  isSubmited = signal(false);
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
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
              name: this.error().name,
            });
          } else {
            if (this.form.controls['email'].hasError('required')) {
              this.error.set({
                email: 'email is required',
                password: '',
                gen: '',
                name: this.error().name,
              });
            } else {
              this.error.set({
                email: '',
                password: this.error().password,
                gen: '',
                name: this.error().name,
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
              name: this.error().name,
            });
          } else {
            this.error.set({
              email: this.error().email,
              password: '',
              gen: '',
              name: this.error().name,
            });
          }
        }

        if (this.isSubmited()) {
          if (this.form.controls['name'].hasError('required')) {
            this.error.set({
              email: this.error().email,
              password: this.error().password,
              gen: '',
              name: 'name is required',
            });
          } else {
            this.error.set({
              email: this.error().email,
              password: this.error().password,
              gen: '',
              name: '',
            });
          }
        }
      } else {
        this.error.set({ email: '', password: '', gen: '', name: '' });
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
      const name = this.form.controls['name'].value;
      this.authService.register(
        email,
        password,
        name,
        this.loading,
        this.error
      );
      this.form.enable();
    } else {
      if (this.form.controls['email'].hasError('email')) {
        this.error.set({
          email: 'email is not valid',
          password: '',
          gen: '',
          name: '',
        });
      } else {
        if (this.form.controls['email'].hasError('required')) {
          this.error.set({
            email: 'email is required',
            password: '',
            gen: '',
            name: '',
          });
        }
      }

      if (this.form.controls['password'].hasError('required')) {
        this.error.set({
          email: this.error().email,
          password: 'password is required',
          gen: '',
          name: '',
        });
      }

      if (this.form.controls['name'].hasError('required')) {
        this.error.set({
          email: this.error().email,
          password: this.error().password,
          gen: '',
          name: 'name is required',
        });
      }
    }
  }
}
