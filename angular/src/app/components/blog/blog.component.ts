import { Component, OnInit, Input } from '@angular/core';
import { DataService } from "../../services/data.service";
import { BlogItemComponent } from "../blog-item/blog-item.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FilterTextPipe } from "../../pipes/filter-text.pipe"; 
import { PaginatePipe } from "../../pipes/paginate.pipe";
import { PaginationComponent } from "../pagination/pagination.component";
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
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public sortBy: string = 'newest';
  public selectedCategory: string = 'all';
  public dateFrom: string = '';
  public dateTo: string = '';
  public authorFilter: string = '';
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
      if (params['q']) {
        this.filterText = params['q'];
      }
      if (params['author']) {
        this.authorFilter = params['author'];
      }
      if (params['dateFrom']) this.dateFrom = params['dateFrom'];
      if (params['dateTo']) this.dateTo = params['dateTo'];
      if (params['sort']) this.sortBy = params['sort'];
      this.getAll();
    });
  }

  getAll() {
    const query: any = {};
    if (this.filterText && this.filterText.trim()) {
      query.q = this.filterText.trim();
    }
    if (this.selectedCategory !== 'all') {
      query.category = this.selectedCategory;
    }
    if (this.authorFilter && this.authorFilter.trim()) {
      query.author = this.authorFilter.trim();
    }
    if (this.dateFrom) query.dateFrom = this.dateFrom;
    if (this.dateTo) query.dateTo = this.dateTo;
    query.sort = this.sortBy;

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

  onFilterChange() {
    this.currentPage = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.filterText || null,
        author: this.authorFilter || null,
        dateFrom: this.dateFrom || null,
        dateTo: this.dateTo || null,
        page: 1
      },
      queryParamsHandling: 'merge'
    });
    this.getAll();
  }

  // --- POPRAWIONE SORTOWANIE PO OCENIE ---
  applySorting() {
    this.currentPage = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: this.sortBy,
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
}