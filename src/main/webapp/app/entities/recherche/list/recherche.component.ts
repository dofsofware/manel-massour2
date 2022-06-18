import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RechercheService } from '../service/recherche.service';
import { default as initJs } from 'content/assets/js/index.bundle';
import * as L from 'leaflet';
import $, { makeArray } from 'jquery';
import { IPropriete } from 'app/entities/propriete/propriete.model';
import { ProprieteService } from 'app/entities/propriete/service/propriete.service';
import { DataUtils } from 'app/core/util/data-util.service';
import { HttpResponse } from '@angular/common/http';
import { ProprieteDeleteDialogComponent } from 'app/entities/propriete/delete/propriete-delete-dialog.component';
import { IPositionElements } from 'ngx-infinite-scroll';
import { Transaction } from 'app/entities/enumerations/transaction.model';
@Component({
  selector: 'jhi-recherche',
  templateUrl: './recherche.component.html',
})
export class RechercheComponent implements OnInit, AfterViewInit, AfterViewChecked {
  proprietesInitial?: IPropriete[];
  proprietes?: IPropriete[];
  proprieteDetail?: IPropriete;
  isLoading = false;
  recaptcha_ = true;
  nbpUrl = true;
  entrer = true;
  map2Init = false;
  private map: any;
  private map2: any;

  constructor(
    protected proprieteService: ProprieteService,
    protected dataUtils: DataUtils,
    protected rechercheService: RechercheService,
    protected modalService: NgbModal
  ) {}

  ngAfterViewChecked(): void {
    if (this.entrer === true && $('.card__box-v1').length > 0) {
      this.addMarkers();
      this.entrer = false;
    }

    $('.bluebox').css({
      width: `${$('.slider__image__detail-large-one').width()!}px`,
    });

    if (this.nbpUrl === true && $('.card__box-v1').length > 0) {
      this.proprietefilter();
      this.nbpUrl = false;
    }
    $('#return-to-top').css('display', 'none');
  }

  sortBy(trierPar: string): void {
    if (trierPar === 'moinscher') {
      this.proprietes = this.proprietes?.sort(function (a: IPropriete, b: IPropriete) {
        return a.prix! - b.prix!;
      });
    } else if (trierPar === 'pluscher') {
      this.proprietes = this.proprietes?.sort(function (a: IPropriete, b: IPropriete) {
        return b.prix! - a.prix!;
      });
    } else if (trierPar === 'vendre') {
      this.proprietes = this.proprietes?.sort(function (a: IPropriete) {
        if (a.modeDeTransaction === 'VENDRE') {
          return -1;
        } else {
          return 1;
        }
      });
    } else if (trierPar === 'louer') {
      this.proprietes = this.proprietes?.sort(function (a: IPropriete) {
        if (a.modeDeTransaction === 'VENDRE') {
          return 1;
        } else {
          return -1;
        }
      });
    }
  }

  reinitialiserResultat(): void {
    $('#search').val('');
    this.proprietefilter();
  }

