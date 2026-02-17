import { ChangeDetectorRef, Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Toast, ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouterModule } from '@angular/router';
import { PackageService } from '../../services/package-service';
import { CookieService } from 'ngx-cookie-service';
import { PurchaseService } from '../../services/purchase-service';
import { forkJoin } from 'rxjs';
import { GiftService } from '../../services/gift-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreatePurchase } from '../../models/purchase.model';
@Component({
  selector: 'app-basket',
  imports: [ButtonModule, Toast, DataViewModule, TagModule, CommonModule, ToastModule, ConfirmDialogModule, RouterModule],
  standalone: true,
  providers: [PackageService],
  templateUrl: './basket.html',
  styleUrl: './basket.scss',
})
export class Basket {

  user: string = '';
  userId: number = 0;
  packages: any[] = [];
  allCards: any[] = [];
  uniquePackages: any[] = [];
  private destroyRef = inject(DestroyRef);
  IMAGE_BASE_URL = 'https://localhost:7031/images/gifts/';
  DONOR_BASE_URL = 'https://localhost:7031/images/companies/';
  private confirmationService = inject(ConfirmationService);
  private purchaseService = inject(PurchaseService);
  messageService = inject(MessageService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  private cookieService = inject(CookieService);
  cookieData = this.cookieService.get('user') || '[]';
  giftService = inject(GiftService);
  numOfCards: number = 0;
  sellCards: number = 0;

  ngOnInit() {
    this.user = this.cookieService.get('user') || '';
    const parsedUser = this.user && this.user !== 'undefined' && this.user !== '' ? JSON.parse(this.user) : {};
    const userId = parsedUser?.id;
    const cookieData = userId ? this.cookieService.get(userId) || '[]' : '[]';
    this.packages = (cookieData && cookieData !== 'undefined' && cookieData !== '') ? JSON.parse(cookieData) : [];

    this.loadGifts()
  }

  loadGifts() {

    this.sellCards = 0;
    this.numOfCards = 0;
    for (let pack of this.packages) {
      this.sellCards = this.sellCards + pack.emptyQuantity + (pack.cards ? pack.cards.length : 0);
    }

    const parsedUser = this.user && this.user !== 'undefined' && this.user !== '' ? JSON.parse(this.user) : {};
    const userId = parsedUser?.id;
    this.cookieData = userId ? this.cookieService.get(userId) || '[]' : '[]';

    this.packages = (this.cookieData && this.cookieData !== 'undefined' && this.cookieData !== '') ? JSON.parse(this.cookieData) : [];

    const quantityMap: { [id: string]: number } = {};
    this.packages.flatMap((pkg: any) => pkg.cards).forEach((card: any) => {
      this.numOfCards++; // מונה את הכרטיסים שבתוך החבילות
      const id = card.id.toString();
      quantityMap[id] = (quantityMap[id] || 0) + 1;
    });

    const uniqueIds = Object.keys(quantityMap);

    if (uniqueIds.length === 0) {
      this.allCards = [];
    } else {
      const requests = uniqueIds.map(id => this.giftService.getGiftById(Number(id)));

      forkJoin(requests)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (gifts: any[]) => {
            this.allCards = gifts
              .filter(g => g !== null)
              .map(gift => ({
                ...gift,
                user_count: quantityMap[gift.id?.toString()]
              }));
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Error fetching gifts:', err)
        });
    }

    this.uniquePackages = this.packages.reduce((acc: any[], current: any) => {
      const existing = acc.find(p => p.id === current.id);
      if (existing) {
        existing.package_count += 1;
      } else {
        acc.push({ ...current, package_count: 1 });
      }
      return acc;
    }, []);

    this.cdr.detectChanges();
  }

  removeFromBasket(id: number) {
    const parsedUser = this.user && this.user !== 'undefined' && this.user !== '' ? JSON.parse(this.user) : {};
    const userId = parsedUser?.id;
    if (!userId) return;
    const cookieData = this.cookieService.get(userId) || '[]';
    let userPackages = (cookieData && cookieData !== 'undefined' && cookieData !== '') ? JSON.parse(cookieData) : [];
    const packageWithCard = [...userPackages].reverse().find((pack: any) =>
      pack.cards.some((card: any) => Number(card.id) === Number(id))
    );

    if (packageWithCard) {
      const cardIndex = packageWithCard.cards.findIndex((card: any) => Number(card.id) === Number(id));
      if (cardIndex !== -1) {
        packageWithCard.cards.splice(cardIndex, 1);
        packageWithCard.emptyQuantity += 1;
        this.cookieService.set(userId, JSON.stringify(userPackages), { path: '/' });
        this.loadGifts();
        this.messageService.add({ severity: 'warn', summary: 'הצלחה', detail: 'המתנה הוסרה מהחבילה שלך' });
      }
    }
  }

