import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination-container" *ngIf="totalPages > 1">
      <button (click)="changePage(currentPage - 1)" [disabled]="currentPage === 1">Poprzednia</button>
      
      <span>Strona {{ currentPage }} z {{ totalPages }}</span>
      
      <button (click)="changePage(currentPage + 1)" [disabled]="currentPage === totalPages">Następna</button>
    </div>
  `,
  styles: [`
    .pagination-container { margin: 20px 0; display: flex; gap: 10px; justify-content: center; }
    button { padding: 5px 10px; cursor: pointer; }
  `]
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 5;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}