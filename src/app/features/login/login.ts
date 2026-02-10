import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LoginCredentials } from '../../core/models/login-credentials.model';
import { Router } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private storage = inject(StorageService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  errorMessage = signal<string | null>(null);
  submitting = signal(false);

  ngOnInit(): void {
    if(this.storage.isAuthenticated()) {
      console.log("El usuario ya inició sesion, va al dashboard");
      this.router.navigateByUrl("/dashboard");
    }
  }

  onSubmit() {
    this.errorMessage.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const credentials = this.form.getRawValue() as LoginCredentials;
    this.auth.login(credentials)
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.errorMessage.set(null);
          // TODO: Aquí podrías navegar o emitir evento después del login
          this.router.navigateByUrl("/dashboard");
        },
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(err?.error?.message || 'Error al autenticar. Intente de nuevo.');
        }
      });
  }

}
