import { Component, OnInit, Input } from '@angular/core';
import { DataService } from "../../services/data.service";
import { BlogItemComponent } from "../blog-item/blog-item.component";
import { CommonModule } from "@angular/common";
import { AddPostComponent } from "../add-post/add-post";
import { FilterTextPipe } from "../../pipes/filter-text.pipe"; 
import { PaginatePipe } from "../../pipes/paginate.pipe";
import { PaginationComponent } from "../pagination/pagination.component";
// Nowe importy potrzebne do pełnej funkcjonalności
import { ActivatedRoute, Router } from '@angular/router'; 
import { FavoritesService } from '../../services/favorites.service';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-blog', 
  standalone: true,
  imports: [
    BlogItemComponent, 
    CommonModule, 
    AddPostComponent, 
    FilterTextPipe,
    PaginatePipe,       
    PaginationComponent 
  ], 
  providers: [DataService],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})
export class BlogComponent implements OnInit {
  
  @Input() filterText: string = '';

  public items$: any[] = []; // Zmieniamy na tablicę dla łatwiejszego filtrowania i sortowania

  // --- ZMIENNE DO PAGINACJI ---
  public currentPage: number = 1;
  public itemsPerPage: number = 6;

  constructor(
    private service: DataService,
    private route: ActivatedRoute, // Do odczytu parametrów URL
    public router: Router,         // Do zmiany parametrów URL
    private favoritesService: FavoritesService, // Do obsługi widoku ulubionych
    private ratingService: RatingService       // Do sortowania wg ocen
  ) {}

  ngOnInit() {
    // 1. Odczytaj stronę z URL przy starcie (np. ?page=2)
    this.route.queryParams.subscribe(params => {
      if (params['page']) {
        this.currentPage = Number(params['page']);
      }
      this.getAll();
    });
  }

  getAll() {
    this.service.getAll().subscribe(response => {
      let data = response as any[];

      // 2. Obsługa ścieżki /favorites - filtrujemy tylko ulubione
      if (this.router.url.includes('favorites')) {
        const favIds = this.favoritesService.getFavorites();
        data = data.filter(item => favIds.includes(item._id));
      }

      this.items$ = data;
    });
  }

  // --- METODA DO ZMIANY STRONY Z ZAPISEM W URL ---
  onPageChange(page: number) {
    this.currentPage = page;
    // Aktualizacja URL bez przeładowania strony
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- POPRAWIONE SORTOWANIE ---
  sortItemsByRating() {
    // 1. Tworzymy kopię tablicy za pomocą [...this.items$]
    // Dzięki temu Angular wykryje zmianę i odświeży widok
    this.items$ = [...this.items$].sort((a, b) => {
      const ratingA = this.ratingService.getAverageRating(a._id);
      const ratingB = this.ratingService.getAverageRating(b._id);
      
      // Sortowanie malejące (od najwyższej oceny)
      return ratingB - ratingA;
    });

    // Opcjonalnie: Wracamy na 1 stronę po posortowaniu, żeby użytkownik zobaczył najlepsze wyniki
    this.onPageChange(1); 
  }
}