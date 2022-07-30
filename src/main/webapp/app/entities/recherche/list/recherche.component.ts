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
import { DetailPropriete } from 'app/entities/detail-propriete/detail-propriete.model';
import { TypeDeBien } from 'app/entities/enumerations/type-de-bien.model';
import { EmailService } from 'app/email.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  sansFiltre = false;
  alertMessage = false;
  propriteInitialise = false;
  alerter = false;
  nomCommande = '';
  telCommande = '';
  emailCommande = '';
  refCommande = '';
  messageCommande = '';
  TelAlerte = '';
  EmailAlerte = '';
  alertFormGroup!: FormGroup;
  commandeFormGroup!: FormGroup;
  recaptchaContenu: string;
  private map: any;
  private map2: any;

  constructor(
    protected proprieteService: ProprieteService,
    protected emailService: EmailService,
    protected dataUtils: DataUtils,
    protected rechercheService: RechercheService,
    protected modalService: NgbModal
  ) {
    this.recaptchaContenu = '';
  }

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
    const urlCoordonnees = new URL(window.location.href);
    const sansfiltre = urlCoordonnees.searchParams.get('sansfiltre');
    if (sansfiltre) {
      if (sansfiltre === 'true') {
        this.sansOptionFiltre();
      }
    }
    if (this.propriteInitialise === true) {
      this.propriteInitialise = false;
      const ref = urlCoordonnees.searchParams.get('ref');
      if (ref) {
        this.proprietesInitial?.forEach(propr => {
          if (propr.reference === ref) {
            this.displayDetail(propr);
          }
        });
      }
    }
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

    const urlCoordonnees = new URL(window.location.href);
    if ($('#meuble').is(':checked')) {
      const mbl = urlCoordonnees.searchParams.get('mbl');
      if (mbl === null) {
        urlCoordonnees.searchParams.append('mbl', 'true');
      }

      this.proprietes = this.proprietes?.filter(function (prop) {
        if (prop.meuble) {
          return prop.meuble;
        } else {
          return false;
        }
      });
    } else {
      urlCoordonnees.searchParams.delete('mbl');
    }

    if ($('#eau').is(':checked')) {
      const eau = urlCoordonnees.searchParams.get('eau');
      if (eau === null) {
        urlCoordonnees.searchParams.append('eau', 'true');
      }
      this.proprietes = this.proprietes?.filter(function (prop) {
        if (prop.accesEau) {
          return prop.accesEau;
        } else {
          return false;
        }
      });
    } else {
      urlCoordonnees.searchParams.delete('eau');
    }

    if ($('#adsl').is(':checked')) {
      const adsl = urlCoordonnees.searchParams.get('adsl');
      if (adsl === null) {
        urlCoordonnees.searchParams.append('adsl', 'true');
      }
      this.proprietes = this.proprietes?.filter(function (prop) {
        if (prop.accesADSL) {
          return prop.accesADSL;
        } else {
          return false;
        }
      });
    } else {
      urlCoordonnees.searchParams.delete('adsl');
    }

    if ($('#electricite').is(':checked')) {
      const elect = urlCoordonnees.searchParams.get('elect');
      if (elect === null) {
        urlCoordonnees.searchParams.append('elect', 'true');
      }
      this.proprietes = this.proprietes?.filter(function (prop) {
        if (prop.acceEelectricite) {
          return prop.acceEelectricite;
        } else {
          return false;
        }
      });
    } else {
      urlCoordonnees.searchParams.delete('elect');
    }

    if ($('#moratoire').is(':checked')) {
      urlCoordonnees.searchParams.delete('compt');
      const mora = urlCoordonnees.searchParams.get('mora');
      if (mora === null) {
        urlCoordonnees.searchParams.append('mora', 'true');
      }
      this.proprietes = this.proprietes?.filter(function (prop) {
        if (prop.modeDePaiement) {
          return prop.modeDePaiement === 'MORATOIRE';
        } else {
          return false;
        }
      });
    } else {
      urlCoordonnees.searchParams.delete('mora');
    }

    if ($('#comptant').is(':checked')) {
      urlCoordonnees.searchParams.delete('mora');
      const compt = urlCoordonnees.searchParams.get('compt');
      if (compt === null) {
        urlCoordonnees.searchParams.append('compt', 'true');
      }
      this.proprietes = this.proprietes?.filter(function (prop) {
        if (prop.modeDePaiement) {
          return prop.modeDePaiement === 'COMPTANT';
        } else {
          return false;
        }
      });
    } else {
      urlCoordonnees.searchParams.delete('compt');
    }

    if ($('#max').val()) {
      const max = urlCoordonnees.searchParams.get('max');
      if (max === null) {
        urlCoordonnees.searchParams.append('max', String($('#max').val()));
      } else {
        if ($.isNumeric(max)) {
          urlCoordonnees.searchParams.set('max', String($('#max').val()));
        } else {
          urlCoordonnees.searchParams.delete('max');
        }
      }
      this.proprietes = this.proprietes?.filter(function (prop) {
        return prop.prix! <= $('#max').val()!;
      });
    } else {
      urlCoordonnees.searchParams.delete('max');
    }

    if ($('#min').val()) {
      const min = urlCoordonnees.searchParams.get('min');
      if (min === null) {
        urlCoordonnees.searchParams.append('min', String($('#min').val()));
      } else {
        if ($.isNumeric(min)) {
          urlCoordonnees.searchParams.set('min', String($('#min').val()));
        } else {
          urlCoordonnees.searchParams.delete('min');
        }
      }
      this.proprietes = this.proprietes?.filter(function (prop) {
        return prop.prix! >= $('#min').val()!;
      });
    } else {
      urlCoordonnees.searchParams.delete('min');
    }

    const transac = urlCoordonnees.searchParams.get('transac');
    this.proprietes = this.proprietes?.filter(function (prop) {
      if (transac === 'louer') {
        return prop.modeDeTransaction === Transaction.LOCATION;
      } else if (transac === 'vendre') {
        return prop.modeDeTransaction === Transaction.VENDRE;
      } else {
        return true;
      }
    });

    window.history.pushState('object or string', 'Recherches', String(urlCoordonnees));

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
        this.propriteInitialise = true;
      },
      error: () => {
        this.isLoading = false;
      },
    });
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
      return 'local commercial';
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
    $('.skeleton-content').delay(1500).fadeOut('slow');
  }

  ngOnInit(): void {
    this.alertFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      tel: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9)]),
    });
    this.commandeFormGroup = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      tel: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9)]),
    });
    const urlCoordonnees = new URL(window.location.href);
    const carte = urlCoordonnees.searchParams.get('carte');
    if (carte) {
      if (carte === 'false') {
        this.fullDetail();
      }
    }
    const sansfiltre = urlCoordonnees.searchParams.get('sansfiltre');
    if (sansfiltre) {
      if (sansfiltre === 'true') {
        this.sansOptionFiltre();
      }
    }

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
      if (lat !== '14.656875015645937' && lng !== '-14.833755006747824') {
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
      }
    } else {
      urlCoordonnees.searchParams.append('lat', '14.656875015645937');
      urlCoordonnees.searchParams.append('lng', '-14.833755006747824');
      this.map.flyTo([14.656875015645937, -14.833755006747824], 7);
      // window.history.pushState('object or string', 'Recherches', 'recherche');
      window.history.pushState('object or string', 'Recherches', String(urlCoordonnees));
    }

    const sansfiltre = urlCoordonnees.searchParams.get('sansfiltre');
    if (sansfiltre) {
      if (sansfiltre === 'true') {
        this.sansOptionFiltre();
      }
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

    const mbl = urlCoordonnees.searchParams.get('mbl');
    if (mbl === 'true') {
      $('#meuble').prop('checked', true);
    }
    const eau = urlCoordonnees.searchParams.get('eau');
    if (eau) {
      $('#eau').prop('checked', true);
    }
    const elect = urlCoordonnees.searchParams.get('elect');
    if (elect === 'true') {
      $('#electricite').prop('checked', true);
    }
    const adsl = urlCoordonnees.searchParams.get('adsl');
    if (adsl === 'true') {
      $('#adsl').prop('checked', true);
    }
    const mora = urlCoordonnees.searchParams.get('mora');
    if (mora === 'true') {
      $('#moratoire').prop('checked', true);
    }
    const compt = urlCoordonnees.searchParams.get('compt');
    if (compt === 'true') {
      $('#comptant').prop('checked', true);
    }

    const carte = urlCoordonnees.searchParams.get('carte');
    if (carte) {
      if (carte === 'false') {
        this.fullDetail();
      }
    }
    const transac = urlCoordonnees.searchParams.get('transac');
    if (transac) {
      if (transac === 'vendre') {
        this.transaction(transac);
      } else if (transac === 'louer') {
        this.transaction(transac);
      } else {
        this.transaction('tout');
      }
    }

    const max = urlCoordonnees.searchParams.get('max');
    if (max) {
      if ($.isNumeric(max)) {
        $('#max').val(max);
      }
    }
    const min = urlCoordonnees.searchParams.get('min');
    if (min) {
      if ($.isNumeric(min)) {
        $('#min').val(min);
      }
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
    const urlCoordonnees = new URL(window.location.href);
    const ref = urlCoordonnees.searchParams.get('ref');
    if (!ref) {
      urlCoordonnees.searchParams.append('ref', this.proprieteDetail.reference!);
    } else {
      urlCoordonnees.searchParams.set('ref', this.proprieteDetail.reference!);
    }
    window.history.pushState('object or string', 'Recherches', String(urlCoordonnees));
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
    const urlCoordonnees = new URL(window.location.href);
    urlCoordonnees.searchParams.delete('ref');
    window.history.pushState('object or string', 'Recherches', String(urlCoordonnees));
    this.proprieteDetail = undefined;
    $('#resultList').show(0);
    $('#detail').hide(0);
    this.map.setZoom(15);
    $('.bluebox').css({
      width: `${$('.slider__image__detail-large-one').width()!}px`,
    });
    const sansfiltre = urlCoordonnees.searchParams.get('sansfiltre');
    if (sansfiltre) {
      if (sansfiltre !== 'true') {
        $('#zoneFiltreOptions').show();
      }
    } else {
      $('#zoneFiltreOptions').show();
    }

    initJs();
  }

  lirePlus(): void {
    $('#lire_plus').addClass('visible');
  }

  resolved(captchaResponse: string): void {
    this.recaptchaContenu = captchaResponse;
  }

  commander(): void {
    if (this.recaptchaContenu === '') {
      this.recaptcha_ = false;
      setTimeout(() => {
        this.recaptcha_ = true;
      }, 3000);
    } else {
      this.alerter = true;
      const ref = this.proprieteDetail?.reference;
      const message = this.message();
      this.commandeMAIL(this.emailCommande, this.telCommande, String(ref), String(message));
      this.nomCommande = '';
      this.emailCommande = '';
      this.telCommande = '';
      this.messageCommande = '';
      this.commandeFormGroup.reset();
      $('#message').val('');
      setTimeout(() => {
        this.alerter = false;
      }, 6000);
    }
  }

  tester(): void {
    this.emailService.envoyeremail('xamalteam@gmail.com', 'mon sujet', 'mon message dynamique').subscribe();
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
    const urlCoordonnees = new URL(window.location.href);
    if ($('#carte').is(':visible')) {
      const carte = urlCoordonnees.searchParams.get('carte');
      if (!carte) {
        urlCoordonnees.searchParams.append('carte', 'false');
      }
      $('#carte').animate({ left: '-100%' });
      $('#carte').hide(0);
      $('#carte').animate({ left: '0' });
      $('#resultat').removeClass('col-lg-5');
      $('#resultat').addClass('container');
      $('.grilleVersion2').removeClass('col-md-6');
      $('.grilleVersion2').addClass('col-md-4');
    } else {
      urlCoordonnees.searchParams.delete('carte');
      $('#carte').show(0);
      $('#resultat').removeClass('container');
      $('#resultat').addClass('col-lg-5');
      $('.grilleVersion2').removeClass('col-md-4');
      $('.grilleVersion2').addClass('col-md-6');
      initJs();
    }
    window.history.pushState('object or string', 'Recherches', String(urlCoordonnees));
  }

  fullDetail(): void {
    const urlCoordonnees = new URL(window.location.href);
    if ($('#carte').is(':visible')) {
      const carte = urlCoordonnees.searchParams.get('carte');
      if (!carte) {
        urlCoordonnees.searchParams.append('carte', 'false');
      }
      $('#carte').animate({ left: '-100%' });
      $('#carte').hide(0);
      $('#carte').animate({ left: '0' });
      $('#resultat').removeClass('col-lg-5');
      $('#resultat').addClass('container');
      $('.grilleVersion2').removeClass('col-md-6');
      $('.grilleVersion2').addClass('col-md-4');
      initJs();
    } else {
      urlCoordonnees.searchParams.delete('carte');
      $('#carte').show(0);
      $('#resultat').removeClass('container');
      $('#resultat').addClass('col-lg-5');
      $('.grilleVersion2').removeClass('col-md-4');
      $('.grilleVersion2').addClass('col-md-6');
      initJs();
    }
    window.history.pushState('object or string', 'Recherches', String(urlCoordonnees));
  }

  sansOptionFiltre(): void {
    $('#footer').hide();
    $('#zoneFiltreOptions').hide();
    $('#map').hide();
    $('.grilleVersion2').removeClass('col-md-6');
    $('.grilleVersion2').addClass('col-md-4');
  }

  transaction(val: string): void {
    const urlCoordonnees = new URL(window.location.href);
    const transac = urlCoordonnees.searchParams.get('transac');
    if (!transac) {
      urlCoordonnees.searchParams.append('transac', val);
    } else {
      urlCoordonnees.searchParams.set('transac', val);
    }
    if (transac === 'vendre') {
      $('#transacTout').removeClass('active');
      $('#transacVendre').addClass('active');
      $('#transacLouer').removeClass('active');
    } else if (transac === 'louer') {
      $('#transacTout').removeClass('active');
      $('#transacVendre').removeClass('active');
      $('#transacLouer').addClass('active');
    } else {
      $('#transacTout').addClass('active');
      $('#transacVendre').removeClass('active');
      $('#transacLouer').removeClass('active');
    }

    window.history.pushState('object or string', 'Recherches', String(urlCoordonnees));
    this.proprietefilter();
  }

  filtre(): void {
    if ($('#filtre_').is(':visible')) {
      $('#filtre_').slideToggle(500);
    } else {
      $('#filtre_').slideToggle(500);
    }
  }

  message(): string {
    if ($('#nom').val() !== '') {
      if ($('#tel').val() !== '') {
        if ($('#email').val() !== '') {
          const messageAenvoyer = `Bonjour,
    Je m’appelle ${String($('#nom').val())}, je suis intéressé(e) par  ${String(
            this.modifierType(String(this.proprieteDetail?.type))
          )} ayant pour référence ${String(this.proprieteDetail?.reference)}.
    Je souhaite être contacter au ${String($('#tel').val())} ou par email : ${String($('#email').val())} le plutôt possible.
    Bien cordialement`;
          $('#message').val(messageAenvoyer);
          return messageAenvoyer;
        } else {
          $('#message').val('');
        }
      } else {
        $('#message').val('');
      }
    } else {
      $('#message').val('');
    }
    return '';
  }

  activerAlerte(): void {
    this.alertMessage = true;
    const tel = this.TelAlerte;
    const email = this.EmailAlerte;
    const urlCoordonnees = new URL(window.location.href);
    this.alertMAIL(email, tel, String(urlCoordonnees));
    this.EmailAlerte = '';
    this.TelAlerte = '';
    this.alertFormGroup.reset();
    setTimeout(() => {
      this.alertMessage = false;
    }, 3000);
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
      val = 'le local commercial';
    }
    return val;
  }

  interretBienMAIL(nom: string, email: string, tel: string, message: string): void {
    this.emailService
      .envoyeremail(
        'xamalteam@gmail.com',
        'Interet pour un bien',
        `
    <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;"
	bgcolor="#F0F0F0">
  <br>
<!-- WRAPPER -->
<!-- Set wrapper width (twice) -->
<table border="0" cellpadding="0" cellspacing="0" align="center"
	width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
	max-width: 560px;" class="wrapper">

<!-- End of WRAPPER -->
</table>

<!-- WRAPPER / CONTEINER -->
<!-- Set conteiner background color -->
<table border="0" cellpadding="0" cellspacing="0" align="center"
	bgcolor="#FFFFFF"
	width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
	max-width: 560px;" class="container">

	<!-- HERO IMAGE -->
	<!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 (wrapper x2). Do not set height for flexible images (including "auto"). URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Ìmage-Name}}&utm_campaign={{Campaign-Name}} -->
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
			padding-top: 20px;" class="hero"><a target="_blank" style="text-decoration: none;"
			href="https://www.tech-xel.com"><img border="0" vspace="0" hspace="0"
			src="https://tech-xel.com/model/logo_v6.png"
			alt="Please enable images to view this content" title="Tech Xel"
			width="560" style="
			width: 100%;
			max-width: 560px;
			color: #000000; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"/></a></td>
	</tr>

	<!-- PARAGRAPH -->
	<!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
	<tr>
		<td align="left" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
			padding-top: 25px; 
			color: #000000;
			font-family: sans-serif;" class="paragraph">
				Bonjour Monsieur, Madame,<br/><br/>
				Ce client a utilisé le formulaire de contact de <b style="color: #32B019;">BUNTU</b><br/>
        <b>Données enregistrées : </b><br>
        Tom :  <b style="color: #32B019;">${nom}</b><br>
        Tel : <b style="color: #32B019;">${tel}</b><br>
        Email : <b style="color: #32B019;">${email}</b><br>
        Message : <b style="color: #32B019;"><br>${message}</b><br>
				
		</td>
	</tr>

	<!-- LIST -->
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%;" class="list-item">
			
	</td>
	</tr>

	<!-- LINE -->
	<!-- Set line color -->
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
			padding-top: 25px;" class="line"><hr
			color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
		</td>
	</tr>

	

<!-- End of WRAPPER -->
<br>
</table>

</td></tr>
<br>
</table>
    `
      )
      .subscribe();
  }

  alertMAIL(email: string, tel: string, url: string): void {
    this.emailService
      .envoyeremail(
        'xamalteam@gmail.com',
        'activation Alerte',
        `
    <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;"
	bgcolor="#F0F0F0">
  <br>
<!-- WRAPPER -->
<!-- Set wrapper width (twice) -->
<table border="0" cellpadding="0" cellspacing="0" align="center"
	width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
	max-width: 560px;" class="wrapper">

<!-- End of WRAPPER -->
</table>

<!-- WRAPPER / CONTEINER -->
<!-- Set conteiner background color -->
<table border="0" cellpadding="0" cellspacing="0" align="center"
	bgcolor="#FFFFFF"
	width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
	max-width: 560px;" class="container">

	<!-- HERO IMAGE -->
	<!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 (wrapper x2). Do not set height for flexible images (including "auto"). URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Ìmage-Name}}&utm_campaign={{Campaign-Name}} -->
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
			padding-top: 20px;" class="hero"><a target="_blank" style="text-decoration: none;"
			href="https://www.tech-xel.com"><img border="0" vspace="0" hspace="0"
			src="https://tech-xel.com/model/logo_v6.png"
			alt="Please enable images to view this content" title="Tech Xel"
			width="560" style="
			width: 100%;
			max-width: 560px;
			color: #000000; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"/></a></td>
	</tr>

	<!-- PARAGRAPH -->
	<!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
	<tr>
		<td align="left" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
			padding-top: 25px; 
			color: #000000;
			font-family: sans-serif;" class="paragraph">
				Bonjour Monsieur, Madame,<br/><br/>
				Ce client vient d'activer un alerte dans <b style="color: #32B019;">BUNTU</b><br/>
        <b>Données enregistrées : </b><br>
        Tel : <b style="color: #32B019;">${tel}</b><br>
        Email : <b style="color: #32B019;">${email}</b><br>
        URL : <b style="color: #32B019;"><br>${url}</b><br>
				
		</td>
	</tr>

	<!-- LIST -->
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%;" class="list-item">
			
	</td>
	</tr>

	<!-- LINE -->
	<!-- Set line color -->
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
			padding-top: 25px;" class="line"><hr
			color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
		</td>
	</tr>

	

<!-- End of WRAPPER -->
<br>
</table>

</td></tr>
<br>
</table>
    `
      )
      .subscribe();
  }

  commandeMAIL(email: string, tel: string, ref: string, message: string): void {
    this.emailService
      .envoyeremail(
        'xamalteam@gmail.com',
        'Commande de bien',
        `
    <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;"
	bgcolor="#F0F0F0">
  <br>
<!-- WRAPPER -->
<!-- Set wrapper width (twice) -->
<table border="0" cellpadding="0" cellspacing="0" align="center"
	width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
	max-width: 560px;" class="wrapper">

<!-- End of WRAPPER -->
</table>

<!-- WRAPPER / CONTEINER -->
<!-- Set conteiner background color -->
<table border="0" cellpadding="0" cellspacing="0" align="center"
	bgcolor="#FFFFFF"
	width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
	max-width: 560px;" class="container">

	<!-- HERO IMAGE -->
	<!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 (wrapper x2). Do not set height for flexible images (including "auto"). URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Ìmage-Name}}&utm_campaign={{Campaign-Name}} -->
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
			padding-top: 20px;" class="hero"><a target="_blank" style="text-decoration: none;"
			href="https://www.tech-xel.com"><img border="0" vspace="0" hspace="0"
			src="https://tech-xel.com/model/logo_v6.png"
			alt="Please enable images to view this content" title="Tech Xel"
			width="560" style="
			width: 100%;
			max-width: 560px;
			color: #000000; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"/></a></td>
	</tr>

	<!-- PARAGRAPH -->
	<!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
	<tr>
		<td align="left" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
			padding-top: 25px; 
			color: #000000;
			font-family: sans-serif;" class="paragraph">
				Bonjour Monsieur, Madame,<br/><br/>
				Ce client vient d'activer un alerte dans <b style="color: #32B019;">BUNTU</b><br/>
        <b>Données enregistrées : </b><br>
        Tel : <b style="color: #32B019;">${tel}</b><br>
        ref : <b style="color: #32B019;">${ref}</b><br>
        Email : <b style="color: #32B019;">${email}</b><br>
        URL : <b style="color: #32B019;"><br>${message}</b><br>
				
		</td>
	</tr>

	<!-- LIST -->
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%;" class="list-item">
			
	</td>
	</tr>

	<!-- LINE -->
	<!-- Set line color -->
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
			padding-top: 25px;" class="line"><hr
			color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
		</td>
	</tr>

	

<!-- End of WRAPPER -->
<br>
</table>

</td></tr>
<br>
</table>
    `
      )
      .subscribe();
  }

  newsletterMAIL(email: string): void {
    this.emailService
      .envoyeremail(
        'xamalteam@gmail.com',
        'NewsLetters',
        `
    <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;"
	bgcolor="#F0F0F0">
  <br>
<!-- WRAPPER -->
<!-- Set wrapper width (twice) -->
<table border="0" cellpadding="0" cellspacing="0" align="center"
	width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
	max-width: 560px;" class="wrapper">

<!-- End of WRAPPER -->
</table>

<!-- WRAPPER / CONTEINER -->
<!-- Set conteiner background color -->
<table border="0" cellpadding="0" cellspacing="0" align="center"
	bgcolor="#FFFFFF"
	width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
	max-width: 560px;" class="container">

	<!-- HERO IMAGE -->
	<!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 (wrapper x2). Do not set height for flexible images (including "auto"). URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Ìmage-Name}}&utm_campaign={{Campaign-Name}} -->
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
			padding-top: 20px;" class="hero"><a target="_blank" style="text-decoration: none;"
			href="https://www.tech-xel.com"><img border="0" vspace="0" hspace="0"
			src="https://tech-xel.com/model/logo_v6.png"
			alt="Please enable images to view this content" title="Tech Xel"
			width="560" style="
			width: 100%;
			max-width: 560px;
			color: #000000; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"/></a></td>
	</tr>

	<!-- PARAGRAPH -->
	<!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
	<tr>
		<td align="left" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
			padding-top: 25px; 
			color: #000000;
			font-family: sans-serif;" class="paragraph">
				Bonjour Monsieur, Madame,<br/><br/>
				Ce client souhaite être ajouté à la liste des newsletter de <b style="color: #32B019;">BUNTU</b><br/>
        <b>Données enregistrées : </b><br>
        Email : <b style="color: #32B019;">${email}</b><br>
				
		</td>
	</tr>

	<!-- LIST -->
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%;" class="list-item">
			
	</td>
	</tr>

	<!-- LINE -->
	<!-- Set line color -->
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
			padding-top: 25px;" class="line"><hr
			color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
		</td>
	</tr>

	

<!-- End of WRAPPER -->
<br>
</table>

</td></tr>
<br>
</table>
    `
      )
      .subscribe();
  }
}