  proprietefilter(): void {
    const motCle = String($('#search').val()).split(',');
    if ($('#search').val() === '') {
      this.proprietes = this.proprietesInitial;
    } else {
      this.proprietes = this.proprietesInitial;
      this.proprietes = this.proprietes?.filter(function (prop) {
        return String(prop.adresse).toUpperCase().includes(String(motCle[0]).toUpperCase());
      });
    }
    if ($('#nbpieces').val() !== 'tout') {
      if ($('#nbpieces').val() === '10plus') {
        this.proprietes = this.proprietes?.filter(function (prop) {
          return prop.nombreDePieces! >= 10;
        });
      } else {
        this.proprietes = this.proprietes?.filter(function (prop) {
          return prop.nombreDePieces! === Number($('#nbpieces').val());
        });
      }
    }
    if ($('#meuble').is(':checked')) {
      this.proprietes = this.proprietes?.filter(function (prop) {
        if (prop.meuble) {
          return prop.meuble;
        } else {
          return false;
        }
      });
    }
    if ($('#eau').is(':checked')) {
      this.proprietes = this.proprietes?.filter(function (prop) {
        if (prop.accesEau) {
          return prop.accesEau;
        } else {
          return false;
        }
      });
    }
    if ($('#adsl').is(':checked')) {
      this.proprietes = this.proprietes?.filter(function (prop) {
        if (prop.accesADSL) {
          return prop.accesADSL;
        } else {
          return false;
        }
      });
    }
    if ($('#electricite').is(':checked')) {
      this.proprietes = this.proprietes?.filter(function (prop) {
        if (prop.acceEelectricite) {
          return prop.acceEelectricite;
        } else {
          return false;
        }
      });
    }
    if ($('#moratoire').is(':checked')) {
      this.proprietes = this.proprietes?.filter(function (prop) {
        if (prop.modeDePaiement) {
          return prop.modeDePaiement === 'MORATOIRE';
        } else {
          return false;
        }
      });
    }
    if ($('#comptant').is(':checked')) {
      this.proprietes = this.proprietes?.filter(function (prop) {
        if (prop.modeDePaiement) {
          return prop.modeDePaiement === 'COMPTANT';
        } else {
          return false;
        }
      });
    }
    if ($('#max').val()) {
      this.proprietes = this.proprietes?.filter(function (prop) {
        return prop.prix! <= $('#max').val()!;
      });
    }
    if ($('#min').val()) {
      this.proprietes = this.proprietes?.filter(function (prop) {
        return prop.prix! >= $('#min').val()!;
      });
    }

    this.proprietes = this.proprietes?.filter(function (prop) {
      if ($('#categories').val() === 'terrain') {
        return prop.type! === 'TERRAIN';
      } else if ($('#categories').val() === 'maison') {
        return prop.type! === 'MAISON';
      } else if ($('#categories').val() === 'appartement') {
        return prop.type! === 'APPARTEMENT';
      } else if ($('#categories').val() === 'chambre') {
        return prop.type! === 'CHAMBRE';
      } else if ($('#categories').val() === 'bureau') {
        return prop.type! === 'BUREAU';
      } else if ($('#categories').val() === 'commerce') {
        return prop.type! === 'LOCAL_DE_COMMERCE';
      } else if ($('#categories').val() === 'verger') {
        return prop.type! === 'VERGER';
      } else if ($('#categories').val() === 'hangar') {
        return prop.type! === 'HANGAR';
      }
      return true;
    });
    $('.skeleton-content').delay(2000).fadeOut('slow');
    this.entrer = true;
    this.addMarkers();
  }

