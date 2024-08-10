import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject} from "firebase/storage"
import { authState } from 'rxfire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth);
  }

  // login(email: string, password: string) {
  //   return signInWithEmailAndPassword(this.auth, email, password);
  // }

  // register(email: string, password: string) {
  //   return createUserWithEmailAndPassword(this.auth, email, password);
  // }

  // logout() {
  //   return signOut(this.auth);
  // }

  // getUser() {
  //   return this.user$;
  // }

  //============== Almacernar Imagenes =========
  async uploadImage(path: string, data_url:string){
    return uploadString(ref(getStorage(), path),data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })
  }

  async getFilePath(url:string){
    return ref(getStorage(), url).fullPath
  }

  async deleteFile(path:string){
    return deleteObject(ref(getStorage(), path))
  }
}

