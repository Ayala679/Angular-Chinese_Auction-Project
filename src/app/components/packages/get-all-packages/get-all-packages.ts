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

@Component({
  selector: 'app-get-all-packages',
  standalone: true,
  imports: [ButtonModule, CardModule, AsyncPipe, DynamicDialogModule, ToastModule, CommonModule],
  providers: [DialogService, MessageService],
  templateUrl: './get-all-packages.html',
  styleUrl: './get-all-packages.scss',
})
export class GetAllPackages {
  messageService = inject(MessageService);
  dialogService = inject(DialogService);
  packageService = inject(PackageService);
  packages$: any = this.packageService.getpackages().pipe(
  map((packages: any[]) => {
    return packages.map(pkg => {
      const count = this.userPackages.filter(up => up.id === pkg.id.toString()).length;
      return { ...pkg, quantity: count };
    });
  })
);
  ref: DynamicDialogRef<any> | null = null;
  user: string = localStorage.getItem('user') || '';
  role: string = this.user ? JSON.parse(this.user).role : '';
  isChildVisible: boolean = false;
  userPackages: any[] = JSON.parse(localStorage.getItem('userPackages') || '[]');
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
    this.userPackages.push({ id: packageData.id.toString(), emptyQuantity: 0, cards: [] });
    localStorage.setItem('userPackages', JSON.stringify(this.userPackages));
  }

  removePackage(packageData: any) {
    
    packageData.quantity = (packageData.quantity || 0) > 0 ? packageData.quantity - 1 : 0
    let flag = false;
    this.userPackages = this.userPackages.filter((pkg: any) => {
      if (pkg.id === packageData.id.toString() && !flag) {
        flag = true;
      }
      else {
        return pkg;
      }
    });
    localStorage.setItem('userPackages', JSON.stringify(this.userPackages));
  }

  onEditPackage(id: any) { }
  onDeletePackage(id: any) { }
}







