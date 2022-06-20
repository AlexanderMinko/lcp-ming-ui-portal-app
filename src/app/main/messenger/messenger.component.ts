import { Component, OnInit } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { AuthService } from '../../service/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SseClient } from 'angular-sse-client';
import { closeEventSource } from 'angular-sse-client';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css'],
})
export class MessengerComponent implements OnInit {
  results: Message[] = [];
  resultObserver: Observable<Message[]>;
  channel: string = '1';
  isLoggedIn: boolean;
  userProfile: Keycloak.KeycloakProfile;
  messageFormGroup: FormGroup;
  private readonly baseUrl = 'http://localhost:8099/v1/messages';

  constructor(
    public http: HttpClient,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private sseClient: SseClient,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    this.authService
      .isLoggedIn()
      .subscribe((isLogged) => (this.isLoggedIn = isLogged));

    this.authService.getCurrentUserProfile().subscribe((loadedProfile) => {
      this.userProfile = loadedProfile;
    });

    // const source = new EventSourcePolyfill(
    //   `${this.baseUrl}/stream/2`,
    //   this.options
    // );
    //
    // source.addEventListener('message', (event) => {
    //   console.log(event.data);
    //   this.results.push(JSON.parse(event.data));
    // });

    this.messageFormGroup = this.formBuilder.group({
      messageContent: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
    });
  }

  onDeleteMessage(): void {
    // this.results = this.results.filter((message) => message.id !== id);
    this.http.get(`http://localhost:8099/v1/messages/find/1`).subscribe();
    this.http
      .delete(`http://localhost:8099/v1/messages/626a5888dc751b784c06b2a9`)
      .subscribe();
    // this.resultObserver = this.createEventSourceObserver();
    // console.log(this.results);
  }

  createEventSourceObserver(channel: string): Observable<Message[]> {
    return new Observable<Message[]>((observer: Observer<Message[]>) => {
      const source = new EventSource(`${this.baseUrl}/stream/${channel}`);
      source.addEventListener('message', (event) => {
        this.results.push(JSON.parse(event.data));
        observer.next(this.results);
      });
      return () => source.close();
    });
  }

  createEventSourceObserverSecured(
    channel: string,
    token: string
  ): Observable<Message[]> {
    return new Observable<Message[]>((observer: Observer<Message[]>) => {
      const source = new EventSourcePolyfill(
        `${this.baseUrl}/stream/${channel}`,
        {
          headers: {
            Authorization: token,
          },
          heartbeatTimeout: Number.MAX_SAFE_INTEGER
        }
      );
      source.addEventListener('message', (event) => {
        this.results.push(JSON.parse(event.data));
        observer.next(this.results);
      });
      source.addEventListener('error', (error) => {
        console.log(error);
      });
      return () => source.close();
    });
  }

  async onChange(events: Event): Promise<void> {
    // this.createEventSourceObserver2(channel).subscribe();
    this.channel = (events.target as HTMLInputElement).value;
    this.results = [];
    console.log('onChange');
    const token = await this.keycloakService.getToken();
    this.resultObserver = this.createEventSourceObserverSecured(
      this.channel,
      'Bearer ' + token
    );

    // closeEventSource(`${this.baseUrl}/stream/${this.channel}`);
    // // this.stream?.unsubscribe();
    // this.stream = this.sseClient
    //   .get(`${this.baseUrl}/stream/${this.channel}`, {
    //     withCredentials: true,
    //     keepAlive: false,
    //   })
    //   .subscribe((response) => {
    //     this.results.push(response);
    //     console.log(response);
    //     const messageEvent = response as MessageEvent;
    //     this.results.push(JSON.parse(messageEvent.data));
    //     console.log(JSON.parse(messageEvent.data));
    //   });
    // console.log(this.results);
  }

  get messageContent(): AbstractControl | null {
    return this.messageFormGroup.get('messageContent');
  }

  onSubmit(): void {
    console.log(this.messageContent?.value);
    const message = {
      content: this.messageContent?.value,
      author: this.userProfile.firstName,
      channel: this.channel,
    } as Message;
    console.log(message);
    this.http.post(this.baseUrl, message).subscribe(() => {
      this.messageContent?.reset();
    });
  }
}

export interface Message {
  id: string;
  content: string;
  author: string;
  channel: string;
}
