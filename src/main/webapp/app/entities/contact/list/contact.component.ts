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
  newslettersFormGroup!: FormGroup;
  alerter = false;
  alerterContact = false;
  email = '';
  nom = '';
  sujet = '';
  message = '';
  tel = '';
  constructor(protected emailService: EmailService) {}
  ngOnInit(): void {
    this.contactFormGroup = new FormGroup({
      nom: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      sujet: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      tel: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9)]),
    });
    this.newslettersFormGroup = new FormGroup({ email: new FormControl('', [Validators.required, Validators.email]) });
    initJs();
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

  allerA(cat: string): void {
    const getUrl = window.location;
    const baseUrl = getUrl.protocol + '//' + getUrl.host + '/';
    const monurl = baseUrl + `recherche?lat=14.656875015645937&lng=-14.833755006747824&categories=${cat}&carte=false&sansfiltre=true`;
    window.location.href = monurl;
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

  contacter(): void {
    this.tel = this.contactFormGroup.get('tel')?.value;
    this.sujet = this.contactFormGroup.get('sujet')?.value;
    this.nom = this.contactFormGroup.get('nom')?.value;
    this.email = this.contactFormGroup.get('email')?.value;
    this.message = this.contactFormGroup.get('message')?.value;
    this.emailMessage(this.nom, this.sujet, this.email, this.tel, this.message);
    this.tel = '';
    this.sujet = '';
    this.nom = '';
    this.email = '';
    this.message = '';
    this.alerterContact = true;
    this.contactFormGroup.reset();
    setTimeout(() => {
      this.alerterContact = false;
    }, 3000);
  }
  emailMessage(nom: string, sujet: string, email: string, tel: string, message: string): void {
    this.emailService
      .envoyeremail(
        'xamalteam@gmail.com',
        sujet,
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
}
