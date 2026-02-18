import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftService } from '../../../services/gift-service';
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
import { CookieService } from 'ngx-cookie-service';
import { GiftDetailsDialog } from '../gift-details-dialog/gift-details-dialog';

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
  private cookieService = inject(CookieService);
  user: string = this.cookieService.get('user') || '';
  role: string = '1';
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

    if (this.user && this.user !== 'undefined' && this.user !== '') {
      const parsedUser = JSON.parse(this.user);
      this.role = parsedUser.role !== undefined ? parsedUser.role.toString() : '1';
    }
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
      this.cdr.detectChanges();
      console.log('gifts', this.gifts);
    });
  }

  // addToCart(product: any) {
  //   if (!this.user || this.user === 'undefined' || this.user === '') {
  //     this.confirmationService.confirm({
  //       header: 'נדרשת התחברות',
  //       message: 'אופס, נראה שאתה לא מחובר. רוצה להתחבר או להירשם?',
  //       icon: 'pi pi-user',
  //       acceptLabel: "כן, אני רוצה להתחבר",
  //       rejectLabel: "לא, אני רוצה להמשיך להסתכל",
  //       accept: () => { this.router.navigate(['/login']) },
  //       reject: () => { this.router.navigate(['/gifts']); },
  //     });
  //     return;
  //   }

  //   const parsedUserData = JSON.parse(this.user);
  //   const userId = parsedUserData?.id;
  //   if (!userId) return;

  //   // שליפה לפי מזהה המשתמש (כדי להתאים לדף הסל)
  //   const cookieKey = userId.toString();
  //   const cookieData = this.cookieService.get(cookieKey) || '[]';
  //   let userPackages = (cookieData && cookieData !== 'undefined' && cookieData !== '') ? JSON.parse(cookieData) : [];

  //   if (userPackages.length === 0) {
  //     this.confirmationService.confirm({
  //       header: 'לא נבחרה חבילה',
  //       message: 'אופס, לא בחרת עדיין חבילה. רוצה להוסיף חבילה חדשה?',
  //       icon: 'pi pi-exclamation-triangle',
  //       acceptLabel: "אה! אני רוצה להוסיף חבילה",
  //       rejectLabel: "...לא:-) להמשיך להסתכל",
  //       accept: () => { this.router.navigate(['/']); },
  //       reject: () => { this.router.navigate(['/gifts']); }
  //     });
  //     return;
  //   }

  //   const existingPackage = userPackages.find((pack: any) => pack.emptyQuantity > 0);

  //   if (existingPackage) {
  //     // וידוא קיום מערך כרטיסים לפני הוספה
  //     if (!existingPackage.cards) {
  //       existingPackage.cards = [];
  //     }

  //     // הוספת המוצר
  //     existingPackage.cards.push(product);
  //     existingPackage.emptyQuantity -= 1;

  //     this.cookieService.set(cookieKey, JSON.stringify(userPackages), { path: '/' });    
  //     this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה נוספה לחבילה שלך' });
  //     this.cdr.detectChanges();
  //   } else {
  //     this.confirmationService.confirm({
  //       message: '?אופס, נגמרו לך הכרטיסים הריקים בחבילות שבחרת. רוצה להוסיף חבילה חדשה',
  //       header: 'הכרטיסים בחבילות אזלו',
  //       icon: 'pi pi-exclamation-triangle',
  //       acceptLabel: "אה! אני רוצה להוסיף חבילה",
  //       rejectLabel: "...לא:-) להמשיך להסתכל",
  //       accept: () => { this.router.navigate(['/']); },
  //       reject: () => { this.router.navigate(['/gifts']); }
  //     });
  //   }
  // }

addToCart(product: any) {
  if (!this.user || this.user === 'undefined' || this.user === '') {
    this.confirmationService.confirm({
      header: 'נדרשת התחברות',
      message: 'אופס, נראה שאתה לא מחובר. רוצה להתחבר או להירשם?',
      icon: 'pi pi-user',
      acceptLabel: "כן, אני רוצה להתחבר",
      rejectLabel: "לא, אני רוצה להמשיך להסתכל",
      accept: () => { this.router.navigate(['/login']) },
      reject: () => { this.router.navigate(['/gifts']); },
    });
    return;
  }

  const parsedUserData = JSON.parse(this.user);
  const userId = parsedUserData?.id;
  if (!userId) return;

  const cookieKey = userId.toString();
  const cookieData = this.cookieService.get(cookieKey) || '[]';
  let userPackages = (cookieData && cookieData !== 'undefined' && cookieData !== '') ? JSON.parse(cookieData) : [];

  if (userPackages.length === 0) {
    this.confirmationService.confirm({
      header: 'לא נבחרה חבילה',
      message: 'אופס, לא בחרת עדיין חבילה. רוצה להוסיף חבילה חדשה?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "אה! אני רוצה להוסיף חבילה",
      rejectLabel: "...לא:-) להמשיך להסתכל",
      accept: () => { this.router.navigate(['/']); },
      reject: () => { this.router.navigate(['/gifts']); }
    });
    return;
  }

  const existingPackage = userPackages.find((pack: any) => Number(pack.emptyQuantity) > 0);

  if (existingPackage) {
    if (!existingPackage.cards) {
      existingPackage.cards = [];
    }

    existingPackage.cards.push(product);
    existingPackage.emptyQuantity = Number(existingPackage.emptyQuantity) - 1;

    this.cookieService.set(cookieKey, JSON.stringify(userPackages), { path: '/' });
    
    this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה נוספה לחבילה שלך' });
    this.cdr.detectChanges();
  } else {
    this.confirmationService.confirm({
      message: '?אופס, נגמרו לך הכרטיסים הריקים בחבילות שבחרת. רוצה להוסיף חבילה חדשה',
      header: 'הכרטיסים בחבילות אזלו',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "אה! אני רוצה להוסיף חבילה",
      rejectLabel: "...לא:-) להמשיך להסתכל",
      accept: () => { this.router.navigate(['/']); },
      reject: () => { this.router.navigate(['/gifts']); }
    });
  }
}
  showGiftChild() {
    this.ref = this.dialogService.open(GiftForm, {
      width: '450px',
      showHeader: false,
      styleClass: 'premium-dialog',
      contentStyle: {
        'max-height': '90vh',
        'overflow-y': 'auto',
        'padding': '0',
        'background': '#1a162e',
      },
      baseZIndex: 10000,
    });

    this.ref?.onClose.subscribe((result) => {
      if (result) {
        this.giftService.addGift(result, result.picture).subscribe({
          next: (newGift) => {
            this.gifts = [...this.gifts, newGift];
            this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה נוספה למערכת' });
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: err.error });
          }
        });
      }
    });
  }

  showDetails(product: any) {
    this.dialogService.open(GiftDetailsDialog, {
      showHeader: false,
      width: '900px',
      style: { 'max-width': '95vw', 'border-radius': '10px' },
      contentStyle: {
        'max-height': '90vh',
        'overflow-y': 'auto',
        'padding': '0',
        'background': '#1a162e',
      },
      styleClass: 'premium-dialog',
      data: { gift: product, donor: product.donor },
      baseZIndex: 10000,
    });
  }
}