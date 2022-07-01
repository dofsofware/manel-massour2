import { Component, OnInit } from '@angular/core';
import { default as initJs } from 'content/assets/js/index.bundle';

@Component({
  selector: 'jhi-louer',
  templateUrl: './louer.component.html',
})
export class LouerComponent implements OnInit {
  ngOnInit(): void {
    initJs();
  }
}
