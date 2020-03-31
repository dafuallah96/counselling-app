import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/Post';
import { PostService } from 'src/app/services/posts.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {

  postData: Post = new Post();
  postId;
  postContent: string = '';
  private unsubscribe$ = new Subject<void>();

  constructor(private _route: ActivatedRoute,
    private postService: PostService) {
    if (this._route.snapshot.params['id']) {
      this.postId = this._route.snapshot.paramMap.get('id');
    }
  }

  ngOnInit() {
    this.postService.getPostbyId(this.postId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (result: Post) => {
          const oembed = result.content.split('</oembed>');
          let body = '';
          oembed.forEach((item, index) => {
            body += oembed[index] + '</oembed>';
            const oembed1 = item.split('url="')[1];
            if (oembed1) {
              const oembed2 = oembed1.split('">')[0];
              if (oembed2) {
                const youtube = oembed2.split('https://www.youtube.com/watch?v=')[1];
                if (youtube) {
                  body += '<div class="iframe-container"><iframe width="560" height="315" src="https://youtube.com/embed/' + youtube + '" frameborder="0"; scrolling="no"; allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
                }
              }
            }
          });

          this.postContent = body;
          this.postData = result;
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
