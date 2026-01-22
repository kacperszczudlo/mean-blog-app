import { Component, Input, OnInit } from '@angular/core';
// Importujemy z comments.ts (bez .service)
import { CommentsService } from "../../services/comments";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-comments-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  // Zakładam, że tutaj też masz krótkie nazwy html/scss wygenerowane przez CLI
  templateUrl: './comments-section.html',
  styleUrl: './comments-section.scss'
})
export class CommentsSectionComponent implements OnInit {
  @Input() postId?: string;
  commentText: string = '';
  comments: any[] = [];

  constructor(private commentsService: CommentsService) {}

  ngOnInit() {
    this.loadComments();
  }

  addComment() {
    if (this.postId && this.commentText.trim()) {
      this.commentsService.addComment(this.postId, this.commentText);
      this.commentText = '';
      this.loadComments();
    }
  }

  loadComments() {
    if (this.postId) {
      this.comments = this.commentsService.getCommentsByPostId(this.postId);
    }
  }
}