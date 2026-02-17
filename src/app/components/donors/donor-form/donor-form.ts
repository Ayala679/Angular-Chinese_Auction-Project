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
    firstName: any;
    lastName: any;
    phone: any;
    password: any;
    isPublish: any;
    companyName: any;
    companyDescription: any;
    companyPicture: any;
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
        firstName: this.config.data.firstName,
        lastName: this.config.data.lastName,
        phone: this.config.data.phone,
        companyName: this.config.data.companyName,
        companyDescription: this.config.data.companyDescription,
        isPublish: !!this.config.data.isPublish,
      });
      if (this.config.data.companyPicture) {
        this.previewImage = this.BASE_IMG_URL + this.config.data.companyPicture;
      }
    }
  }

  private initForm() {
    this.donorForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.pattern('^\\+?[0-9]\\d{1,14}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      isPublish: [false],
      companyName: [''],
      companyDescription: [''],
      companyPicture: [null]
    });
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.donorForm.patchValue({ companyPicture: file });
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewImage = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  onFileRemove(fileUpload: any) {
    if (fileUpload) {
      fileUpload.clear();
    }
    this.donorForm.get('companyPicture')?.setValue(null);
    this.previewImage = null;
  }

  save() {
    if (this.donorForm.valid) {
      const formValue = this.donorForm.value as CreateDonor;
      this.ref.close({ ...formValue, companyPicture: this.selectedFile || formValue.companyPicture });
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

