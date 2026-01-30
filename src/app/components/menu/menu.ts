import { Component, HostListener, inject, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { icon } from '@primeuix/themes/aura/avatar';
import { RouterModule } from '@angular/router';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { AuthenticateService } from '../../services/authenticate-service';
import { CategoryDto } from '../../models/category.model';
import { CategoryService } from '../../services/category-service';

@Component({
    selector: 'app-menu', // וודאי שזה השם שבו את משתמשת
    standalone: true,    // אם את באנגולר חדש
    imports: [CommonModule, MenuModule, ButtonModule, InputTextModule, BadgeModule, AvatarModule, RouterModule, ButtonGroupModule, AsyncPipe],
    templateUrl: './menu.html', // וודאי שהנתיב כאן נכון
    styleUrls: ['./menu.scss']
})
export class Menu implements OnInit {

    readonly IMAGE_BASE_URL = 'https://localhost:7031/images/';
    categoryService = inject(CategoryService);
    authService = inject(AuthenticateService);
    user = JSON.parse(localStorage.getItem('user')!);
    showMenu = false;
    showUserDropdown = false;
    userMenuItems: MenuItem[] | undefined;
    isLoggedIn = false;


    categories: any[] = [];



    onLogout(event?: MouseEvent) {
        if (event) {
            this.showUserDropdown = false;
        }
        console.log('Logging out...');
        this.isLoggedIn = false;
        this.authService.logout();

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
            next: (data:any[]) => {
                this.categories = data;
                console.log('Categories loaded:', this.categories);
            },
            error: (err: any) => {
                console.error('Error loading categories:', err);
            }
        });
    }


}


