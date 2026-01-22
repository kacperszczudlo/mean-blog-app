import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogItemImageComponent } from "../blog-item-image/blog-item-image.component";
import { BlogItemTextComponent } from "../blog-item-text/blog-item-text.component";
import { CommentsSectionComponent } from "../comments-section/comments-section"; // Sprawdź czy ścieżka jest poprawna (czasem brakuje .component)
import { FavoritesService } from '../../services/favorites.service';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'blog-item', // ZMIANA: Usunięto 'app-' zgodnie z instrukcją PDF (str. 8)
  standalone: true,
  imports: [
    CommonModule, 
    BlogItemImageComponent, 
    BlogItemTextComponent, 
    CommentsSectionComponent, 
    RatingComponent
  ], 
  templateUrl: './blog-item.html',
  styleUrl: './blog-item.scss'
})
export class BlogItemComponent {
  @Input() image?: string;
  @Input() text?: string;
  @Input() title?: string;
  @Input() id?: string;

  constructor(public favoritesService: FavoritesService) {}

  onToggleFavorite(event: Event) {
    event.stopPropagation();
    if (this.id) { 
       this.favoritesService.toggleFavorite(this.id);
    }
  }
}