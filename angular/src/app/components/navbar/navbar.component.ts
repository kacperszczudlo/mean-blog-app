import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ThemeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss' // upewnij się, że rozszerzenie jest poprawne
})
export class NavbarComponent {
  isCollapsed = true;

  constructor(
    public authService: AuthService, // public, aby HTML go widział 
    private router: Router
  ) {}

  toggleNav() {
    this.isCollapsed = !this.isCollapsed;
  }

  signOut() {
  this.authService.logout().subscribe({
    next: () => {
      this.router.navigate(['/']);
    }
  });
}
}