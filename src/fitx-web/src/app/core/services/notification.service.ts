import { Injectable, inject, NgZone } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  type: string;
  userId?: string;
  groupName?: string;
  createdAt: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);

  private hubConnection: HubConnection;
  private notificationSubject = new Subject<NotificationPayload>();
  private connectionStateSubject = new Subject<boolean>();

  notificationReceived$: Observable<NotificationPayload> = this.notificationSubject.asObservable();
  connectionState$: Observable<boolean> = this.connectionStateSubject.asObservable();

  constructor() {
    const baseUrl = environment.apiUrl.replace('/api', '');
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/notifications`, {
        accessTokenFactory: () => this.authService.getToken() ?? ''
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build();

    this.registerHandlers();
    this.startConnection();
  }

  private registerHandlers(): void {
    this.hubConnection.on('ReceiveNotification', (notification: NotificationPayload) => {
      this.ngZone.run(() => this.notificationSubject.next(notification));
    });

    this.hubConnection.onreconnecting(() => {
      this.ngZone.run(() => this.connectionStateSubject.next(false));
    });

    this.hubConnection.onreconnected(() => {
      this.ngZone.run(() => this.connectionStateSubject.next(true));
    });

    this.hubConnection.onclose(() => {
      this.ngZone.run(() => this.connectionStateSubject.next(false));
    });
  }

  private async startConnection(): Promise<void> {
    try {
      await this.hubConnection.start();
      this.connectionStateSubject.next(true);
    } catch {
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  async joinGroup(groupName: string): Promise<void> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      await this.hubConnection.invoke('JoinGroup', groupName);
    }
  }

  async leaveGroup(groupName: string): Promise<void> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      await this.hubConnection.invoke('LeaveGroup', groupName);
    }
  }

  getConnectionState(): HubConnectionState {
    return this.hubConnection.state;
  }

  disconnect(): void {
    this.hubConnection.stop();
  }
}
