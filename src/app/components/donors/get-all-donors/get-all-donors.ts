import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DonorService } from '../../../services/donor-service';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DonorForm } from '../donor-form/donor-form';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { GiftForm } from '../../gifts/gift-form/gift-form';
import { GiftService } from '../../../services/gift-service';

@Component({
  selector: 'app-get-all-donors',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, ToastModule,
    ToolbarModule, DialogModule, ConfirmDialogModule, InputTextModule,
    TagModule, DynamicDialogModule
  ],
  providers: [DialogService, MessageService, ConfirmationService],
  templateUrl: './get-all-donors.html',
  styleUrl: './get-all-donors.scss'
})
export class GetAllDonors implements OnInit {
  private donorService = inject(DonorService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private giftService = inject(GiftService);
  private confirmationService = inject(ConfirmationService);
  expandedRows: any = {};


  donors: any[] = [];
  donor: any = {};
  donorDialog: boolean = false; // עבור עריכה
  ref: DynamicDialogRef | null = null; // עבור הדיאלוג הדינמי שלכן
  private cdr = inject(ChangeDetectorRef)
  readonly IMAGE_BASE_URL = 'https://localhost:7031/images/companies/';
  readonly IMAGE_BASE_URL_GIFT = 'https://localhost:7031/images/gifts/';


  ngOnInit() {

    this.loadDonors();

  }


  loadDonors() {
    this.donorService.getDonors().subscribe(data => {
      this.donors = data;
      this.cdr.detectChanges()
      console.log(this.donors);

    });
  }
  expandAll() {
    this.expandedRows = this.donors.reduce((acc, d) => (acc[d.id] = true) && acc, {});
  }

  collapseAll() {
    this.expandedRows = {};
  }

  onRowExpand(event: TableRowExpandEvent) {
    this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    this.messageService.add({
      severity: 'success',
      summary: 'Product Collapsed',
      detail: event.data.name,
      life: 3000
    });
  }

  // פתיחת הקומפוננטה הקיימת להוספת תורם
  showChild() {
    this.ref = this.dialogService.open(DonorForm, {
      header: 'הוספת תורם חדש',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });


    this.ref?.onClose.subscribe((result) => {
      if (result) {
        // כאן משתמשים ב-Service שלכן לשליחת FormData
        this.donorService.addDonor(result, result.company_picture).subscribe({
          next: (newDonor) => {
            this.donors = [...this.donors, newDonor];
            this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'התורם נוסף למערכת' });
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: err.error });
          }
        });
      }
    });
  }


  showGiftChild(donor: any) {
    this.ref = this.dialogService.open(GiftForm, {
      header: 'הוספת מתנה חדש',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: { donor_Id: donor.id }
    });
    this.ref?.onClose.subscribe((result) => {
      if (result) {
        console.log(result);
        
        this.giftService.addGift(result, result.picture).subscribe({
          next: (newGift) => {
            this.donors = this.donors.map(donor => {
              // 2. חפשי את התורם שאליו נוספה המתנה
              if (donor.id === result.Donor_Id) {
                // 3. החזירי אובייקט תורם חדש עם רשימת מתנות מעודכנת
                return {
                  ...donor,
                  gifts: donor.gifts ? [...donor.gifts, newGift] : [newGift]
                };
              }
              return donor;
            });
            this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'התורם נוסף למערכת' });
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: err.error });
          }
        });
      }
    });
  }

  editGift(gift: any) {
    this.ref = this.dialogService.open(GiftForm, {
      header: 'עריכת מתנה',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: gift
    });

    this.ref?.onClose.subscribe((result) => {
      console.log(result);
      if (result) {
        this.giftService.updateGift(gift.id, result, result.picture).subscribe({
          next: (updatedGift) => {
            this.donors = this.donors.map(donor => {
              console.log(donor);
              
              if (donor.id === result.donor_Id) {
                return {
                  ...donor,
                  gifts: donor.gifts.map((g:any) => g.id === gift.id ? updatedGift : g)
                };
              }
              return donor;
            });
            this.donors = [...this.donors];
            this.cdr.detectChanges();
            this.messageService.add({ severity: 'success', summary: 'עודכן', detail: 'פרטי התורם עודכנו בהצלחה' });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'העדכון נכשל' });
          }
        });
      }
    });
  }




  editDonor(donor: any) {
    this.ref = this.dialogService.open(DonorForm, {
      header: 'עריכת תורם',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: donor
    });

    this.ref?.onClose.subscribe((result) => {
      console.log(result);

      if (result) {
        this.donorService.updateDonor(donor.id, result, result.company_picture).subscribe({
          next: (updateDonor) => {
            const index = this.donors.findIndex(d => d.id === donor.id);
            if (index !== -1) {
              this.donors[index] = updateDonor;
              this.donors = [...this.donors]; // גורם ל-Table של PrimeNG להתרענן
            }
            this.cdr.detectChanges();
            this.messageService.add({ severity: 'success', summary: 'עודכן', detail: 'פרטי התורם עודכנו בהצלחה' });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'העדכון נכשל' });
          }
        });
      }
    });
  }


  saveDonor() {
    if (this.donor.id) {
      this.donorService.updateDonor(this.donor.id, this.donor, this.donor.comany_picture).subscribe(() => {
        this.loadDonors();
        this.messageService.add({ severity: 'success', summary: 'עודכן', detail: 'פרטי התורם עודכנו' });
        this.donorDialog = false;
      });
    }
  }


  deleteDonor(donor: any) {
    this.confirmationService.confirm({
      message: `האם למחוק את ${donor.first_name}?`,
      header: 'אישור מחיקה',
      accept: () => {
        this.donorService.deleteDonor(donor.id).subscribe(() => {
          this.donors = this.donors.filter(d => d.id !== donor.id);
          this.messageService.add({ severity: 'success', summary: 'נמחק', detail: 'התורם הוסר' });
        });
      }
    });
  }
}



