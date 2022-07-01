import { Component, OnInit } from '@angular/core';
import { default as initJs } from 'content/assets/js/index.bundle';

@Component({
  selector: 'jhi-apropos',
  templateUrl: './apropos.component.html',
})
export class AproposComponent implements OnInit {
  ngOnInit(): void {
    initJs();
  }
}
