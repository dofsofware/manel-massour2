import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class EmailService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  envoyeremail(email_: string, sujet_: string, message: string): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/envoyeremail'), {
      email: email_,
      sujet: sujet_,
      contenu: message,
    });
  }
}
