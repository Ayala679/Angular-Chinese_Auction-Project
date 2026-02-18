import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { DonorService } from '../../../services/donor-service';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { CreateDonor } from '../../../models/donor.model';

@Component({
  selector: 'app-donor-form',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    ImageModule,
    ReactiveFormsModule,
    FormsModule,
    CheckboxModule,
  ],
  templateUrl: './donor-form.html',
  styleUrl: './donor-form.scss',
})
export class DonorForm implements OnInit {
  private messageService = inject(MessageService);
  private ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  donorForm!: FormGroup<{
    email: any;
    first_name: any;
    last_name: any;
    phone: any;
    password: any;
    is_publish: any;
    company_name: any;
    company_description: any;
    company_picture: any;
  }>;
  previewImage: string | null = null;
  checked: boolean = false;
  readonly BASE_IMG_URL = 'https://localhost:7031/images/companies/';
  selectedFile: File | null = null;
  private formBuilder = inject(FormBuilder);

  ngOnInit() {
    console.log(this.config.data);
    this.initForm();

    if (this.config.data) {
      this.donorForm.patchValue({
        email: this.config.data.email,
        first_name: this.config.data.first_name,
        last_name: this.config.data.last_name,
        phone: this.config.data.phone,
        company_name: this.config.data.company_name,
        company_description: this.config.data.company_description,
        is_publish: !!this.config.data.is_publish,
      });
      if (this.config.data.company_picture) {
        this.previewImage = this.BASE_IMG_URL + this.config.data.company_picture;
      }
    }
  }

  private initForm() {
    this.donorForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.pattern('^\\+?[0-9]\\d{1,14}$')]],
      password: ['123456'],
      is_publish: [false],
      company_name: [''],
      company_description: [''],
      company_picture: [null]
    });
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.donorForm.patchValue({ company_picture: file });
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewImage = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  onFileRemove(fileUpload: any) {
    if (fileUpload) {
      fileUpload.clear();
    }
    this.donorForm.get('company_picture')?.setValue(null);
    this.previewImage = null;
  }

  save() {
    if (this.donorForm.valid) {
      const formValue = this.donorForm.value as CreateDonor;
      this.ref.close({ ...formValue, company_picture: this.selectedFile || formValue.company_picture });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'שגיאה',
        detail: 'נא למלא את כל שדות החובה'
      });
    }
  }

  cancel() {
    this.ref.close();
  }
}

