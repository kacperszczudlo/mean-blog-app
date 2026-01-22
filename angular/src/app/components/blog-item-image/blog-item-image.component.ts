import { Component, Input } from '@angular/core';

@Component({
  selector: 'blog-item-image', // Selektor bez 'app-' zgodnie z instrukcją [cite: 139]
  standalone: true,
  templateUrl: './blog-item-image.html',
  styleUrl: './blog-item-image.scss'
})
export class BlogItemImageComponent {
  @Input() image?: string;
}