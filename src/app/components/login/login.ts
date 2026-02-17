import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';
import { AuthenticateService } from '../../services/authenticate-service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../models/authenticate.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule, ButtonModule, PasswordModule, MessageModule, ToastModule, InputMaskModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  router = inject(Router);
  messageService = inject(MessageService);
  authService = inject(AuthenticateService);
  formBuilder = inject(FormBuilder);

  loginForm!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  isInvalid(name: string): boolean {
    const control = this.loginForm.get(name);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  onSubmit() {
    if (!this.loginForm.valid) return;

    const formValue = this.loginForm.value as LoginRequest;
    this.authService.login(formValue.email, formValue.password).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User logged successfully!', life: 3000 });
        console.log('User logged:', response);
        this.loginForm.reset();
        this.router.navigate(['/']);
      },
      error: (err) => {
        let errorMessage = '';
        if (err.status === 401) {
          errorMessage = "שם המשתמש או הסיסמה אינם נכונים"
        } else {
          errorMessage = err.error?.detail || err.error?.title || (typeof err.error === 'string' ? err.error : 'פרטי התחברות שגויים');
        }
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
      }
    });
  }
}
