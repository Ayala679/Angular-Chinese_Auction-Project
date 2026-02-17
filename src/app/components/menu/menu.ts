import { ChangeDetectorRef, Component, HostListener, inject, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { map, catchError } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { AuthenticateService } from '../../services/authenticate-service';
import { CategoryService } from '../../services/category-service';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { GiftService } from '../../services/gift-service';
import { PurchaseService } from '../../services/purchase-service';
import { forkJoin, of } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { finalize } from 'rxjs/operators';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, DialogModule, ProgressSpinnerModule, MenuModule, ButtonModule, ConfirmDialogModule, InputTextModule, BadgeModule, AvatarModule, RouterModule, ButtonGroupModule, AsyncPipe, InputIconModule, IconFieldModule, FloatLabelModule],
    templateUrl: './menu.html',
    styleUrls: ['./menu.scss']
})
export class Menu implements OnInit {

    readonly IMAGE_BASE_URL = 'https://localhost:7031/images/categories/';
    categoryService = inject(CategoryService);
    private confirmationService = inject(ConfirmationService);

    authService = inject(AuthenticateService);
    private cookieService = inject(CookieService);
    user$ = this.authService.user$;
    showMenu = false;
    showUserDropdown = false;
    userMenuItems: MenuItem[] | undefined;
    isLoggedIn = false;
    giftService = inject(GiftService);
    sidebarVisible: boolean = false;
    searchValue: string = '';
    private purchaseService = inject(PurchaseService);
    categories: any[] = [];
    router = inject(Router);
    gifts: any[] = [];
    messageService = inject(MessageService);
    private cdr = inject(ChangeDetectorRef); // מוסיף זיהוי שינויים ידני ליתר ביטחון

    displayConfirmLottery = false;
    displayLotteryResults = false;
    isLoading = false;

    lotteryResults: {
        name: string,
        status: string,
        message: string,
        severity: string,
        winner?: string | null,
        icon?: string
    }[] = [];

    onLogout(event?: MouseEvent) {
        if (event) {
            this.showUserDropdown = false;
        }
        console.log('Logging out...');
        this.authService.logout();
        this.isLoggedIn = false;
        window.location.reload();
    }

    @HostListener('document:click', ['$event'])
    mouthout(event: any) {
        if (!event.target.closest('.user-wrapper')) {
            this.showUserDropdown = false;
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        this.showMenu = false;
    }

    ngOnInit() {
        this.userMenuItems = [
            { label: 'הגדרות חשבון', icon: 'pi pi-user-edit' },
            { label: 'התנתקות (Logout)', icon: 'pi pi-sign-out', command: () => this.onLogout() }
        ];

        this.categoryService.getCategories().subscribe({
            next: (data: any[]) => {
                this.categories = data;
                console.log('Categories loaded:', this.categories);
            },
            error: (err: any) => {
                console.error('Error loading categories:', err);
            }
        });
    }

    navigateToGifts(categoryId: number) {
        this.router.navigate(['/gifts', categoryId]);
    }


    lottery() {
        this.displayConfirmLottery = true;
    }

    runLottery() {
        this.displayConfirmLottery = false;
        this.isLoading = true;

        this.giftService.getGifts().subscribe({
            next: (data: any[]) => {
                const requests = data.map(gift =>
                    this.purchaseService.runLottery(gift.id).pipe(
                        map((res: any) => ({
                            name: gift.name,
                            status: 'הושלם',
                            winner: res?.firstName || 'נבחר זוכה',
                            message: 'הגרלה הושלמה',
                            severity: 'text-green-500',
                            icon: 'pi pi-check-circle'
                        })),
                        catchError(err => of({
                            name: gift.name,
                            status: 'נכשל',
                            winner: null,
                            message: err.error?.message || 'אין משתתפים',
                            severity: 'text-red-500',
                            icon: 'pi pi-times-circle'
                        }))
                    )
                );
                forkJoin(requests).pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })

                ).subscribe((results: any[]) => {
                    this.lotteryResults = results;
                    this.isLoading = false;

                    setTimeout(() => {
                        this.displayLotteryResults = true;
                        this.cdr.detectChanges();
                    }, 200);
                });
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }
}