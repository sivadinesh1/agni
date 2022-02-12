
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,
     AngularFirestoreDocument, DocumentReference } from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class FireStoreService {
  private ideas: Observable<any>;
  private ideaCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore) {
    this.ideaCollection = this.afs.collection<any>('athelete');
    this.ideas = this.ideaCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
    );
  }

  getIdeas(): Observable<any> {
    return this.ideas;
  }

  getIdea(id: string): Observable<any> {
    return this.ideaCollection.doc<any>(id).valueChanges().pipe(
      take(1),
      map(idea => {
        idea.id = id;
        return idea;
      })
    );
  }

  addIdea(record): Promise<DocumentReference> {
    return this.ideaCollection.add(record);
  }

  updateIdea(idea): Promise<void> {
    return this.ideaCollection.doc(idea.id).update({ name: idea.name, notes: idea.notes });
  }

  deleteIdea(id: string): Promise<void> {
    return this.ideaCollection.doc(id).delete();
  }
}
