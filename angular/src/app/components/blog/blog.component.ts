import { Component, OnInit, Input } from '@angular/core';
import { DataService } from "../../services/data.service";
import { BlogItemComponent } from "../blog-item/blog-item.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FilterTextPipe } from "../../pipes/filter-text.pipe"; 
import { PaginatePipe } from "../../pipes/paginate.pipe";
import { PaginationComponent } from "../pagination/pagination.component";
// Nowe importy potrzebne do pełnej funkcjonalności
import { ActivatedRoute, Router } from '@angular/router'; 
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-blog', 
  standalone: true,
  imports: [
    BlogItemComponent, 
    CommonModule,
    FormsModule,
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

  public items$: any[] = [];

  // --- ZMIENNE DO PAGINACJI ---
  public currentPage: number = 1;
  public itemsPerPage: number = 6;

  // --- ZAAWANSOWANE WYSZUKIWANIE ---
  public searchTitle: string = '';
  public searchAuthor: string = '';
  public dateFrom: string = '';
  public dateTo: string = '';
  public sortBy: string = 'newest';
  
  // --- FILTROWANIE PO KATEGORII ---
  public selectedCategory: string = 'all';
  public categories = ['all', 'General', 'Technology', 'Travel', 'Food', 'Lifestyle', 'Business', 'Health', 'Education'];

  constructor(
    private service: DataService,
    private route: ActivatedRoute,
    public router: Router,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['page']) {
        this.currentPage = Number(params['page']);
      }
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['title']) this.searchTitle = params['title'];
      if (params['author']) this.searchAuthor = params['author'];
      if (params['startDate']) this.dateFrom = params['startDate'];
      if (params['endDate']) this.dateTo = params['endDate'];
      if (params['sort']) this.sortBy = params['sort'];
      this.getAll();
    });
  }

  getAll() {
    const query: any = {
      title: this.searchTitle || this.filterText,
      author: this.searchAuthor,
      category: this.selectedCategory !== 'all' ? this.selectedCategory : undefined,
      startDate: this.dateFrom || undefined,
      endDate: this.dateTo || undefined,
      sort: this.sortBy
    };

    this.service.getAll(query).subscribe(response => {
      let data = response as any[];

      if (this.router.url.includes('favorites')) {
        const favIds = this.favoritesService.getFavorites();
        data = data.filter(item => favIds.includes(item._id));
      }

      this.items$ = data;
    });
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: category, page: 1 },
      queryParamsHandling: 'merge'
    });
    this.getAll();
  }

  applyFilters() {
    this.currentPage = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        title: this.searchTitle || this.filterText || null,
        author: this.searchAuthor || null,
        category: this.selectedCategory !== 'all' ? this.selectedCategory : null,
        startDate: this.dateFrom || null,
        endDate: this.dateTo || null,
        sort: this.sortBy || null,
        page: 1
      },
      queryParamsHandling: 'merge'
    });
    this.getAll();
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
    this.items$ = [...this.items$].sort((a, b) => {
      const ratingA = a.averageRating || 0;
      const ratingB = b.averageRating || 0;
      return ratingB - ratingA;
    });

    this.onPageChange(1); 
  }
}