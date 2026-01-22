import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() postId: string = '';
  @Input() averageRating: number = 0;
  @Input() votesCount: number = 0;

  stars: number[] = [1, 2, 3, 4, 5];
  hoverRating: number = 0;
  submitting = false;

  constructor(private dataService: DataService, private authService: AuthService) {}

  ngOnInit(): void {}

  onStarHover(rating: number): void {
    this.hoverRating = rating;
  }

  onStarLeave(): void {
    this.hoverRating = 0;
  }

  onStarClick(rating: number): void {
    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      alert('Musisz być zalogowany, aby oceniać posty');
      return;
    }
    if (!this.postId || this.submitting) return;

    this.submitting = true;
    this.dataService
      .ratePost(this.postId, { userId: currentUser.userId, value: rating })
      .subscribe({
        next: (updated: any) => {
          this.averageRating = updated?.averageRating || 0;
          this.votesCount = updated?.ratingsCount || 0;
          this.submitting = false;
        },
        error: () => {
          this.submitting = false;
        }
      });
  }
  
  showIcon(star: number): boolean {
    if (this.hoverRating >= star) return true;
    if (this.hoverRating === 0 && this.averageRating >= star) return true;
    return false;
  }
}