import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-comments-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments-section.html',
  styleUrl: './comments-section.scss'
})
export class CommentsSectionComponent implements OnInit {
  @Input() postId?: string;
  @Input() comments: any[] = [];
  commentText: string = '';
  submitting = false;
  showAll: boolean = false;

  constructor(private dataService: DataService, private authService: AuthService) {}

  ngOnInit() {}

  addComment() {
    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      alert('Zaloguj się, aby dodać komentarz');
      return;
    }
    if (!this.postId || !this.commentText.trim() || this.submitting) return;

    this.submitting = true;
    this.dataService
      .addComment(this.postId, {
        userId: currentUser.userId,
        userName: currentUser.name,
        text: this.commentText.trim()
      })
      .subscribe({
        next: (updated: any) => {
          this.comments = updated?.comments || [];
          this.commentText = '';
          this.submitting = false;
        },
        error: () => {
          this.submitting = false;
        }
      });
  }
}