import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftService } from '../../../services/gift-service';
import { ChangeDetectorRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ActivatedRoute, Router } from '@angular/router';
import { GiftForm } from '../gift-form/gift-form';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-get-all-gifts',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule, DialogModule, InputTextModule, ConfirmDialogModule, ToastModule, RouterModule],
  providers: [GiftService],
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
  private confirmationService = inject(ConfirmationService);
  user: string = localStorage.getItem('user') || '';
  router = inject(Router);

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
    });

  }
  // פונקציית הוספה לסל
  addToCart(product: any) {
    // 1. בדיקה אם המשתמש מחובר
    if (!this.user) {
      this.confirmationService.confirm({
        header: 'נדרשת התחברות',
        message: 'אופס, נראה שאתה לא מחובר. רוצה להתחבר או להירשם?',
        icon: 'pi pi-user',
        acceptLabel: "כן, אני רוצה להתחבר",
        rejectLabel: "לא, אני רוצה להמשיך להסתכל",
        accept: () => {
          this.router.navigate(['/login'])
        },
        reject: () => {
          this.router.navigate(['/gifts']);
        },

      });
      return;
    }

    // 2. חילוץ ה-ID בבטחה
    const userData = JSON.parse(this.user);
    const userId = userData.id;

    // 3. טעינת החבילות של המשתמש הספציפי
    let userPackages = JSON.parse(localStorage.getItem(userId) || '[]');

    if (userPackages.length === 0) {
      this.confirmationService.confirm({
        header: 'לא נבחרה חבילה',
        message: 'אופס, לא בחרת עדיין חבילה. רוצה להוסיף חבילה חדשה?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "אה! אני רוצה להוסיף חבילה",
        rejectLabel: "...לא:-) להמשיך להסתכל",
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.router.navigate(['/']);
        },
        reject: () => {
          this.router.navigate(['/gifts']);
        }
      });
      return;
    }
    const existingPackage = userPackages.find((pack: any) => pack.emptyQuantity > 0);
    if (existingPackage) {
      existingPackage.cards.push(product);
      existingPackage.emptyQuantity -= 1;
      this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה נוספה לחבילה שלך' });
      localStorage.setItem(userId, JSON.stringify(userPackages));
    }
    else {
      this.confirmationService.confirm({
        message: '?אופס, נגמרו לך הכרטיסים הריקים בחבילות שבחרת. רוצה להוסיף חבילה חדשה',
        header: 'הכרטיסים בחבילות אזלו',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "אה! אני רוצה להוסיף חבילה",
        rejectLabel: "...לא:-) להמשיך להסתכל",
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.router.navigate(['/']);
        },
        reject: () => {
          this.router.navigate(['/gifts']);
        }
      });
    }

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
    console.log('gifts: ', this.gifts);

  }

}














