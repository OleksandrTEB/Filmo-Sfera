import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Comment} from '../../../../models/interfaces';
import {CommentService} from '../../../../services/comments/comment.service';
import {AdminGuard} from '../../../../guard/admin-guard';
import {ConnSocket} from '../../../../services/WebService/WebService';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-comments',
  standalone: false,
  templateUrl: './comments.html',
  styleUrl: './comments.scss'
})
export class Comments implements OnInit{
  @Input() public comment!: Comment;

  result = false;
  msg: string = 'getcomment';

  constructor(
    public CommentService: CommentService,
    public cdr: ChangeDetectorRef,
    public AdminGuard: AdminGuard,
    private connSocket: ConnSocket
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
    await this.CommentService.deleteComment(this.comment.id);
    this.connSocket.messages$.next({type: this.msg})
    await this.connSocket.connSocket({type: this.msg});
  }
}
