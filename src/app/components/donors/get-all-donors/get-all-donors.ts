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
import { RadioButtonModule } from 'primeng/radiobutton';
import { GiftForm } from '../../gifts/gift-form/gift-form';
import { GiftService } from '../../../services/gift-service';

@Component({
  selector: 'app-get-all-donors',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, ToastModule,
    ToolbarModule, DialogModule, ConfirmDialogModule, InputTextModule,
    TagModule, DynamicDialogModule, RadioButtonModule
  ],
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
  filterText: string = '';
  filterType: string = 'name'; // 'name', 'email', or 'gift'
  isFilterOpen: boolean = false; // Track if filter panel is visible
  donor: any = {};
  donorDialog: boolean = false; // עבור עריכה
  ref: DynamicDialogRef | null = null; // עבור הדיאלוג הדינמי שלכן
  private cdr = inject(ChangeDetectorRef)
  readonly IMAGE_BASE_URL = 'https://localhost:7031/images/companies/';
  readonly IMAGE_BASE_URL_GIFT = 'https://localhost:7031/images/gifts/';


  ngOnInit() {

    this.loadDonors();

  }

  filteredDonorsList: any[] = [];

  toggleFilterPanel() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  closeFilterPanel() {
    this.isFilterOpen = false;
  }

  setFilterType(type: string) {
    this.filterType = type;
  }

  onFilterChange() {
    const q = (this.filterText || '').trim();
    if (!q) {
      this.filteredDonorsList = this.donors;
      this.cdr.detectChanges();
      return;
    }
    // Send query to the selected filter type parameter only
    let name: string | undefined;
    let email: string | undefined;
    let giftName: string | undefined;

    if (this.filterType === 'name') {
      name = q;
    } else if (this.filterType === 'email') {
      email = q;
    } else if (this.filterType === 'gift') {
      giftName = q;
    }

    this.donorService.getFilteredDonors(name, email, giftName).subscribe({
      next: (data) => {
        this.filteredDonorsList = data as any[];
        console.log('filter results:', this.filteredDonorsList);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('filter error', err);
        // Fallback to client-side filtering
        this.filteredDonorsList = this.localFilter(q);
        this.cdr.detectChanges();
      }
    });
  }

  clearFilter() {
    this.filterText = '';
    this.onFilterChange();
  }

  localFilter(q: string) {
    const lower = q.toLowerCase();
    return this.donors.filter(d => {
      if (this.filterType === 'name') {
        const first = (d.first_name || '').toString().toLowerCase();
        const last = (d.last_name || '').toString().toLowerCase();
        return first.includes(lower) || last.includes(lower);
      } else if (this.filterType === 'email') {
        const email = (d.email || '').toString().toLowerCase();
        return email.includes(lower);
      } else if (this.filterType === 'gift') {
        const gifts = (d.gifts || []).some((g: any) => ((g.name || '') + ' ' + (g.description || '')).toString().toLowerCase().includes(lower));
        return gifts;
      }
      return false;
    });
  }


  loadDonors() {
    this.donorService.getDonors().subscribe(data => {
      this.donors = data;
      this.filteredDonorsList = data;
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
    console.log('donor: ', this.donors);

  }

  onRowCollapse(event: TableRowCollapseEvent) {
    this.messageService.add({
      severity: 'success',
      summary: 'Product Collapsed',
      detail: event.data.name,
      life: 3000
    });
  }

  customSort(event: any) {
    event.data.sort((data1: any, data2: any) => {
      let value1, value2
      let result = null;
      value1 = data1[event.field];
      value2 = data2[event.field];
      
      if (typeof value1 === 'string') value1 = value1.toLowerCase();
      if (typeof value2 === 'string') value2 = value2.toLowerCase();

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
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
            this.filteredDonorsList = [...this.donors];
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
            this.loadDonors(); // Reload the full list
            this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה נוספה בהצלחה' });
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
            this.loadDonors(); // Reload the full list
            this.messageService.add({ severity: 'success', summary: 'עודכן', detail: 'המתנה עודכנה בהצלחה' });
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
              this.filteredDonorsList = [...this.donors];
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
          this.filteredDonorsList = [...this.donors];
          this.messageService.add({ severity: 'success', summary: 'נמחק', detail: 'התורם הוסר' });
        });
      }
    });
  }
}



