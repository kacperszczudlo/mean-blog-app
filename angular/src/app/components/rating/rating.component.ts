import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'] // Pamiętaj o stylu
})
export class RatingComponent implements OnInit {
  @Input() postId: string = '';
  
  stars: number[] = [1, 2, 3, 4, 5];
  hoverRating: number = 0;
  averageRating: number = 0;
  votesCount: number = 0;

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.updateStats();
  }

  updateStats() {
    if (this.postId) {
      this.averageRating = this.ratingService.getAverageRating(this.postId);
      this.votesCount = this.ratingService.getPostRatings(this.postId).length;
    }
  }

  onStarHover(rating: number): void {
    this.hoverRating = rating;
  }

  onStarLeave(): void {
    this.hoverRating = 0;
  }

  onStarClick(rating: number): void {
    if (this.postId) {
      this.ratingService.addRating(this.postId, rating);
      this.updateStats(); // Odśwież widok po zagłosowaniu
    }
  }
  
  // Pomocnicza funkcja do wyświetlania wypełnienia gwiazdek
  showIcon(star: number): boolean {
    if (this.hoverRating >= star) return true; // Hover ma pierwszeństwo
    if (this.hoverRating === 0 && this.averageRating >= star) return true; // Jeśli nie ma hover, pokaż średnią
    return false;
  }
}