import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogItemImageComponent } from "../blog-item-image/blog-item-image.component";
import { BlogItemTextComponent } from "../blog-item-text/blog-item-text.component";
import { CommentsSectionComponent } from "../comments-section/comments-section";
import { FavoritesService } from '../../services/favorites.service';
import { RatingComponent } from '../rating/rating.component';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { HighlightPipe } from '../../pipes/highlight.pipe';

@Component({
  selector: 'blog-item',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    BlogItemImageComponent, 
    BlogItemTextComponent, 
    CommentsSectionComponent, 
    RatingComponent,
    HighlightPipe
  ], 
  templateUrl: './blog-item.html',
  styleUrl: './blog-item.scss'
})
export class BlogItemComponent {
  @Input() image?: string;
  @Input() text?: string;
  @Input() title?: string;
  @Input() id?: string;
  @Input() authorId?: string;
  @Input() authorName?: string;
  @Input() likes?: number = 0;
  @Input() likedBy?: string[] = [];
  @Input() category?: string;
  @Input() createdAt?: Date;
  @Input() comments: any[] = [];
  @Input() averageRating: number = 0;
  @Input() ratingsCount: number = 0;
  @Input() highlightTerm: string = '';
  
  @Output() postDeleted = new EventEmitter<string>();
  @Output() postUpdated = new EventEmitter<void>();

  constructor(
    public favoritesService: FavoritesService,
    public authService: AuthService,
    private dataService: DataService
  ) {}

  isAuthor(): boolean {
    const currentUser = this.authService.currentUser;
    return currentUser && this.authorId === currentUser.userId;
  }

  isLikedByUser(): boolean {
    const currentUser = this.authService.currentUser;
    return currentUser && this.likedBy ? this.likedBy.includes(currentUser.userId) : false;
  }

  onToggleFavorite(event: Event) {
    event.stopPropagation();
    if (this.id) { 
       this.favoritesService.toggleFavorite(this.id);
    }
  }

  onDelete(event: Event) {
    event.stopPropagation();
    if (confirm('Czy na pewno chcesz usunąć ten post?')) {
      if (this.id) {
        this.dataService.deletePost(this.id).subscribe({
          next: () => {
            alert('Post został usunięty!');
            this.postDeleted.emit(this.id);
          },
          error: () => {
            alert('Nie udało się usunąć posta');
          }
        });
      }
    }
  }

  onLike(event: Event) {
    event.stopPropagation();
    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      alert('Musisz być zalogowany, aby polubić post');
      return;
    }

    if (this.id) {
      if (this.isLikedByUser()) {
        this.dataService.unlikePost(this.id, currentUser.userId).subscribe({
          next: () => {
            this.postUpdated.emit();
          },
          error: () => {}
        });
      } else {
        this.dataService.likePost(this.id, currentUser.userId).subscribe({
          next: () => {
            this.postUpdated.emit();
          },
          error: () => {}
        });
      }
    }
  }
}