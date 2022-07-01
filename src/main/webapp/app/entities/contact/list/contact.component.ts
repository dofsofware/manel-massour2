import { Component, OnInit } from '@angular/core';

import { default as initJs } from 'content/assets/js/index.bundle';

@Component({
  selector: 'jhi-contact',
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  ngOnInit(): void {
    initJs();
  }
}
