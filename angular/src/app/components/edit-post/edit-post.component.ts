import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {
  post: any = {
    title: '',
    text: '',
    image: '',
    category: 'General'
  };

  postId: string = '';
  categories = ['General', 'Technology', 'Travel', 'Food', 'Lifestyle', 'Business', 'Health', 'Education'];
  loading = true;
  error = '';

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.params['id'];
    this.loadPost();
  }

  loadPost() {
    this.dataService.getById(this.postId).subscribe({
      next: (response: any) => {
        this.post = response;
        this.loading = false;

        // Sprawdzamy czy użytkownik jest autorem
        const currentUser = this.authService.currentUser;
        if (this.post.authorId !== currentUser?.userId) {
          alert('Nie masz uprawnień do edycji tego posta!');
          this.router.navigate(['/blog']);
        }
      },
      error: (error) => {
        console.error('Błąd ładowania posta:', error);
        this.error = 'Nie udało się załadować posta';
        this.loading = false;
      }
    });
  }

  update() {
    if (!this.post.title || !this.post.text) {
      alert('Tytuł i treść są wymagane!');
      return;
    }

    const updateData = {
      title: this.post.title,
      text: this.post.text,
      image: this.post.image,
      category: this.post.category
    };

    this.dataService.updatePost(this.postId, updateData).subscribe({
      next: () => {
        alert('Post został zaktualizowany!');
        this.router.navigate(['/blog']);
      },
      error: (error) => {
        console.error('Błąd aktualizacji:', error);
        alert('Nie udało się zaktualizować posta');
      }
    });
  }

  cancel() {
    this.router.navigate(['/blog']);
  }
}
