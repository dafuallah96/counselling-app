import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private db: AngularFirestore) { }

  createPost(post: Post) {
    const postData = JSON.parse(JSON.stringify(post));
    return this.db.collection('posts').add(postData);
  }

  getAllPosts(): Observable<Post[]> {
    const posts = this.db.collection<Post>('posts', ref => ref.orderBy('createdDate', 'desc')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(
          c => ({
            postId: c.payload.doc.id,
            ...c.payload.doc.data()
          }));
      }));
    return posts;
  }

  getPostbyId(id: string): Observable<Post> {
    const userDetails = this.db.doc<Post>('posts/' + id).valueChanges();
    return userDetails;
  }

  updatePost(postId: string, post: Post) {
    const putData = JSON.parse(JSON.stringify(post));
    return this.db.doc('posts/' + postId).update(putData);
  }

  deletePost(postId: string) {
    return this.db.doc('posts/' + postId).delete();
  }
}
