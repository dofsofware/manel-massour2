import { Component, OnInit, OnDestroy, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { default as initJs } from '../../content/assets/js/index.bundle.js';
import $ from 'jquery';
import { EmailService } from 'app/email.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IPropriete } from 'app/entities/propriete/propriete.model.js';
import { ProprieteService } from 'app/entities/propriete/service/propriete.service';

import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  account: Account | null = null;
  proprietes?: IPropriete[];
  newslettersFormGroup!: FormGroup;
  alerter = false;
  charge = false;
  isLoading = false;
  public email: string;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private proprieteService: ProprieteService,
    private emailService: EmailService,
    private accountService: AccountService,
    private router: Router
  ) {
    this.email = '';
  }
  ngAfterViewChecked(): void {
    if (this.proprietes!.length > 0 && this.charge === false) {
      initJs();
      this.charge = true;
    }
  }

  trackId(_index: number, item: IPropriete): number {
    return item.id!;
  }

  loadAll(): void {
    this.isLoading = true;

    this.proprieteService.query().subscribe({
      next: (res: HttpResponse<IPropriete[]>) => {
        this.isLoading = false;
        this.proprietes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  displayDetail(propriete: IPropriete): void {
    const getUrl = window.location;
    const baseUrl = getUrl.protocol + '//' + getUrl.host + '/';
    const monurl =
      baseUrl + '/recherche?lat=' + String(propriete.latitude) + '&lng=' + String(propriete.longitude) + '&ref=' + propriete.reference!;
    window.location.href = monurl;
  }

  ngAfterViewInit(): void {
    let montimer: any;
    let running = false;
    let level = 0;
    let lastText = '';
    let nom = '';
    let tel = '';
    let email = '';
    let souhaiteFaire = '';
    let categorie = '';
    let budgetmax = '';
    let budgetmin = '';
    let accesEau_ = false;
    let accesElect_ = false;
    let accesADSL_ = false;
    $('#envoyerRep').on('click', function () {
      send();
    });

    function send(): void {
      if (running === true) {
        return;
      }
      const msg = $('#message').val();
      if (msg === '') {
        return;
      }
      running = true;
      addMsg(msg);
      lastText = String(msg);
      if (level === 1) {
        if (String(msg).toUpperCase() === 'OUI') {
          lastText = 'OUI';
          connaissanceOui();
        } else if (String(msg).toUpperCase() === 'NON') {
          lastText = 'NON';
          connaissanceNon();
        } else {
          setTimeout(addResponseMsg, 1500, `Vous êtes prier de répondre par OUI ou NON SVP`);
        }
      } else if (level === 2) {
        nom = String(msg);
        clientNom();
      } else if (level === 3) {
        tel = String(msg);
        clientTel();
      } else if (level === 4) {
        email = String(msg);
        clientEmail();
      } else if (level === 5) {
        if (String(msg).toUpperCase() === 'ACHETER') {
          lastText = 'ACHETER';
          acheter();
        } else if (String(msg).toUpperCase() === 'LOUER') {
          lastText = 'LOUER';
          louer();
        } else if (String(msg).toUpperCase() === 'EXPOSER UN BIEN') {
          lastText = 'EXPOSER UN BIEN';
          exposer();
        } else {
          setTimeout(addResponseMsg, 1500, `Vous êtes prier de répondre par ACHETER, LOUER ou EXPOSER UN BIEN SVP`);
        }
      } else if (level === 6) {
        if (String(msg).toUpperCase() !== '') {
          setTimeout(addResponseMsg, 1500, `Merci de selectionner une catégorie et de cliquer valider SVP`);
        }
      } else if (level === 8) {
        if (msg && msg !== '') {
          budgetmin = String(msg);
          saisieMax();
        }
      } else if (level === 9) {
        if (msg && msg !== '') {
          budgetmax = String(msg);
          accessEau();
        }
      }
    }

    function addMsg(msg: any): void {
      const div = document.createElement('div');
      div.innerHTML = "<span style='flex-grow:1'></span><div class='chat-message-sent'>" + String(msg) + '</div>';
      div.className = 'chat-message-div';
      $('#message-box').append(div);
      // SEND MESSAGE TO API
      $('#message').val('');
      $('#message-box').scrollTop(9999999);
    }

    function addResponseMsg(msg: any): void {
      // .includes("text-typing")
      const div = document.createElement('div');
      div.innerHTML = "<div class='chat-message-received'>" + String(msg) + '</div>';
      div.className = 'chat-message-div';
      $('#message-box').append(div);
      $('#message-box').scrollTop(9999999);
      running = false;
    }

    function typing(timer: any): void {
      clearTimeout(montimer);
      const div = document.createElement('div');
      div.innerHTML = '...';
      div.className = 'text-typing';
      $('#message-box').append(div);

      montimer = setTimeout(() => {
        $('.text-typing').remove();
      }, timer);

      $('#message-box').scrollTop(9999999);
    }

    document.getElementById('message')!.addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        send();
      }
    });

    $('#chatbot_toggleBox').on('click', function () {
      if (document.getElementById('chatbot')!.classList.contains('collapsed_')) {
        $('#chatbot_toggle').toggleClass('bounce');
        document.getElementById('chatbot')!.classList.remove('collapsed_');
        $('#chatbot_toggle').children().first().css('display', 'none');
        $('#chatbot_toggle').children().first().next().css('display', '');

        if (level === 0) {
          typing(900);
          setTimeout(addResponseMsg, 1000, 'Bonjour, bienvenue dans Buntu real estate. Avons nous déjà fait connaissance ?');
          setTimeout(
            addResponseMsg,
            1500,
            `<button type="button" class="btn btn-success" id="connaissanceNon">Non</button> 
          <button type="button" class="btn btn-success" id="connaissanceOui">Oui</button>`
          );
          level = 1;
        }
      } else {
        $('#chatbot_toggle').toggleClass('bounce');
        document.getElementById('chatbot')!.classList.add('collapsed_');
        $('#chatbot_toggle').children().first().css('display', '');
        $('#chatbot_toggle').children().first().next().css('display', 'none');
      }
    });

    $('#message-box').on('click', '#connaissanceNon', function () {
      connaissanceNon();
    });
    $('#message-box').on('click', '#connaissanceOui', function () {
      connaissanceOui();
    });
    $('#message-box').on('click', '#acheter', function () {
      souhaiteFaire = 'vendre';
      acheter();
    });
    $('#message-box').on('click', '#exposer', function () {
      souhaiteFaire = 'exposer';
      exposer();
    });
    $('#message-box').on('click', '#louer', function () {
      souhaiteFaire = 'louer';
      louer();
    });
    $('#message-box').on('click', '#validerCategorie', function () {
      if (level === 6) {
        level = 7;
        if ($('#tout').is(':checked')) {
          categorie = 'tout';
          addMsg('Toutes catégories');
        } else if ($('#terrain').is(':checked')) {
          categorie = 'terrain';
          addMsg('Terrain');
        } else if ($('#maison').is(':checked')) {
          categorie = 'maison';
          addMsg('Maison');
        } else if ($('#chambre').is(':checked')) {
          categorie = 'chambre';
          addMsg('Chambre');
        } else if ($('#bureau').is(':checked')) {
          categorie = 'bureau';
          addMsg('Bureau');
        } else if ($('#appartement').is(':checked')) {
          categorie = 'appartement';
          addMsg('Appartement');
        } else if ($('#commerce').is(':checked')) {
          categorie = 'commerce';
          addMsg('Local commercial');
        } else if ($('#verger').is(':checked')) {
          categorie = 'verger';
          addMsg('Verger');
        } else if ($('#hangar').is(':checked')) {
          categorie = 'hangar';
          addMsg('Hangar');
        }
        definirFouchette();
      }
    });
    $('#message-box').on('click', '#budgetNon', function () {
      if (level !== 10) {
        level = 9;
        addMsg('Non');
        accessEau();
      }
    });
    $('#message-box').on('click', '#budgetOui', function () {
      if (level === 7) {
        level = 8;
        if (lastText !== 'OUI') {
          addMsg('Oui');
        }
        saisieMin();
      }
    });
    $('#message-box').on('click', '#accesEauNon', function () {
      if (level !== 12) {
        level = 11;
        addMsg('Non');
        accessElect();
      }
    });
    $('#message-box').on('click', '#accessEauOui', function () {
      if (level === 10) {
        level = 11;
        if (lastText !== 'OUI') {
          addMsg('Oui');
        }
        accesEau_ = true;
        accessElect();
      }
    });
    $('#message-box').on('click', '#accesElectNon', function () {
      if (level === 12) {
        level = 13;
        addMsg('Non');
        accessAdsl();
      }
    });
    $('#message-box').on('click', '#accessElectOui', function () {
      if (level === 12) {
        level = 13;
        if (lastText !== 'OUI') {
          addMsg('Oui');
        }
        accesElect_ = true;
        accessAdsl();
      }
    });
    $('#message-box').on('click', '#accesADSLNon', function () {
      if (level === 14) {
        level = 15;
        addMsg('Non');
        generateUrl();
      }
    });
    $('#message-box').on('click', '#accessADSLOui', function () {
      if (level === 14) {
        level = 15;
        if (lastText !== 'OUI') {
          addMsg('Oui');
        }
        accesADSL_ = true;
        generateUrl();
      }
    });

    function generateUrl(): void {
      const getUrl = window.location;
      const baseUrl = getUrl.protocol + '//' + getUrl.host + '/';
      let monurl = baseUrl + 'recherche';
      monurl = monurl.concat(`?categories=${categorie}`);
      if (budgetmax) {
        monurl = monurl.concat(`&max=${budgetmax}`);
      }
      if (budgetmin) {
        monurl = monurl.concat(`&min=${budgetmin}`);
      }
      if (accesEau_ === true) {
        monurl = monurl.concat(`&eau=${String(accesEau_)}`);
      }
      if (accesElect_ === true) {
        monurl = monurl.concat(`&elect=${String(accesElect_)}`);
      }
      if (accesADSL_ === true) {
        monurl = monurl.concat(`&adsl=${String(accesADSL_)}`);
      }
      if (souhaiteFaire === 'vendre' || souhaiteFaire === 'louer') {
        monurl = monurl.concat(`&transac=${String(souhaiteFaire)}`);
      }
      // window.location.href = monurl;
      setTimeout(addResponseMsg, 1000, `Vous pourrez peaufiner votre recherche en <a href="${monurl}">cliquant ici</a>`);
      // addResponseMsg(`
      // fin
      // souhaiteFaire = ${souhaiteFaire}<br>
      // categorie = ${categorie}<br>
      // budgetmax = ${budgetmax}<br>
      // budgetmin = ${budgetmin}<br>
      // accesEau_ = ${String(accesEau_)}<br>
      // accesElect_ = ${String(accesElect_)}<br>
      // accesADSL_ = ${String(accesADSL_)}<br>
      // `);
    }

    function accessEau(): void {
      if (level === 9) {
        level = 10;
        typing(900);
        setTimeout(addResponseMsg, 1000, "Souhaitez vous voir que les Biens ayant un accèss à l'eau ?");
        setTimeout(
          addResponseMsg,
          1500,
          `<button type="button" class="btn btn-success" id="accesEauNon">Non</button> 
          <button type="button" class="btn btn-success" id="accessEauOui">Oui</button>`
        );
      }
    }

    function accessElect(): void {
      if (level === 11) {
        level = 12;
        typing(900);
        setTimeout(addResponseMsg, 1000, "Souhaitez vous voir que les Biens ayant un accèss à l'électricité ?");
        setTimeout(
          addResponseMsg,
          1500,
          `<button type="button" class="btn btn-success" id="accesElectNon">Non</button> 
          <button type="button" class="btn btn-success" id="accessElectOui">Oui</button>`
        );
      }
    }

    function accessAdsl(): void {
      if (level === 13) {
        level = 14;
        typing(900);
        setTimeout(addResponseMsg, 1000, "Souhaitez vous voir que les Biens ayant un accèss à l'ADSL ?");
        setTimeout(
          addResponseMsg,
          1500,
          `<button type="button" class="btn btn-success" id="accesADSLNon">Non</button> 
          <button type="button" class="btn btn-success" id="accessADSLOui">Oui</button>`
        );
      }
    }

    function saisieMin(): void {
      typing(900);
      setTimeout(addResponseMsg, 1000, 'Merci de saisir le prix minimum recherché');
    }

    function saisieMax(): void {
      level = 9;
      typing(900);
      setTimeout(addResponseMsg, 1000, 'Merci de saisir le prix maximum recherché');
    }

    function louer(): void {
      if (level === 5) {
        level = 6;
        if (lastText !== 'LOUER') {
          addMsg('Louer');
        }
        choisirCategorieLouer();
      }
    }

    function definirFouchette(): void {
      typing(900);
      setTimeout(addResponseMsg, 1000, 'Voulez vous définir une fourchette pour le prix ?');
      setTimeout(
        addResponseMsg,
        1500,
        `<button type="button" class="btn btn-success" id="budgetNon">Non</button> 
          <button type="button" class="btn btn-success" id="budgetOui">Oui</button>`
      );
    }

    function acheter(): void {
      if (level === 5) {
        level = 6;
        if (lastText !== 'ACHETER') {
          addMsg('Acheter');
        }
        choisirCategorieAchat();
      }
    }

    function choisirCategorieAchat(): void {
      typing(900);
      setTimeout(addResponseMsg, 1000, 'Que souhaitez vous acheter ?');
      setTimeout(
        addResponseMsg,
        1500,
        `<div class="form-group categorie">
            <label class="custom-control custom-radio">
                <input name='cat' id='tout'  class="custom-control-input" checked="" type="radio" value="tout">
                <span class="custom-control-label"> Toutes catégories </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='terrain' class="custom-control-input" type="radio" value="terrain">
                <span class="custom-control-label"> Terrain </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='maison' class="custom-control-input" type="radio" value="maison">
                <span class="custom-control-label"> Maison </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='appartement' class="custom-control-input" type="radio" value="appartement">
                <span class="custom-control-label"> Appartement </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='bureau' class="custom-control-input" type="radio"  value="bureau">
                <span class="custom-control-label"> Bureau </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='commerce' class="custom-control-input" type="radio"  value="commerce">
                <span class="custom-control-label"> Local commercial </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='verger' class="custom-control-input" type="radio"  value="verger">
                <span class="custom-control-label"> Verger </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='hangar' class="custom-control-input" type="radio"  value="hangar">
                <span class="custom-control-label"> Hangar </span>
            </label>
        </div>
          <button type="button" class="btn btn-success" id="validerCategorie">Valider</button>`
      );
    }

    function choisirCategorieLouer(): void {
      typing(900);
      setTimeout(addResponseMsg, 1000, 'Que souhaitez vous louer ?');
      setTimeout(
        addResponseMsg,
        1500,
        `<div class="form-group categorie">
            <label class="custom-control custom-radio">
                <input name='cat' id='tout'  class="custom-control-input" checked="" type="radio" value="tout">
                <span class="custom-control-label"> Toutes catégories </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='terrain' class="custom-control-input" type="radio" value="terrain">
                <span class="custom-control-label"> Terrain </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='maison' class="custom-control-input" type="radio" value="maison">
                <span class="custom-control-label"> Maison </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='chambre' class="custom-control-input" type="radio" value="chambre">
                <span class="custom-control-label"> Chambre </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='appartement' class="custom-control-input" type="radio" value="appartement">
                <span class="custom-control-label"> Appartement </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='bureau' class="custom-control-input" type="radio"  value="bureau">
                <span class="custom-control-label"> Bureau </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='commerce' class="custom-control-input" type="radio"  value="commerce">
                <span class="custom-control-label"> Local commercial </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='verger' class="custom-control-input" type="radio"  value="verger">
                <span class="custom-control-label"> Verger </span>
            </label>
            <label class="custom-control custom-radio">
                <input name='cat' id='hangar' class="custom-control-input" type="radio"  value="hangar">
                <span class="custom-control-label"> Hangar </span>
            </label>
        </div>
          <button type="button" class="btn btn-success" id="validerCategorie">Valider</button>`
      );
    }

    function exposer(): void {
      if (level === 5) {
        level = 6;
        if (lastText !== 'EXPOSER UN BIEN') {
          addMsg('Exposer un bien');
        }
        alert('exposer');
      }
    }

    function connaissanceOui(): void {
      if (level === 1) {
        level = 5;
        if (lastText !== 'OUI') {
          addMsg('Oui');
        }
        typing(1900);
        setTimeout(addResponseMsg, 2000, 'Je suis heureuse de vous assister à nouveau');
        setTimeout(addResponseMsg, 2500, 'dites moi, que souheitez vous faire ?');
        setTimeout(
          addResponseMsg,
          3500,
          `<button type="button" style='margin : 5px;' class="btn btn-success" id="acheter">Acheter</button> 
          <button type="button" style='margin : 5px;' class="btn btn-success" id="louer">Louer</button>
          <button type="button" style='margin : 5px;' class="btn btn-success" id="exposer">exposer un bien</button>
          `
        );
      }
    }

    function connaissanceNon(): void {
      if (level === 1) {
        level = 2;
        if (lastText !== 'Non') {
          addMsg('Non');
        }
        typing(1900);
        setTimeout(addResponseMsg, 2000, "&#128525 &#128525 &#128525 !!! je commençais à m'ennuyer ");
        setTimeout(addResponseMsg, 2500, "Et si nous faisons connaissant ? Je m'appelle Arame Bot, Et vous ? ");
      }
    }

    function clientNom(): void {
      level = 3;
      typing(1900);
      setTimeout(addResponseMsg, 2000, "C'est sympa de votre part " + nom);
      setTimeout(
        addResponseMsg,
        2500,
        `Je suis joingnable au <a href="tel:+221771234567">+221 77 123 45 67</a> !!! j'aimerai bien pouvoir vous appelez.`
      );
      setTimeout(addResponseMsg, 3000, 'Je peux avoir votre numéro de téléphone SVP ?');
    }

    function clientTel(): void {
      level = 4;
      typing(1900);
      setTimeout(addResponseMsg, 2000, 'Merci ' + nom);
      setTimeout(addResponseMsg, 2500, `Pour ne pas vous appelez à une heure qui vous convient pas`);
      setTimeout(
        addResponseMsg,
        3000,
        `je peux avoir votre Email SVP ? le mien c'est <a href="mailto:contact@buntu.sn">contact@buntu.sn</a>`
      );
    }

    const clientEmail = (): void => {
      level = 5;
      typing(1900);
      setTimeout(addResponseMsg, 2000, "c'est noté " + nom);
      setTimeout(addResponseMsg, 2500, 'dites moi, que souheitez vous faire ?');
      setTimeout(
        addResponseMsg,
        3500,
        `<button type="button" style='margin : 5px;' class="btn btn-success" id="acheter">Acheter</button> 
          <button type="button" style='margin : 5px;' class="btn btn-success" id="louer">Louer</button>
          <button type="button" style='margin : 5px;' class="btn btn-success" id="exposer">exposer un bien</button>`
      );
      this.emailService
        .envoyeremail(
          'xamalteam@gmail.com',
          'Client ChatBot',
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
				Ce client vient de communiquer avec le <b style="color: #32B019;">ChatBot de BUNTU</b><br/>
        <b>Données enregistrées : </b><br>
        nom :  <b style="color: #32B019;">${nom}</b><br>
        tel : <b style="color: #32B019;">${tel}</b><br>
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
    };
  }

  ngOnInit(): void {
    this.loadAll();
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
    this.newslettersFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  newLetters(): void {
    const email = this.email;
    this.newsletterMAIL(email);
    this.email = '';
    this.alerter = true;
    this.newslettersFormGroup.reset();
    setTimeout(() => {
      this.alerter = false;
    }, 3000);
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  tester(): void {
    this.emailService.envoyeremail('xamalteam@gmail.com', 'mon sujet', 'mon message dynamique').subscribe();
  }
}
