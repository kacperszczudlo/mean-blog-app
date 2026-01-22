import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- Ważne dla 'async' pipe
import { RouterModule } from '@angular/router'; // <--- Ważne dla routerLink="/favorites"
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { BlogComponent } from "../blog/blog.component";
import { ThemeService } from '../../services/theme.service'; // <--- Import serwisu

@Component({
  selector: 'app-blog-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBarComponent, BlogComponent], // <--- Dodano CommonModule i RouterModule
  templateUrl: './blog-home.component.html',
  styleUrl: './blog-home.component.scss'
})
export class BlogHomeComponent {
  
  public filterText: string = '';

  // Musisz wstrzyknąć serwis jako 'public', aby HTML go widział
  constructor(public themeService: ThemeService) {} 

  getName($event: string): void {
    this.filterText = $event;
  }
}