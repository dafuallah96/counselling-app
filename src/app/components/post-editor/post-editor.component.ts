import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Post } from 'src/app/models/Post';
import { AppUser } from 'src/app/models/appuser';
import { PostService } from 'src/app/services/posts.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss'],
  providers: [DatePipe]
})
export class PostEditorComponent implements OnInit, OnDestroy {

  public Editor = ClassicEditor;
  ckeConfig: any;
  public postData = new Post();
  appUser: AppUser;
  formTitle = 'Add';
  postId;
  email: AppUser;
  private unsubscribe$ = new Subject<void>();

  constructor(private _route: ActivatedRoute,
    private datePipe: DatePipe,
    private postService: PostService,
    private _router: Router,
    private authService: AuthService) {
    if (this._route.snapshot.params['id']) {
      this.postId = this._route.snapshot.paramMap.get('id');
    }
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser);
  }

  ngOnInit() {
    this.setEditorConfig();
    if (this.postId) {
      this.formTitle = 'Edit';
      this.postService.getPostbyId(this.postId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          result => {
            this.setPostFormData(result);
          }
        );
    }
  }
  setPostFormData(postFormData) {
    this.postData.title = postFormData.title;
    this.postData.content = postFormData.content;
  }

  savePostPost() {
    if (this.postId) {
      this.postService.updatePost(this.postId, this.postData).then(
        () => {
          this._router.navigate(['/']);
        }
      );
    } else {
      this.postData.createdDate = this.datePipe.transform(Date.now(), 'MM-dd-yyyy HH:mm');
      this.postData.author = this.appUser.name;
      this.postData.email = this.appUser.email;
      this.postService.createPost(this.postData).then(
        () => {
          this._router.navigate(['/']);
        }
      );
    }
  }

  setEditorConfig() {
    this.ckeConfig = {
      removePlugins: ['ImageUpload', 'MediaEmbed'],
      heading: {
        options: [
          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
          { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
          { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
          { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
          { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
          { model: 'Formatted', view: 'pre', title: 'Formatted' },
        ]
      }
    };
  }

  cancel() {
    this._router.navigate(['/']);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
