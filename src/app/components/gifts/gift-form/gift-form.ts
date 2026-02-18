import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { GetCategory } from '../../../models/category.model';
import { CategoryService } from '../../../services/category-service';
import { Observable, catchError, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { DonorService } from '../../../services/donor-service';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { GiftDto } from '../../../models/gift.model';
import { ManagerGetDonor } from '../../../models/donor.model';

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
    CommonModule,
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
  giftForm!: FormGroup<{
    name: any;
    description: any;
    details: any;
    picture: any;
    value: any;
    donorId: any;
    categoryId: any;
    isLottery: any;
  }>;
  previewImage: string | null = null;
  checked: boolean = false;
  readonly BASE_IMG_URL = 'https://localhost:7031/images/gifts/';
  readonly CATEGORY_BASE_URL = 'https://localhost:7031/images/categories/';
  readonly DONOR_BASE_URL = 'https://localhost:7031/images/companies/';
  categories$: Observable<GetCategory[]>;
  donors$: Observable<ManagerGetDonor[]>;
  categoryService = inject(CategoryService);
  donorService = inject(DonorService);
  selectedFile: File | null = null;
  private formBuilder = inject(FormBuilder);

  constructor() {
    this.categories$ = this.categoryService.getCategories().pipe(
      catchError(err => {
        console.error('Error loading categories:', err);
        return of([]);
      })
    );
    this.donors$ = this.donorService.getDonors().pipe(
      catchError(err => {
        console.error('Error loading donors:', err);
        return of([]);
      })
    );
  }

  ngOnInit() {
    console.log(this.config.data);
    this.initForm();

    if (this.config.data) {      
      this.giftForm.patchValue({
        name: this.config.data.name,
        description: this.config.data.description,
        details: this.config.data.details,
        value: this.config.data.value,
        donorId: this.config.data.donorId,
        categoryId: this.config.data.categoryId,
        isLottery: this.config.data.isLottery || false
      });      
      if (this.config.data.picture) {
        this.previewImage = this.BASE_IMG_URL + this.config.data.picture;
        this.giftForm.get('picture')?.setValue(this.config.data.picture);
      }
    }
  }

  private initForm() {
    this.giftForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required]],
      details: [''],
      picture: ['', [Validators.required]],
      value: [null, [Validators.required, Validators.min(1)]],
      donorId: [null],
      categoryId: [null, [Validators.required]],
      isLottery: [false]
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
      const formValue = this.giftForm.value as GiftDto;
      
      const result: any = { ...formValue };
      if (this.config.data?.id) result.id = this.config.data.id;
      if (this.config.data && !this.selectedFile) {
        result.picture = this.config.data.picture;
      } else {
        result.picture = this.selectedFile;
      }
      this.ref.close(result);
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