  loadAll(): void {
    this.isLoading = true;

    this.proprieteService.query().subscribe({
      next: (res: HttpResponse<IPropriete[]>) => {
        this.isLoading = false;
        this.proprietes = res.body ?? [];
        this.proprietesInitial = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  reecriturePapier(value: string): string {
    if (value === 'MAISON') {
      return 'Maison';
    } else if (value === 'APPARTEMENT') {
      return 'Appartement';
    } else if (value === 'TERRAIN') {
      return 'Terrain';
    } else if (value === 'CHAMBRE') {
      return 'Chambre';
    } else if (value === 'VERGER') {
      return 'Verger';
    } else if (value === 'HANGAR') {
      return 'Hangar';
    } else if (value === 'LOCAL_DE_COMMERCE') {
      return 'Local de commerce';
    } else if (value === 'BUREAU') {
      return 'Bureau';
    } else if (value === 'LOCATION') {
      return 'Location';
    } else if (value === 'VENDRE') {
      return 'Vente';
    } else if (value === 'BAIL') {
      return 'Bail';
    } else if (value === 'DELIBERATION') {
      return 'Délibération';
    } else if (value === 'TITRE_FONCIER') {
      return 'Titre foncier';
    } else {
      return '';
    }
  }

  addMarkers(): void {
    $('.leaflet-marker-icon').remove();
    $('.leaflet-popup').remove();
    const marker_location = L.icon({
      iconUrl: 'content/assets/images/marker_louer.png',
      iconSize: [45, 45],
    });

    const marker_vente = L.icon({
      iconUrl: 'content/assets/images/marker_vendre.png',
      iconSize: [45, 45],
    });
    if (this.proprietes) {
      for (let i = 0; i < this.proprietes.length; i++) {
        let marker: L.Marker<any>;
        if (this.proprietes[i].modeDeTransaction === 'LOCATION') {
          marker = L.marker([this.proprietes[i].latitude!, this.proprietes[i].longitude!], {
            icon: marker_location,
          });
        } else {
          marker = L.marker([this.proprietes[i].latitude!, this.proprietes[i].longitude!], {
            icon: marker_vente,
          });
        }

        marker.addTo(this.map)
          .bindPopup(`<div class="card__image card__box-v1" style="background-color: #FFF; width:450px!important; height: 127px!important">
                                        <div class="row no-gutters" >
                                          <div class="col-4" style="margin:0!important; padding:0!important">
                                            <div class="card__image__header " style=" height: 125px!important">
                                              <a href="#">
                                                
                                                ${
                                                  this.proprietes[i].papier
                                                    ? `<div class="ribbon">${this.reecriturePapier(
                                                        String(this.proprietes[i].papier!)
                                                      )}</div>`
                                                    : ''
                                                }
                                                <img src="https://tech-xel.com/model/${this.proprietes[i]
                                                  .urlPhotoPrincipale!}" alt="" class="img-fluid w100 img-transition">
                                                <div class="info">${this.reecriturePapier(
                                                  String(this.proprietes[i].modeDeTransaction!)
                                                )}</div>
                                              </a>
                                            </div>
                                          </div>
                                          <div class="col-4" >
                                            <div class="card__image__body" >
      
                                              <span class="badge badge-primary text-capitalize mb-2">${this.reecriturePapier(
                                                String(this.proprietes[i].type!)
                                              )}</span>
                                              
      
                                              <ul class="list-inline card__content">
                                              ${
                                                this.proprietes[i].nombreDeDouches && this.proprietes[i].nombreDeDouches! > 0
                                                  ? `<li class="list-inline-item">                            
                                                <span>
                                                  <i class="fa fa-bath"></i> ${this.proprietes[i].nombreDeDouches!}
                                                </span>
                                              </li>
                                              `
                                                  : ''
                                              }
                                                
                                                ${
                                                  this.proprietes[i].nombreDePieces && this.proprietes[i].nombreDePieces! > 0
                                                    ? `<li class="list-inline-item">
                                                  <span>
                                                    <i class="fa fa-bed"></i> ${this.proprietes[i].nombreDePieces!}
                                                  </span>
                                                </li>
                                                `
                                                    : ''
                                                }
                                                
                                                ${
                                                  this.proprietes[i].nombreDeGarages && this.proprietes[i].nombreDeGarages! > 0
                                                    ? `<li class="list-inline-item">
                                                  <span>
                                                    <i class="fa fa-inbox"></i> ${this.proprietes[i].nombreDeGarages!}
                                                  </span>
                                                  </li>
                                                `
                                                    : ''
                                                }
                                                
                                                <li class="list-inline-item">
                                                  <span>
                                                    <i class="fa fa-map"></i> 4300 m<sup>2</sup>
                                                  </span>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                          <div class="col-md-4 col-lg-3 col-xl-3 my-auto card__image__footer-first">
                                            <div class="card__image__footer">
                                              <ul class="list-inline my-auto ml-auto price">
                                                <li class="list-inline-item ">                                                    
                                                  ${
                                                    this.proprietes[i].periode
                                                      ? `<h6>${this.proprietes[i].prix!} Fcfa <span> / ${this.proprietes[i]
                                                          .periode!}</span></h6>`
                                                      : `<h6>${this.proprietes[i].prix!} Fcfa</h6>`
                                                  }
                                                  </li>
      
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
      `);

        const classname = `.${this.proprietes[i].reference!}`;
        if (classname.length > 5) {
          $(classname).on('mouseover', function () {
            marker.openPopup();
          });
          $(classname).on('mouseout', function () {
            marker.closePopup();
          });
        }

        marker.on('mouseover', function () {
          marker.openPopup();
        });
        marker.on('mouseout', function () {
          marker.closePopup();
        });
        marker.on('click', () => {
          this.displayDetail(this.proprietes![i]);
        });
      }
    }
    $('.skeleton-content').delay(2000).fadeOut('slow');
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPropriete): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(propriete: IPropriete): void {
    const modalRef = this.modalService.open(ProprieteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.propriete = propriete;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  ngAfterViewInit(): void {
    // Map initialization
    this.map = L.map('map', { attributionControl: true }).setView([14.656875015645937, -14.833755006747824], 7);
    const OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://www.tech-xel.com/" target="_blank">tech xel</a> contributors',
    });
    OpenStreetMap_Mapnik.addTo(this.map);

    // google satellite
    const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      // maxZoom: 13,
      attribution: ' | <a href="https://www.tech-xel.com/" target="_blank">tech xel</a> contributors',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });
    // googleSat.addTo(this.map);

    const baseLayer = {
      'Open Street Map': OpenStreetMap_Mapnik,
      'google Sat': googleSat,
    };

    const options_ = {
      position: 'topleft',
    };

    new L.Control.Layers(baseLayer).setPosition('topleft').addTo(this.map);
    this.map.on('zoomend', () => {
      const zoomLevel = this.map.getZoom();
      if (zoomLevel === 18) {
        googleSat.addTo(this.map);
        this.map.removeLayer(OpenStreetMap_Mapnik);
        this.map.addLayer(googleSat);
      } else if (zoomLevel === 17) {
        OpenStreetMap_Mapnik.addTo(this.map);
        this.map.removeLayer(googleSat);
        this.map.addLayer(OpenStreetMap_Mapnik);
      }
    });

    const urlCoordonnees = new URL(window.location.href);
    if (urlCoordonnees.searchParams.get('lng') && urlCoordonnees.searchParams.get('lat')) {
      // verifier la longitude et la latitude passées depuis url exist dans categories sinon categories = tout
      const lat = urlCoordonnees.searchParams.get('lat');
      const lng = urlCoordonnees.searchParams.get('lng');
      if ($.isNumeric(lat) && $.isNumeric(lng)) {
        const api = `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${lat!}&lon=${lng!}`;
        fetch(api)
          .then(response => response.json())
          .then(json => $('#search').val(json.features[0].properties.display_name));

        this.map.flyTo([urlCoordonnees.searchParams.get('lat'), urlCoordonnees.searchParams.get('lng')], 15);
      } else {
        $('#categories').val('tout');
        const getUrl = window.location;
        const baseUrl = getUrl.protocol + '//' + getUrl.host + '/';
        const monurl = baseUrl + 'recherche';
        window.location.href = monurl;
      }

      const cat = urlCoordonnees.searchParams.get('categories');
      if (cat) {
        // verifier si la categorie passée depuis url exist dans categories sinon categories = tout
        if ($('#categories option[value=' + cat + ']').length > 0) {
          $('#categories').val(cat);
        } else {
          $('#categories').val('tout');
          const newurlCoordonnees = new URL(window.location.href);
          newurlCoordonnees.searchParams.set('categories', 'tout');
          window.history.pushState('object or string', 'Recherches', String(newurlCoordonnees));
        }
        // fin verifier si la categorie passée depuis url exist dans categories sinon categories = tout

        // on verifier si la categorie possede des pieces ou pas et traite
        if (
          $('#categories').val() === 'terrain' ||
          $('#categories').val() === 'chambre' ||
          $('#categories').val() === 'hangar' ||
          $('#categories').val() === 'verger'
        ) {
          $('#nbpiecesBox').hide(0);
          $('#catBox').removeClass('col-sm-12 col-lg-6 col-md-6');
          $('#catBox').addClass('col-12');
        } else {
          $('#nbpiecesBox').show(500);
          $('#catBox').removeClass('col-12');
          $('#catBox').addClass('col-sm-12 col-lg-6 col-md-6');
        }
        // fin on verifier si la categorie possede des pieces ou pas et traite
      }
    } else {
      window.history.pushState('object or string', 'Recherches', 'recherche');
    }

    const nbP = urlCoordonnees.searchParams.get('nbp');
    if (nbP) {
      // verifier si le nbp passée depuis url exist dans nbPieces sinon nbPieces = tout
      if ($('#nbpieces option[value=' + nbP + ']').length > 0) {
        $('#nbpieces').val(nbP);
      } else {
        $('#nbpieces').val('tout');
        const newurlCoordonnees = new URL(window.location.href);
        newurlCoordonnees.searchParams.set('nbp', 'tout');
        window.history.pushState('object or string', 'Recherches', String(newurlCoordonnees));
      }
      // fin verifier si le nbp passée depuis url exist dans nbPieces sinon nbPieces = tout
    }

    $(window).scroll(function () {
      $(this).scrollTop()! >= 225 ? $('.bluebox').fadeIn(100) : $('.bluebox').fadeOut(1);
      $('.bluebox').css({
        width: `${$('.slider__image__detail-large-one').width()!}px`,
      });
    });

    $('.auto-clear').on('click', function () {
      $('#sansAdresse').click();
    });
    initJs();
  }

  goto(): void {
    const cat = $('#categories').val();
    const lat = $('#lng').val();
    const lng = $('#lat').val();

    if ($('#lat').val() !== '' || $('#lng').val() !== '') {
      this.map.flyTo([$('#lng').val(), $('#lat').val()], 15);
    }
    const urlCoordonnees = new URL(window.location.href);
    urlCoordonnees.searchParams.set('lat', String(lat));
    urlCoordonnees.searchParams.set('lng', String(lng));
    urlCoordonnees.searchParams.set('categories', String(cat));
    window.history.pushState('object or string', 'Recherches', String(urlCoordonnees));
    this.proprietefilter();
  }

  // quand on choisit une categorie
  change(): void {
    this.proprietefilter();
    // on desactive l'option nombre de pièces
    const urlCoordonnees = new URL(window.location.href);
    const cat = $('#categories').val();
    const lat = urlCoordonnees.searchParams.get('lat');
    const lng = urlCoordonnees.searchParams.get('lng');
    const nbP = urlCoordonnees.searchParams.get('nbp');
    if (cat === 'terrain' || cat === 'chambre' || cat === 'hangar' || cat === 'verger') {
      $('#nbpieces').val('tout');
      if (nbP !== null) {
        urlCoordonnees.searchParams.delete('nbp');
      }
      $('#nbpiecesBox').hide(0);
      $('#catBox').removeClass('col-sm-12 col-lg-6 col-md-6');
      $('#catBox').addClass('col-12');
    } else {
      $('#nbpiecesBox').show(500);
      $('#catBox').removeClass('col-12');
      $('#catBox').addClass('col-sm-12 col-lg-6 col-md-6');
    }
    // fin on desactive l'option nombre de pièces

    if (lat === '' || lng === '' || lat === null || lng === null) {
      urlCoordonnees.searchParams.append('lat', '14.656875015645937');
      urlCoordonnees.searchParams.append('lng', '-14.833755006747824');
      this.map.flyTo([14.656875015645937, -14.833755006747824], 7);
      urlCoordonnees.searchParams.set('categories', String(cat));
    } else {
      urlCoordonnees.searchParams.set('categories', String(cat));
    }

    window.history.pushState('object or string', 'Recherches', String(urlCoordonnees));
  }

  // quand on choisit le nom de pieces
  changeNbPieces(): void {
    const urlCoordonnees = new URL(window.location.href);
    const nbP = urlCoordonnees.searchParams.get('nbp');
    if (nbP === null) {
      urlCoordonnees.searchParams.append('nbp', String($('#nbpieces').val()));
      window.history.pushState('object or string', 'Recherches', String(urlCoordonnees));
    } else {
      urlCoordonnees.searchParams.set('nbp', String($('#nbpieces').val()));
      window.history.pushState('object or string', 'Recherches', String(urlCoordonnees));
    }
    this.proprietefilter();
  }

  // afficher Détails de la proprièté
  public displayDetail(propriete: IPropriete): void {
    this.proprieteDetail = undefined;
    this.proprieteDetail = propriete;
    $('#resultList').hide(0);
    $('#detail').show(0);
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    $('#nom').val('');
    $('#tel').val('');
    $('#email').val('');
    $('#message').val('');
    this.map.flyTo([propriete.latitude, propriete.longitude], 18);
    let marker: L.Marker<any>;
    const marker_location = L.icon({
      iconUrl: 'content/assets/images/marker_louer.png',
      iconSize: [45, 45],
    });

    const marker_vente = L.icon({
      iconUrl: 'content/assets/images/marker_vendre.png',
      iconSize: [45, 45],
    });
    if (this.proprieteDetail.modeDeTransaction === Transaction.LOCATION) {
      marker = L.marker([this.proprieteDetail.latitude!, this.proprieteDetail.longitude!], {
        icon: marker_location,
      });
    } else {
      marker = L.marker([this.proprieteDetail.latitude!, this.proprieteDetail.longitude!], {
        icon: marker_vente,
      });
    }
    if (this.map2Init === false) {
      const OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://www.tech-xel.com/" target="_blank">tech xel</a> contributors',
      });

      // Map2 initialization
      this.map2 = L.map('map2', { attributionControl: true }).setView([14.656875015645937, -14.833755006747824], 7);
      OpenStreetMap_Mapnik.addTo(this.map2);
      this.map2Init = true;
    }
    $('#map2 .leaflet-marker-icon').remove();
    $('#map2 .leaflet-popup').remove();
    this.map2.setView([this.proprieteDetail.latitude!, this.proprieteDetail.longitude!], 17);
    marker.addTo(this.map2);
    initJs();
  }

