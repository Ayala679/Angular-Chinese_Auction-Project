import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { GiftService } from '../../../services/gift-service';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { maxLength } from '@angular/forms/signals';
import { InputNumberModule } from 'primeng/inputnumber';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { GetCategory } from '../../../models/category.model';
import { CategoryService } from '../../../services/category-service';
import { AsyncPipe } from '@angular/common';
import { DonorService } from '../../../services/donor-service';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-gift-form',
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
    InputNumberModule,
    CascadeSelectModule,
    AsyncPipe,
    SelectModule,
    FloatLabelModule
  ],
  templateUrl: './gift-form.html',
  styleUrl: './gift-form.scss',
})
export class GiftForm implements OnInit {


  private messageService = inject(MessageService);
  private ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  giftForm!: FormGroup;
  previewImage: any = null;
  checked: boolean = false;
  readonly BASE_IMG_URL = 'https://localhost:7031/images/gifts/';
  categories$: any = [];
  donors$: any = [];
  categoryService = inject(CategoryService);
  donorService = inject(DonorService);
  selectedFile: File | null = null;


  ngOnInit() {
    console.log(this.config.data);
    this.categories$ = this.categoryService.getCategories();

    this.donors$ = this.donorService.getDonors();
    this.initForm();


    if (this.config.data) {

      this.giftForm.patchValue(this.config.data);
      if (this.config.data.picture) {
        this.previewImage = this.BASE_IMG_URL + this.config.data.picture;
      }
      if (this.config.data.category_Id) {
        this.giftForm.get('category_Id')?.setValue(this.config.data.category_Id);
      }
    }

  }

  private initForm() {

    this.giftForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      description: new FormControl('', [Validators.required]),
      details: new FormControl(''),
      picture: new FormControl('', [Validators.required]),
      value: new FormControl(null, [Validators.required, Validators.min(1)]),
      donor_Id: new FormControl(null),
      category_Id: new FormControl(null, [Validators.required]),
      isLottery: new FormControl(false),
      IsApproved: new FormControl(false)
    });
  }




  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      this.giftForm.patchValue({ picture: file });
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewImage = e.target.result;
      reader.readAsDataURL(file);
    }
  }


  onFileRemove(fileUpload: any) {
    if (fileUpload) {
      fileUpload.clear();
    }
    this.giftForm.get('picture')?.setValue(null);
    this.previewImage = null;
  }


  save() {
    if (this.giftForm.valid) {

      const result = this.giftForm.value
      if (this.config.data?.id) result.id = this.config.data.id;
      if (this.config.data && !this.selectedFile) {
        result.picture = this.config.data.picture;
      }
      else {
        result.picture = this.selectedFile;
      }
      this.ref.close(result);
    }
    else {
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

