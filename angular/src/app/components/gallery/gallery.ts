import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class GalleryComponent implements OnInit {

  images: string[] = [];
 
  selectedImage: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
   
    this.dataService.getAll().subscribe((allPosts: any) => {
      this.images = allPosts.map((post: any) => post.image);
});
  }


  openImage(img: string) {
    this.selectedImage = img;
  }

  closeImage() {
    this.selectedImage = null;
  }
}