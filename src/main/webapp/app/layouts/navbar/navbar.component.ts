import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';
import $ from 'jquery';
import { VERSION } from 'app/app.constants';
import { LANGUAGES } from 'app/config/language.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import { default as autoComp } from 'content/assets/js/autocompilation';
import { default as initJs } from 'content/assets/js/index.bundle';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalPartageService } from 'app/shared/global-partage.service';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  rechercheAcceuil!: FormGroup;
  index = 0;
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  entitiesNavbarItems: any[] = [];

  constructor(
    private loginService: LoginService,
    private translateService: TranslateService,
    private sessionStorageService: SessionStorageService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router,
    private globalPartageService: GlobalPartageService
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }
  ngAfterViewInit(): void {
    this.globalPartageService.AutoLogin().subscribe();
    autoComp();
    //initJs();
  }
  // autoLog(): void{
  //   if(this.index < 10){
  //     setTimeout(() => {
  //       this.globalPartageService.AutoLogin().subscribe();
  //       if (this.account?.login === undefined) {
  //         this.autoLog();
  //       }
  //       this.index++;
  //     }, 1000);
  //   }
  // }

  ngOnInit(): void {
    this.globalPartageService.AutoLogin().subscribe();
    this.rechercheAcceuil = new FormGroup({
      adresse: new FormControl('', Validators.minLength(25)),
    });
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
    this.globalPartageService.AutoLogin().subscribe();
    // this.autoLog();
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorageService.store('locale', languageKey);
    this.translateService.use(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  rechercher(): void {
    if ($('#result').val()) {
      window.location.href = encodeURI(`${String($('#result').val())}&categories=${String($('#categories').val())}`);
    } else {
      const getUrl = window.location;
      const baseUrl = getUrl.protocol + '//' + getUrl.host + '/';
      let monurl = baseUrl + 'recherche';
      if (String($('#categories').val()) !== 'tout') {
        monurl = monurl + `?lat=14.656875015645937&lng=-14.833755006747824&categories=${String($('#categories').val())}`;
      }
      window.location.href = monurl;
    }
  }

  contact(): void {
    const getUrl = window.location;
    const baseUrl = getUrl.protocol + '//' + getUrl.host + '/';
    const monurl = baseUrl + 'contact';
    window.location.href = monurl;
    this.collapseNavbar();
  }

  engagement(): void {
    const getUrl = window.location;
    const baseUrl = getUrl.protocol + '//' + getUrl.host + '/';
    const monurl = baseUrl + 'engagement';
    window.location.href = monurl;
    this.collapseNavbar();
  }

  apropos(): void {
    const getUrl = window.location;
    const baseUrl = getUrl.protocol + '//' + getUrl.host + '/';
    const monurl = baseUrl + 'apropos';
    window.location.href = monurl;
    this.collapseNavbar();
  }

  recherche(): void {
    const getUrl = window.location;
    const baseUrl = getUrl.protocol + '//' + getUrl.host + '/';
    const monurl = baseUrl + 'recherche';
    window.location.href = monurl;
    this.collapseNavbar();
  }

  estimer(): void {
    const getUrl = window.location;
    const baseUrl = getUrl.protocol + '//' + getUrl.host + '/';
    const monurl = baseUrl + 'estimer';
    window.location.href = monurl;
    this.collapseNavbar();
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
  isHome(): boolean {
    if (this.router.url === '/') {
      return true;
    } else {
      return false;
    }
  }

  allerA(transac: string, cat: string): void {
    const getUrl = window.location;
    const baseUrl = getUrl.protocol + '//' + getUrl.host + '/';
    const monurl =
      baseUrl + `recherche?lat=14.656875015645937&lng=-14.833755006747824&categories=${cat}&transac=${transac}&carte=false&sansfiltre=true`;
    window.location.href = monurl;
    this.collapseNavbar();
  }
}
