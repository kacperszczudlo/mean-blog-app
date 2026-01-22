import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss' // upewnij się, że rozszerzenie jest poprawne
})
export class NavbarComponent {
  constructor(
    public authService: AuthService, // public, aby HTML go widział 
    private router: Router
  ) {}

  signOut() {
  this.authService.logout().subscribe({
    next: () => {
      this.router.navigate(['/']); // Przekierowanie na stronę główną po wylogowaniu [cite: 1542]
    }
  });
}
}