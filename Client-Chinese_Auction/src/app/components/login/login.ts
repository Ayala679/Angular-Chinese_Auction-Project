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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule, ButtonModule, PasswordModule, MessageModule, ToastModule, InputMaskModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  providers: [MessageService]
})
export class Login {
  
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
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User registered successfully!', life: 3000 });
        console.log('User registered:', response);
        this.loginForm.reset(); 
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error , life: 3000 });
        console.error('Registration error:', err);
      }
    });
  }

}