  addToBasket(product: any) {
    if (!this.user) {
      this.confirmationService.confirm({
        header: 'נדרשת התחברות',
        message: 'אופס, נראה שאתה לא מחובר. רוצה להתחבר או להירשם?',
        icon: 'pi pi-user',
        acceptLabel: "כן, אני רוצה להתחבר",
        rejectLabel: "לא, אני רוצה להמשיך להסתכל",
        accept: () => { this.router.navigate(['/login']) },
        reject: () => { this.router.navigate(['/basket']); },
      });
      return;
    }

    // עדכון ה-user מהקוקי כל פעם
    this.user = this.cookieService.get('user') || '';
    const parsedUserData = this.user && this.user !== 'undefined' && this.user !== '' ? JSON.parse(this.user) : {};
    const userId = parsedUserData?.id;
    if (!userId) return;

    // טעינה טרייה של החבילות מהקוקי
    const cookieData = this.cookieService.get(userId) || '[]';
    let userPackages = (cookieData && cookieData !== 'undefined' && cookieData !== '') ? JSON.parse(cookieData) : [];

    if (userPackages.length === 0) {
      this.confirmationService.confirm({
        header: 'לא נבחרה חבילה',
        message: 'אופס, לא בחרת עדיין חבילה. רוצה להוסיף חבילה חדשה?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "אה! אני רוצה להוסיף חבילה",
        rejectLabel: "...לא:-) להמשיך להסתכל",
        accept: () => { this.router.navigate(['/']); },
        reject: () => { this.router.navigate(['/basket']); }
      });
      return;
    }

    const existingPackage = userPackages.find((pack: any) => pack.emptyQuantity > 0);

    if (existingPackage && product) {
      // יצירת אובייקט מינימלי למניעת שגיאות ב-Cookie
      const cardToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        picture: product.picture
      };

      existingPackage.cards.push(cardToAdd);
      existingPackage.emptyQuantity -= 1;

      // שמירה ועדכון
      this.cookieService.set(userId, JSON.stringify(userPackages), { path: '/' });

      // רענון קריטי של משתני המחלקה לפני קריאה ל-loadGifts
      this.packages = userPackages;
      this.loadGifts();

      this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה נוספה לחבילה שלך' });
    } else {
      this.confirmationService.confirm({
        message: 'אופס, נגמרו לך הכרטיסים הריקים בחבילות שבחרת. רוצה להוסיף חבילה חדשה?',
        header: 'הכרטיסים בחבילות אזלו',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "אה! אני רוצה להוסיף חבילה",
        rejectLabel: "...לא:-) להמשיך להסתכל",
        accept: () => { this.router.navigate(['/']); },
        reject: () => { this.router.navigate(['/basket']); }
      });
    }
  }
  totalPrice(): number {
    let total = 0;
    this.packages.forEach((pack: any) => {
      total += Number(pack.price);
    });
    return total
  }
  payment() {
    let CardsList: CreatePurchase[] = [];
    this.confirmationService.confirm({
      header: 'אישור תשלום',
      message: 'האם אתה בטוח שברצונך לבצע את התשלום?',
      icon: 'pi pi-credit-card',
      acceptLabel: "כן, אני רוצה לשלם",
      rejectLabel: "לא, אני רוצה להמשיך להסתכל",
      accept: () => {
        // כאן תוכל להוסיף את הלוגיקה לביצוע התשלום בפועל, למשל קריאה ל-API של התשלום
        this.packages.forEach((pack: any) => {
          CardsList = pack.cards.map((card: any) => {
            return { giftId: card.id, userId: JSON.parse(this.user).id, packageId: pack.id } as CreatePurchase;
          })
          this.purchaseService.addPurchase(CardsList).subscribe({
            next: () => {

              this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'התשלום בוצע בהצלחה!' });
              this.cookieService.delete(this.user ? JSON.parse(this.user).id : '');
              this.confirmationService.confirm({
                header: 'רוצה להמשיך לקניות?',
                message: 'התשלום בוצע בהצלחה! האם ברצונך להמשיך לקניות?',
                icon: 'pi pi-check',
                acceptLabel: "כן, אני רוצה להמשיך לקניות",
                rejectLabel: "לא, אני רוצה להסתכל על המתנות שלי",
                accept: () => {
                  this.router.navigate(['/']);
                },
                reject: () => {
                  this.router.navigate(['/my-gifts']);
                },
              });
              // this.loadGifts(); 
            },
            error: (err) => {
              this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'אירעה שגיאה בתהליך התשלום. אנא נסה שוב.' });
              console.error('Error processing payment:', err);
            }
          });
          console.log(CardsList);

        });

        // this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'התשלום בוצע בהצלחה!' });
        // this.cookieService.deleteAll({ path: '/' });
        // this.loadGifts(); // רענון המוצרים לאחר התשלום
      },
      reject: () => { this.router.navigate(['/basket']); }
    });
  }

  // showDetails(product: any) {
  //   this.confirmationService.confirm({
  //     header: 'מעבר לפרטי המוצר',
  //     message: 'האם אתה רוצה לעבור לדף פרטי המוצר?',
  //     icon: 'pi pi-info-circle',
  //     acceptLabel: "כן, אני רוצה לראות את הפרטים",
  //     rejectLabel: "לא, אני רוצה להמשיך להסתכל",
  //     accept: () => {
  //       this.router.navigate(['/payment']);
  //     },
  //     reject: () => { this.router.navigate(['/basket']); },
  //   });
  // }
}