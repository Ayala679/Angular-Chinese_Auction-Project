import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
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
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule, ButtonModule, PasswordModule, MessageModule, ToastModule, InputMaskModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  providers: [MessageService]
})
export class Login {
  router = inject(Router);
  messageService = inject(MessageService);
  authService = inject(AuthenticateService); 
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.minLength(8)],),
    });
  }

isInvalid(name: string) {
  const control = this.loginForm.get(name);
  return control ? control.invalid && (control.touched || control.dirty) : false;
}

onSubmit() {
    const { Email, Password } = this.loginForm.value;
    this.authService.login(Email, Password).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User logged successfully!', life: 3000 });
        console.log('User logged:', response);
        this.loginForm.reset(); 
        this.router.navigate(['/']);

      },
      error: (err) => {
        const errorMessage = err.error?.detail || err.error?.title || (typeof err.error === 'string' ? err.error : 'פרטי התחברות שגויים');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage , life: 3000 });
        console.error('Registration error:', err);
      }
    });
  }
 
}
