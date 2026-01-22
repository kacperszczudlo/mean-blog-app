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
    // Zmieniono 'register' na 'createOrUpdate' zgodnie z serwisem 
    this.authService.createOrUpdate(this.credentials).subscribe({
      next: () => {
        alert('Konto stworzone pomyślnie! Teraz możesz się zalogować.');
        this.router.navigate(['/login']); // [cite: 349]
      },
      error: (err: any) => { // Dodano typ : any, aby naprawić błąd TS7006 [cite: 351]
        console.error('Błąd rejestracji:', err); // [cite: 352]
        alert('Wystąpił błąd podczas rejestracji.');
      }
    });
  }
}