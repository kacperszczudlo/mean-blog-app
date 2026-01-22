import { Component, EventEmitter, Output } from '@angular/core'; 
import { DataService } from "../../services/data.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router"; // Dodano RouterModule

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], // Dodano RouterModule
  templateUrl: './add-post.html',
  styleUrls: ['./add-post.scss']
})
export class AddPostComponent {
  newPost = {
    title: '',
    text: '',
    image: 'https://via.placeholder.com/150',
    category: 'General'
  };

  categories = ['General', 'Technology', 'Travel', 'Food', 'Lifestyle', 'Business', 'Health', 'Education'];

  @Output() postAdded = new EventEmitter<void>();

  constructor(private dataService: DataService, private router: Router) {}

  add() {
    if (this.newPost.title && this.newPost.text) {
      this.dataService.addPost(this.newPost).subscribe({
        next: (response: any) => {
          console.log('Post dodany pomyślnie:', response);
          this.newPost = {
            title: '',
            text: '',
            image: 'https://via.placeholder.com/150',
            category: 'General'
          };
          this.postAdded.emit();
          this.router.navigate(['/blog']);
        },
        error: (error: any) => {
          console.error('Błąd podczas dodawania posta:', error);
          alert('Błąd serwera: Nie udało się opublikować posta.');
        }
      });
    } else {
      alert('Tytuł i treść są wymagane!');
    }
  }
}