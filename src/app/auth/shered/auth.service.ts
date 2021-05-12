import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { SignupRequestPayload } from '../signup/signup-request.payload';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LoginResponse } from '../login/login-response.payload';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService
    ) { }

  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    return this.http.post('http://localhost:8080/api/auth/signup', signupRequestPayload,{responseType:'text'});
  }
  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.http.post<LoginResponse>('http://localhost:8080/api/auth/login', loginRequestPayload)
      .pipe(map(data => {
        this.localStorage.store('authenticationToken', data.authenticationToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('expiresAt', data.expiresAt);
        return true;
      }));
    }

    getJwtToken() {
      return this.localStorage.retrieve('authenticationToken');
    }
  
    getRefreshToken() {
      return this.localStorage.retrieve('refreshToken');
    }
  
    getUserName() {
      return this.localStorage.retrieve('username');
    }
  
    getExpirationTime() {
      return this.localStorage.retrieve('expiresAt');
    }
}