  // afficher Détails de la proprièté
  retourner(): void {
    this.proprieteDetail = undefined;
    $('#resultList').show(0);
    $('#detail').hide(0);
    this.map.setZoom(15);
    $('.bluebox').css({
      width: `${$('.slider__image__detail-large-one').width()!}px`,
    });
    initJs();
  }

  lirePlus(): void {
    $('#lire_plus').addClass('visible');
  }

  resolved(captchaResponse: string): void {
    this.recaptcha_ = false;
  }

  tester(): void {
    alert($('#comptant').is(':checked'));
  }

  plusDecriete(): void {
    if ($('.PlusDeCriteres_').is(':visible')) {
      $('.PlusDeCriteres_').hide(500);
    } else {
      $('.PlusDeCriteres_').show(500);
    }
  }

  budget(): void {
    if ($('#budget_min').is(':visible')) {
      $('#budget_min').hide(500);
    } else {
      $('#budget_min').show(500);
    }
    if ($('#budget_max').is(':visible')) {
      $('#budget_max').hide(500);
    } else {
      $('#budget_max').show(500);
    }
  }

  visibiliteCarte(): void {
    if ($('#carte').is(':visible')) {
      $('#carte').animate({ left: '-100%' });
      $('#carte').hide(500);
      $('#carte').animate({ left: '0' });
      $('#resultat').removeClass('col-lg-5');
      $('#resultat').addClass('container');
      $('.grilleVersion2').removeClass('col-md-6');
      $('.grilleVersion2').addClass('col-md-4');
    } else {
      $('#carte').show(500);
      $('#resultat').removeClass('container');
      $('#resultat').addClass('col-lg-5');
      $('.grilleVersion2').removeClass('col-md-4');
      $('.grilleVersion2').addClass('col-md-6');
      initJs();
    }
  }

