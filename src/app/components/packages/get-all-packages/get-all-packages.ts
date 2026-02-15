import { MessageService } from 'primeng/api';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PackageService } from '../../../services/package-service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { PackageForm } from '../package-form/package-form';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-get-all-packages',
  standalone: true,
  imports: [ButtonModule, CardModule, AsyncPipe, DynamicDialogModule, ToastModule, CommonModule, RouterModule],
  templateUrl: './get-all-packages.html',
  styleUrl: './get-all-packages.scss',
})
export class GetAllPackages {
  messageService = inject(MessageService);
  dialogService = inject(DialogService);
  packageService = inject(PackageService);
  private cookieService = inject(CookieService);
  packages$: any = this.packageService.getpackages().pipe(
  map((packages: any[]) => {
    return packages.map(pkg => {
      const count = this.userPackages.filter(up => up.id === pkg.id.toString()).length;
      return { ...pkg, quantity: count };
    });
  })
);
  ref: DynamicDialogRef<any> | null = null;
  user: string = this.cookieService.get('user') || '';
  role: string = this.user && this.user !== 'undefined' && this.user !== '' ? JSON.parse(this.user).role || '' : '';
  isChildVisible: boolean = false;
  userPackages: any[] = (() => {
    if (!this.user || this.user === 'undefined' || this.user === '') return [];
    const parsedUser = JSON.parse(this.user);
    const userId = parsedUser?.id;
    if (!userId) return [];
    const cookieData = this.cookieService.get(userId) || '[]';
    return (cookieData && cookieData !== 'undefined' && cookieData !== '') ? JSON.parse(cookieData) : [];
  })();
  showChild() {
    this.ref = this.dialogService.open(PackageForm, {
      header: 'הוספת חבילה חדשה',
      width: '30%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });

    this.ref?.onClose.subscribe((result) => {
      if (result) {
        this.packageService.addpackage(result).subscribe({
          next: () => {
            this.packages$ = this.packageService.getpackages();

            this.messageService.add({
              severity: 'success',
              summary: 'הצלחה',
              detail: 'החבילה נוספה בהצלחה',
              life: 3000
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'שגיאה',
              detail: error.error || 'אירעה שגיאה בשמירת החבילה',
              life: 3000
            });
          }
        });
      }
    });
  }

  addPackage(packageData: any) {
    packageData.quantity = (packageData.quantity || 0) + 1
    this.userPackages.push({ id: packageData.id.toString(),packageName:packageData.name, price: packageData.price, cards_quantity: packageData.cards_quantity , emptyQuantity: packageData.cards_quantity, cards: [] });
    if (!this.user || this.user === 'undefined' || this.user === '') return;
    const parsedUser = JSON.parse(this.user);
    const u = parsedUser?.id;
    if (u) {
      this.cookieService.set(u, JSON.stringify(this.userPackages));
    }
  }

  removePackage(packageData: any) {
    
    packageData.quantity = (packageData.quantity || 0) > 0 ? packageData.quantity - 1 : 0
    let flag = false;
    this.userPackages = this.userPackages.reverse().filter((pkg: any) => {
      if (pkg.id === packageData.id.toString() && !flag) {
        if(pkg.emptyQuantity < packageData.cards_quantity) {
          //dialog???
          this.messageService.add({
            severity: 'warn',
            summary: 'הסרת חבילה',
            detail: 'החבילה שהסרת מכילה כרטיסים, כל הכרטיסים הוסרו יחד עם החבילה',
            life: 3000
          });
        }
        flag = true;
      }
      else {
        return pkg;
      }
    }).reverse();
    if (!this.user || this.user === 'undefined' || this.user === '') return;
    const parsedUser = JSON.parse(this.user);
    const userId = parsedUser?.id;
    if (userId) {
      this.cookieService.set(userId, JSON.stringify(this.userPackages));
    }
  }

  onEditPackage(id: any) { }
  onDeletePackage(id: any) { }
}







