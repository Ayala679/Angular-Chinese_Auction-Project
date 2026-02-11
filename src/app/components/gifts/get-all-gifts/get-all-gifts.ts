import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftService } from '../../../services/gift-service';
import { ChangeDetectorRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GiftForm } from '../gift-form/gift-form';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-get-all-gifts',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule],
  providers: [GiftService, MessageService, DialogService],
  templateUrl: './get-all-gifts.html',
  styleUrl: './get-all-gifts.scss',
})
export class GetAllGifts implements OnInit {
  gifts: any[] = [];
  products: any[] = [];
  giftService = inject(GiftService);
  cdr = inject(ChangeDetectorRef);
  readonly IMAGE_BASE_URL = 'https://localhost:7031/images/gifts/';
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);
  dialogService = inject(DialogService);
  ref: DynamicDialogRef | null = null;
  ngOnInit() {
    this.route.params.subscribe(params => {
      const categoryId = params['categoryId'];
      if (categoryId) {
        this.loadGiftsByCategory(categoryId);
      } else {
        this.loadGifts();
      }
    });
  }

  loadGiftsByCategory(categoryId: number) {
    this.giftService.GetGiftsByCategory(categoryId).subscribe(data => {
      this.gifts = data;
      this.cdr.detectChanges();
    });
  }


  loadGifts() {
    this.giftService.getGifts().subscribe(data => {
      this.gifts = data;
      this.cdr.detectChanges()
      console.log(this.gifts);

    });
  }
  // פונקציית הוספה לסל
  addToCart(product: any) {

  }


  // פונקציית מעבר לדף פרטים
  showDetails(product: any) {
    console.log('מעבר לפרטי המוצר:', product.id);
    // כאן תוכלי להשתמש ב-Router כדי לנווט לדף המוצר
  }

  showGiftChild() {
    this.ref = this.dialogService.open(GiftForm, {
      header: 'הוספת מתנה חדשה',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
    this.ref?.onClose.subscribe((result) => {
      if (result) {
        console.log(result);

        this.giftService.addGift(result, result.picture).subscribe({
          next: (newGift) => {
            this.gifts.push(newGift);
            this.gifts = [...this.gifts];
            this.cdr.detectChanges();

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

}














