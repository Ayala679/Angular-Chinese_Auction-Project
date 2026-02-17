import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
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
import { CreateUser } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule, ButtonModule, PasswordModule, MessageModule, ToastModule, InputMaskModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements OnInit {
  messageService = inject(MessageService);
  router = inject(Router);
  authService = inject(AuthenticateService);
  formBuilder = inject(FormBuilder);

  registerForm!: FormGroup<{
    email: any;
    password: any;
    confirmPassword: any;
    firstName: any;
    lastName: any;
    phone: any;
  }>;

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.pattern("^[0-9-]*$")]],
    }, { validators: this.passwordValidator.bind(this) });
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const isMatch = control.get('password')?.value === control.get('confirmPassword')?.value;
    const confirmPasswordControl = control.get('confirmPassword');
    if (confirmPasswordControl) {
      confirmPasswordControl.setErrors(isMatch ? null : { mismatch: true });
    }
    return isMatch ? null : { mismatch: true };
  }

  isInvalid(name: string): boolean {
    const control = this.registerForm.get(name);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  onSubmit() {
    if (!this.registerForm.valid) return;

    const formValue = this.registerForm.value as CreateUser & { confirmPassword: string };
    this.authService.register(
      formValue.email,
      formValue.password,
      formValue.first_name,
      formValue.last_name,
      formValue.phone || ''
    ).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User registered successfully!', life: 3000 });
        console.log('User registered:', response);
        this.registerForm.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error, life: 3000 });
        console.error('Registration error:', err);
      }
    });
  }
}
