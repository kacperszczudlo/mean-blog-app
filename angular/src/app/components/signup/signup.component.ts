import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  credentials = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  create() {
    this.authService.createOrUpdate(this.credentials).subscribe({
      next: () => {
        alert('Konto stworzone pomyślnie! Teraz możesz się zalogować.');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Wystąpił błąd podczas rejestracji.');
      }
    });
  }
}