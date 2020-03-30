import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ShareButtonsConfig } from '@ngx-share/core';
import { HttpClientModule } from '@angular/common/http';
import {NgDompurifyModule} from '@tinkoff/ng-dompurify'

import { AppComponent } from './app.component';
import { NgMaterialModule } from './ng-material/ng-material.module';
import { PostComponent } from './components/post/post.component';
import { CommentsComponent } from './components/comments/comments.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ScrollerComponent } from './components/scroller/scroller.component';
import { AboutUsComponent } from './components/aboutus/aboutus.component';
import { PostEditorComponent } from './components/post-editor/post-editor.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { NoSanitizePipe } from './customPipes/sanitizeHtml';
import { Slug } from './customPipes/slug';
import { SocialShareComponent } from './components/social-share/social-share.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { AuthorProfileComponent } from './components/author-profile/author-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminAuthGuard } from './guards/admin-auth.guard';

// const customConfig: ShareButtonsConfig = {
//   include: ['facebook', 'twitter', 'linkedin', 'pinterest', 'reddit', 'whatsapp', 'print', 'email'],
//   theme: 'circles-dark',
//   autoSetMeta: true,
// };

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    CommentsComponent,
    HomeComponent,
    NavBarComponent,
    ScrollerComponent,
    PostEditorComponent,
    PostCardComponent,
    AboutUsComponent,
    NoSanitizePipe,
    Slug,
    SocialShareComponent,
    PaginatorComponent,
    AuthorProfileComponent
  ],
  imports: [
    NgxPaginationModule,
    HttpClientModule,
    NgDompurifyModule,
    // ShareButtonsModule.withConfig(customConfig),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgMaterialModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'page/:pagenum', component: HomeComponent },
      { path: 'aboutus', component: AboutUsComponent },
      { path: 'counsellor', component: AuthorProfileComponent },
      { path: 'addpost', component: PostEditorComponent, canActivate: [AuthGuard] },
      { path: 'editpost/:id', component: PostEditorComponent, canActivate: [AdminAuthGuard] },
      { path: 'post/:id/:slug', component: PostComponent },
      { path: '**', component: HomeComponent }
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
