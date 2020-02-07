import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from 'src/app/models/Post';
import { AppUser } from 'src/app/models/appuser';
import { PostService } from 'src/app/services/posts.service';
import { CommentService } from 'src/app/services/comment.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit, OnDestroy {

  config: any;
  pageSizeOptions = [];

  postPost: Post[] = [];
  appUser: AppUser;
  email: Post["email"];
  private unsubscribe$ = new Subject<void>();

  constructor(private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService) {

    this.authService.appUser$.subscribe(appUser => this.appUser = appUser);

    this.pageSizeOptions = [10,20,30];

    const val = sessionStorage.getItem('pageSize');

    this.config = {
      currentPage: 1,
      itemsPerPage: val ? +val : this.pageSizeOptions[0]
    };
  }

  ngOnInit() {
    console.log(this.email);
    this.route.params.subscribe(
      params => {
        this.config.currentPage = +params['pagenum'];
        this.getPostPosts();
      }
    );
  }

  getPostPosts() {
    this.postService.getAllPosts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        this.postPost = result;
      });
  }

  edit(postId){
    this.postService.getPostbyId(postId)
  }

  delete(postId) {
    if (confirm('Are you sure')) {
      this.postService.deletePost(postId).then(
        () => {
          this.commentService.deleteAllCommentForPost(postId);
          this.snackBarService.showSnackBar('Post deleted successfully');
        }
      );
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
