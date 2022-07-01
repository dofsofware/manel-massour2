import { Component, OnInit } from '@angular/core';
import { default as initJs } from 'content/assets/js/index.bundle';

@Component({
  selector: 'jhi-estimer',
  templateUrl: './estimer.component.html',
})
export class EstimerComponent implements OnInit {
  ngOnInit(): void {
    initJs();
  }
}
