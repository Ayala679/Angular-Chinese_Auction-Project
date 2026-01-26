import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from './components/register/register';
import { Login } from './components/login/login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Register,Login],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Client-Chinese_Auction');
}
