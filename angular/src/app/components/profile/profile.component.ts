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

  userDetails: any = null;

  activity: any[] = [];
  activityLoading = true;
  activityError = '';

  constructor(public authService: AuthService, private dataService: DataService) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (!user) {
      this.error = 'Brak zalogowanego użytkownika';
      this.loading = false;
      this.activityLoading = false;
      return;
    }

    this.authService.getProfile().subscribe({
      next: (details) => {
        this.userDetails = details || null;
      },
      error: () => {
        this.userDetails = null;
      }
    });

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

    this.dataService.getUserActivity(user.userId).subscribe({
      next: (items: any) => {
        this.activity = items || [];
        this.activityLoading = false;
      },
      error: () => {
        this.activityError = 'Nie udało się pobrać aktywności użytkownika';
        this.activityLoading = false;
      }
    });
  }

  get postsCount(): number {
    return this.userPosts.length;
  }

  get registrationDate(): Date | null {
    return this.userDetails?.createdAt ? new Date(this.userDetails.createdAt) : null;
  }
}
