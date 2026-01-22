import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn btn-outline-secondary" (click)="themeService.toggleTheme()">
      {{ (themeService.darkMode$ | async) ? '🌙 Tryb Ciemny' : '☀️ Tryb Jasny' }}
    </button>
  `
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}
}