import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from 'app/login/login.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalPartageService {
  constructor(private router: Router, private loginService: LoginService) {}

  AutoLogin(): any {
    return this.loginService.login({
      username: 'admin',
      password: 'admin',
      rememberMe: true,
    });
  }
}
