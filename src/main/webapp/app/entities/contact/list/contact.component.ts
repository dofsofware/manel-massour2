import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailService } from 'app/email.service';

import { default as initJs } from 'content/assets/js/index.bundle';

@Component({
  selector: 'jhi-contact',
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  contactFormGroup!: FormGroup;
  constructor(protected emailService: EmailService) {}
  ngOnInit(): void {
    this.contactFormGroup = new FormGroup({
      nom: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      sujet: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
    });
    initJs();
  }
  tester(): void {
    this.emailService.envoyeremail('xamalteam@gmail.com', 'mon sujet', 'mon message dynamique').subscribe();
  }
}
