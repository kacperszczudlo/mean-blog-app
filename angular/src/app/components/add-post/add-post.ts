import { Component, EventEmitter, Output, OnInit } from '@angular/core'; 
import { DataService } from "../../services/data.service";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './add-post.html',
  styleUrls: ['./add-post.scss']
})
export class AddPostComponent implements OnInit {
  postForm!: FormGroup;
  categories = ['General', 'Technology', 'Travel', 'Food', 'Lifestyle', 'Business', 'Health', 'Education'];
  submitted = false;

  @Output() postAdded = new EventEmitter<void>();

  constructor(
    private dataService: DataService, 
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      text: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      image: ['https://via.placeholder.com/150', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      category: ['General', Validators.required]
    });
  }

  get f() {
    return this.postForm.controls;
  }

  add() {
    this.submitted = true;

    if (this.postForm.invalid) {
      return;
    }

    const currentUser = this.authService.currentUser;
    const postData = {
      ...this.postForm.value,
      authorId: currentUser?.userId,
      authorName: currentUser?.name
    };

    this.dataService.addPost(postData).subscribe({
      next: (response: any) => {
        console.log('Post dodany pomyślnie:', response);
        this.postForm.reset({
          title: '',
          text: '',
          image: 'https://via.placeholder.com/150',
          category: 'General'
        });
        this.submitted = false;
        this.postAdded.emit();
        this.router.navigate(['/blog']);
      },
      error: (error: any) => {
        console.error('Błąd podczas dodawania posta:', error);
        alert('Błąd serwera: Nie udało się opublikować posta.');
      }
    });
  }
}