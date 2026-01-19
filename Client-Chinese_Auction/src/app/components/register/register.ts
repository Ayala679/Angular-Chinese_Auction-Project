import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  // onRegister() {
  // // 1. קריאה לפונקציה שמחזירה Observable
  // this.userService.register(
  //   this.email, 
  //   this.password, 
  //   this.firstName, 
  //   this.lastName, 
  //   this.phone
  // ).subscribe({
  //   // 2. טיפול במקרה של הצלחה
  //   next: (data) => {
  //     console.log('המשתמש נרשם בהצלחה:', data);
  //     alert('נרשמת בהצלחה למערכת!');
  //     // כאן תוכלי לנווט לדף אחר, למשל דף כניסה
  //   },
  //   // 3. טיפול במקרה של שגיאה (למשל: אימייל כבר קיים)
  //   error: (err) => {
  //     console.error('קרתה שגיאה בתהליך הרישום:', err);
  //     alert('הרישום נכשל, אנא נסי שוב.');
  //   },
  //   // 4. (אופציונלי) פעולה שתקרה כשהתהליך מסתיים (גם אם נכשל)
  //   complete: () => {
  //     console.log('תהליך ה-Observable הסתיים');
  //   }
  // });
}
}
