import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { AuthService } from '../../service/auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SseClient } from 'angular-sse-client';
import { closeEventSource } from 'angular-sse-client';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { KeycloakService } from 'keycloak-angular';
import { Account } from '../../model/models';
import { switchMap } from 'rxjs/operators';
import { Environment } from '../../../environments/environment';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css'],
})
export class MessengerComponent implements OnInit, AfterViewChecked {
  channels: Channel[] = [];
  messages: Message[] = [];
  resultObserver: Observable<Message[]>;
  channelId: string;
  userProfile: Keycloak.KeycloakProfile;
  account: Account;
  messageFormGroup: FormGroup;
  private readonly baseUrl = Environment.messageServiceUrl + '/v1/messages';
  private readonly baseUrlChannels = Environment.messageServiceUrl + '/v1/channels';

  constructor(
    public http: HttpClient,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.authService
      .getCurrentUserProfile()
      .pipe(
        switchMap((userProfile) => {
          this.userProfile = userProfile;
          return this.authService.getAccount(userProfile.id);
        })
      )
      .subscribe((account) => {
        this.account = account;
        this.getChannelsByIds(account.channels).subscribe((channels) => {
          this.channels = channels;
        });
      });

    this.messageFormGroup = this.formBuilder.group({
      messageContent: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });
  }

  getChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.baseUrlChannels}`);
  }

  getChannelsByIds(channelIds: string[]): Observable<Channel[]> {
    return this.http.post<Channel[]>(`${this.baseUrlChannels}/by-ids`, channelIds);
  }

  createEventSourceObserver(channel: string): Observable<Message[]> {
    return new Observable<Message[]>((observer: Observer<Message[]>) => {
      const source = new EventSource(`${this.baseUrl}/stream/${channel}`);
      source.addEventListener('message', (event) => {
        this.messages.push(JSON.parse(event.data));
        observer.next(this.messages);
      });
      return () => source.close();
    });
  }

  createEventSourceObserverSecured(channel: string, token: string): Observable<Message[]> {
    return new Observable<Message[]>((observer: Observer<Message[]>) => {
      const source = new EventSourcePolyfill(`${this.baseUrl}/stream/${channel}`, {
        headers: {
          Authorization: token,
        },
        heartbeatTimeout: Number.MAX_SAFE_INTEGER,
      });
      source.addEventListener('message', (event) => {
        this.messages.push(JSON.parse(event.data));
        observer.next(this.messages);
      });
      source.addEventListener('error', (error) => {
        console.log(error);
      });
      return () => source.close();
    });
  }

  onChange(channelId: string): void {
    this.channelId = channelId;
    this.messages = [];
    this.authService.getToken().subscribe((token) => {
      this.resultObserver = this.createEventSourceObserverSecured(this.channelId, 'Bearer ' + token);
      this.cdr.detectChanges();
    });
  }

  get messageContent(): AbstractControl | null {
    return this.messageFormGroup.get('messageContent');
  }

  onSubmit(): void {
    console.log(this.messageContent?.value);
    const message = {
      content: this.messageContent?.value,
      authorId: this.userProfile.id,
      channelId: this.channelId,
    } as Message;
    this.http.post(this.baseUrl, message).subscribe(() => {
      this.messageContent?.reset();
    });
  }
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  channelId: string;
}

export interface Channel {
  id: string;
  name: string;
}
