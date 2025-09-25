import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { Comment } from '../../../../models/interfaces';
import {CommentService} from '../../../../services/comments/comment.service';
import {AdminGuard} from '../../../../guard/admin-guard';
import {FilmsInfoPage} from '../films-info-page';

@Component({
  selector: 'app-comments',
  standalone: false,
  templateUrl: './comments.html',
  styleUrl: './comments.scss'
})
export class Comments implements OnInit{
  @Input() public comment!: Comment;

  result = false;

  constructor(
    public CommentService: CommentService,
    public FilmsInfoPage: FilmsInfoPage,
    public cdr: ChangeDetectorRef,
    public AdminGuard: AdminGuard
  ) {
  }


  async ngOnInit() {
    const response = await this.CommentService.searchCommentFromDelete()
    if (response.success && response.comments) {
      this.result = response.comments.some(c => c.id === this.comment.id)
    }
    const admin = await this.AdminGuard.canActivate()
    if (admin) {
      this.result = true
    }

    this.cdr.detectChanges()
  }

  async deleteComment() {
    await this.CommentService.deleteComment(this.comment.id)
    await this.FilmsInfoPage.getComm()
    this.cdr.detectChanges()
  }
}
