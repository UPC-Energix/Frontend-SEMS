import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend-sems');

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    const savedLanguage = typeof window !== 'undefined'
      ? localStorage.getItem('preferred-language')
      : null;

    this.translate.setDefaultLang('es');
    this.translate.use(savedLanguage || 'es');
  }
}
