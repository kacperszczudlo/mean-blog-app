import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userPosts: any[] = [];
  loading = true;
  error = '';

  constructor(public authService: AuthService, private dataService: DataService) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (!user) {
      this.error = 'Brak zalogowanego użytkownika';
      this.loading = false;
      return;
    }

    this.dataService.getByAuthor(user.userId).subscribe({
      next: (posts: any) => {
        this.userPosts = posts || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Nie udało się pobrać postów użytkownika';
        this.loading = false;
      }
    });
  }

  get postsCount(): number {
    return this.userPosts.length;
  }
}
