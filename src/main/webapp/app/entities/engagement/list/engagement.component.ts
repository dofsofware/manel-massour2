import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPropriete } from 'app/entities/propriete/propriete.model';
import { ProprieteService } from 'app/entities/propriete/service/propriete.service';
import { TypeDeBien } from 'app/entities/enumerations/type-de-bien.model';
import { default as initJs } from 'content/assets/js/index.bundle';

@Component({
  selector: 'jhi-engagement',
  templateUrl: './engagement.component.html',
})
export class EngagementComponent implements OnInit {
  isLoading = false;
  proprietes?: IPropriete[];

  constructor(protected proprietesService: ProprieteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.proprietesService.query().subscribe({
      next: (res: HttpResponse<IPropriete[]>) => {
        this.isLoading = false;
        this.proprietes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
    initJs();
  }

  trackId(_index: number, item: IPropriete): number {
    return item.id!;
  }
  compteur(value: string): number {
    let tout = 0;
    let maison = 0;
    let appart = 0;
    let bureau = 0;
    let terrain = 0;
    let chambre = 0;
    let localDecommerce = 0;
    let verger = 0;
    let hangar = 0;
    this.proprietes?.forEach(propriete => {
      tout++;
      if (propriete.type === TypeDeBien.MAISON) {
        maison++;
      } else if (propriete.type === TypeDeBien.APPARTEMENT) {
        appart++;
      } else if (propriete.type === TypeDeBien.BUREAU) {
        bureau++;
      } else if (propriete.type === TypeDeBien.VERGER) {
        verger++;
      } else if (propriete.type === TypeDeBien.HANGAR) {
        hangar++;
      } else if (propriete.type === TypeDeBien.LOCAL_DE_COMMERCE) {
        localDecommerce++;
      } else if (propriete.type === TypeDeBien.CHAMBRE) {
        chambre++;
      } else {
        terrain++;
      }
    });
    if (value === 'MAISON') {
      return maison;
    }
    if (value === 'tout') {
      return tout;
    } else if (value === 'APPARTEMENT') {
      return appart;
    } else if (value === 'TERRAIN') {
      return terrain;
    } else if (value === 'CHAMBRE') {
      return chambre;
    } else if (value === 'VERGER') {
      return verger;
    } else if (value === 'HANGAR') {
      return hangar;
    } else if (value === 'LOCAL_DE_COMMERCE') {
      return localDecommerce;
    } else if (value === 'BUREAU') {
      return bureau;
    } else {
      return 0;
    }
  }
  allerA(transac: string, cat: string): void {
    const getUrl = window.location;
    const baseUrl = getUrl.protocol + '//' + getUrl.host + '/';
    const monurl =
      baseUrl + `recherche?lat=14.656875015645937&lng=-14.833755006747824&categories=${cat}&transac=${transac}&carte=false&sansfiltre=true`;
    window.location.href = monurl;
  }
}
