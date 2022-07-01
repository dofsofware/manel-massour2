import { Component, OnInit } from '@angular/core';
import { default as initJs } from 'content/assets/js/index.bundle';

@Component({
  selector: 'jhi-acheter',
  templateUrl: './acheter.component.html',
})
export class AcheterComponent implements OnInit {
  ngOnInit(): void {
    initJs();
  }
}
