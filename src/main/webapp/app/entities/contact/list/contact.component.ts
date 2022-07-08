import { Component, OnInit } from '@angular/core';
import { EmailService } from 'app/email.service';

import { default as initJs } from 'content/assets/js/index.bundle';

@Component({
  selector: 'jhi-contact',
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  constructor(protected emailService: EmailService) {}
  ngOnInit(): void {
    initJs();
  }
  tester(): void {
    this.emailService.envoyeremail('xamalteam@gmail.com', 'mon sujet', 'mon message dynamique').subscribe();
  }
}