  fullDetail(): void {
    if ($('#carte').is(':visible')) {
      $('#carte').animate({ left: '-100%' });
      $('#carte').hide(500);
      $('#carte').animate({ left: '0' });
      $('#resultat').removeClass('col-lg-5');
      $('#resultat').addClass('container');
      $('.grilleVersion2').removeClass('col-md-6');
      $('.grilleVersion2').addClass('col-md-4');
      initJs();
    } else {
      $('#carte').show(500);
      $('#resultat').removeClass('container');
      $('#resultat').addClass('col-lg-5');
      $('.grilleVersion2').removeClass('col-md-4');
      $('.grilleVersion2').addClass('col-md-6');
      initJs();
    }
  }

  filtre(): void {
    if ($('#filtre_').is(':visible')) {
      $('#filtre_').slideToggle(500);
    } else {
      $('#filtre_').slideToggle(500);
    }
  }

  message(): void {
    if ($('#nom').val() !== '') {
      if ($('#tel').val() !== '') {
        if ($('#email').val() !== '') {
          $('#message').val(`Bonjour,
Je m’appelle ${String($('#nom').val())}, je suis intéressé(e) par  ${String(
            this.modifierType(String(this.proprieteDetail?.type))
          )} ayant pour référence ${String(this.proprieteDetail?.reference)}.
Je souhaite être contacter au ${String($('#tel').val())} ou par email : ${String($('#email').val())} le plutôt possible.

Bien cordialement`);
        } else {
          $('#message').val('');
        }
      } else {
        $('#message').val('');
      }
    } else {
      $('#message').val('');
    }
  }

  modifierType(val: any): any {
    if (val === 'MAISON') {
      val = 'la maison';
    } else if (val === 'APPARTEMENT') {
      val = "l'appartement";
    } else if (val === 'TERRAIN') {
      val = 'le terrain';
    } else if (val === 'VERGER') {
      val = 'le verger';
    } else if (val === 'HANGAR') {
      val = "l'hangar";
    } else if (val === 'BUREAU') {
      val = 'le bureau';
    } else if (val === 'CHAMBRE') {
      val = 'la chambre';
    } else if (val === 'LOCAL_DE_COMMERCE') {
      val = 'le local de commerce';
    }
    return val;
  }
}
