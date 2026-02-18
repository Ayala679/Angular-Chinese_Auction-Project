import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { PurchaseService } from '../../../services/purchase-service';
import { GetPurchase } from '../../../models/purchase.model';
import { UserService } from '../../../services/user-service';
import { GiftService } from '../../../services/gift-service';
import { PackageService } from '../../../services/package-service';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    TagModule
  ],
  templateUrl: './purchase-list.html',
  styleUrls: ['./purchase-list.scss'],
  providers: [MessageService]
})
export class PurchaseListComponent implements OnInit {
  private purchaseService = inject(PurchaseService);
  private messageService = inject(MessageService);
  private userService = inject(UserService);
  private giftService = inject(GiftService);
  private packageService = inject(PackageService);

  purchases: GetPurchase[] = [];
  isLoading: boolean = false;
  // enriched rows for display (model now includes nested objects)
  purchaseRows: Array<{ purchase: GetPurchase; user?: any; gift?: any; package?: any }> = [];

  ngOnInit() {
    this.loadPurchases();
  }

  loadPurchases() {
    this.isLoading = true;
    console.log('PurchaseList: authToken=', localStorage.getItem('authToken'));
    this.purchaseService.getAllPurchases().pipe(
      switchMap((data: GetPurchase[]) => {
        this.purchases = data || [];
        if (!data || data.length === 0) return of([]);
        const requests = data.map(p => {
          const user$ = (p.userId !== null && p.userId !== undefined)
            ? this.userService.getUserById(String(p.userId)).pipe(catchError(() => of(null)))
            : of(null);
          const gift$ = (p.giftId !== null && p.giftId !== undefined)
            ? this.giftService.getGiftById(p.giftId).pipe(catchError(() => of(null)))
            : of(null);
          const package$ = (p.packageId !== null && p.packageId !== undefined)
            ? this.packageService.getpackageById(p.packageId).pipe(catchError(() => of(null)))
            : of(null);

          return forkJoin({ user: user$, gift: gift$, package: package$ })
            .pipe(map(rel => ({ purchase: p, user: rel.user, gift: rel.gift, package: rel.package })));
        });
        return forkJoin(requests);
      })
    ).subscribe({
      next: (rows: any[]) => {
        this.purchaseRows = rows;
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: `נטענו ${this.purchaseRows.length} רשומות`, life: 1500 });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading purchases:', err, 'status:', err?.status, 'message:', err?.message || err?.error);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: `אירעה שגיאה בטעינת הרכישות (status: ${err?.status})`, life: 5000 });
      }
    });
  }

  getWinStatus(isWon: boolean): string {
    return isWon ? 'זוכה' : 'לא זוכה';
  }

  getWinSeverity(isWon: boolean): 'success' | 'warn' {
    return isWon ? 'success' : 'warn';
  }
}
