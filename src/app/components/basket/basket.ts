import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouterModule } from '@angular/router';
import { PackageService } from '../../services/package-service';

@Component({
  selector: 'app-basket',
  imports: [ButtonModule, DataViewModule, TagModule, CommonModule, ToastModule, ConfirmDialogModule, RouterModule],
  standalone: true,
  providers: [Router, PackageService],
  templateUrl: './basket.html',
  styleUrl: './basket.scss',
})
export class Basket {

  user = localStorage.getItem('user') || '';
  packages: any[] = [];
  allCards: any[] = [];
  uniquePackages: any[] = [];
  // allCards = this.packages.flatMap((item: any) => item.cards);
  IMAGE_BASE_URL = 'https://localhost:7031/images/gifts/';
  DONOR_BASE_URL = 'https://localhost:7031/images/companies/';
  private confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.createNewList();

  }

  createNewList() {
    this.packages = JSON.parse(localStorage.getItem(JSON.parse(this.user).id) || '[]');
    const cards = this.packages.flatMap((item: any) => item.cards);
    const combined = cards.reduce((acc: any[], current: any) => {
      const existing = acc.find(item => Number(item.id) === Number(current.id));
      if (existing) {
        existing.user_count += 1;
      }
      else {
        acc.push({ ...current, user_count: 1 });
      }
      return acc;
    }, []);
    this.allCards = [...combined];

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
    console.log('packagesUser: ', this.packages);
    console.log('cards:', this.allCards);

  }
  removeFromBasket(id: number) {
    let user = JSON.parse(this.user);
    const userId = user.id;
    let userPackages = JSON.parse(localStorage.getItem(userId) || '[]');
    const packageWithCard = [...userPackages].reverse().find((pack: any) =>
      pack.cards.some((card: any) => Number(card.id) === Number(id))
    );

    if (packageWithCard) {
      const cardIndex = packageWithCard.cards.findIndex((card: any) => Number(card.id) === Number(id));
      if (cardIndex !== -1) {
        packageWithCard.cards.splice(cardIndex, 1);
        packageWithCard.emptyQuantity += 1;
        localStorage.setItem(userId, JSON.stringify(userPackages));
        this.createNewList();
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
        accept: () => {
          this.router.navigate(['/login'])
        },
        reject: () => {
          this.router.navigate(['/basket']);
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
          this.router.navigate(['/basket']);
        }
      });
      return;
    }
    const existingPackage = userPackages.find((pack: any) => pack.emptyQuantity > 0);
    if (existingPackage) {
      const { user_count, ...cleanProduct } = product;
      existingPackage.cards.push(cleanProduct);
      existingPackage.emptyQuantity -= 1;
      this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה נוספה לחבילה שלך' });
      localStorage.setItem(userId, JSON.stringify(userPackages));
      this.createNewList();
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
          this.router.navigate(['/basket']);
        }
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



}
