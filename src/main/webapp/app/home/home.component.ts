import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { default as initJs } from '../../content/assets/js/index.bundle.js';

import $ from 'jquery';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  account: Account | null = null;
  private readonly destroy$ = new Subject<void>();
  private map: any;

  constructor(private accountService: AccountService, private router: Router) {}

  ngAfterViewInit(): void {
    initJs();
    let montimer: any;
    let running = false;
    let level = 0;
    let lastText = '';
    let nom = '';
    let tel = '';
    let email = '';
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
          compagnieOui();
        } else if (String(msg).toUpperCase() === 'NON') {
          lastText = 'NON';
          compagnieNon();
        } else {
          setTimeout(addResponseMsg, 1500, `Vous êtes prier de répondre pas OUI ou NON SVP`);
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
      }
    }
    function addMsg(msg: any): void {
      const div = document.createElement('div');
      div.innerHTML = "<span style='flex-grow:1'></span><div class='chat-message-sent'>" + String(msg) + '</div>';
      div.className = 'chat-message-div';
      $('#message-box').append(div);
      //SEND MESSAGE TO API
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
          setTimeout(addResponseMsg, 1000, 'Bonjour, bienvenue dans Buntu real estate. puis-je vous tenir compagnie ?');
          setTimeout(
            addResponseMsg,
            1500,
            `<button type="button" class="btn btn-success" id="compagnieOui" (click)="compagnieOui()">Oui</button> 
          <button type="button" class="btn btn-danger" id="compagnieNon">Non</button>`
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

    $('#message-box').on('click', '#compagnieOui', function () {
      compagnieOui();
    });
    $('#message-box').on('click', '#compagnieNon', function () {
      compagnieNon();
    });

    function compagnieNon(): void {
      if (level === 1) {
        level = 0;
        if (lastText !== 'NON') {
          addMsg('Non');
        }
        typing(1900);
        setTimeout(addResponseMsg, 2000, 'Merci beaucoup !!! Au revoir');
      }
    }

    function compagnieOui(): void {
      if (level === 1) {
        level = 2;
        if (lastText !== 'OUI') {
          addMsg('Oui');
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

    function clientEmail(): void {
      level = 5;
      typing(1900);
      setTimeout(addResponseMsg, 2000, "c'est noté " + nom);
      // setTimeout(addResponseMsg, 3000, `Pour ne pas vous appelez à une heure qui vous convient pas`);
    }
  }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
