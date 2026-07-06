import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

@Component({
  selector: 'app-mensagens',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mensagens-page">
      <div class="page-header">
        <h1><span class="highlight">Mensagens</span></h1>
        <p>Comunique-se com seus alunos</p>
      </div>

      <div class="chat-container">
        <div class="conversations-panel">
          <div class="search-box">
            <input type="text" placeholder="Buscar conversas..." class="search-input" [(ngModel)]="searchTerm" />
          </div>
          <div class="conversations-list">
            @for (conv of filteredConversations(); track conv.id) {
              <div class="conversation-item" [class.active]="selectedConversation()?.id === conv.id" (click)="selectConversation(conv)">
                <div class="conv-avatar">
                  <span>{{ conv.name.charAt(0) }}</span>
                  @if (conv.online) {
                    <span class="online-dot"></span>
                  }
                </div>
                <div class="conv-info">
                  <h4>{{ conv.name }}</h4>
                  <p>{{ conv.lastMessage }}</p>
                </div>
                <div class="conv-meta">
                  <span class="time">{{ conv.time }}</span>
                  @if (conv.unread > 0) {
                    <span class="unread-badge">{{ conv.unread }}</span>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <div class="chat-panel">
          @if (selectedConversation()) {
            <div class="chat-header">
              <div class="chat-user">
                <div class="user-avatar">
                  <span>{{ selectedConversation()!.name.charAt(0) }}</span>
                </div>
                <div class="user-info">
                  <h4>{{ selectedConversation()!.name }}</h4>
                  <span class="status">{{ selectedConversation()!.online ? 'Online' : 'Offline' }}</span>
                </div>
              </div>
            </div>

            <div class="messages-container">
              @for (msg of messages; track msg.id) {
                <div class="message" [class.me]="msg.isMe">
                  <div class="message-content">
                    <p>{{ msg.content }}</p>
                    <span class="message-time">{{ msg.time }}</span>
                  </div>
                </div>
              }
            </div>

            <div class="message-input">
              <input type="text" placeholder="Digite sua mensagem..." class="input-field" [(ngModel)]="newMessage" (keypress)="onKeyPress($event)" />
              <button class="send-btn" (click)="sendMessage()" [disabled]="!newMessage.trim()">
                Enviar
              </button>
            </div>
          } @else {
            <div class="empty-chat">
              <span class="empty-icon">💬</span>
              <h3>Selecione uma conversa</h3>
              <p>Escolha um aluno para iniciar o chat</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mensagens-page {
      padding: 2rem;
      height: calc(100vh - 140px);
    }

    .page-header {
      margin-bottom: 1.5rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 0.5rem 0;
    }

    .highlight {
      color: var(--color-primary);
    }

    .page-header p {
      color: var(--color-text-secondary);
      margin: 0;
    }

    .chat-container {
      display: grid;
      grid-template-columns: 350px 1fr;
      height: calc(100vh - 240px);
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 1rem;
      overflow: hidden;
    }

    .conversations-panel {
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
    }

    .search-box {
      padding: 1rem;
      border-bottom: 1px solid var(--color-border);
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--color-glass);
      border: 1px solid var(--color-glass-border);
      border-radius: 0.5rem;
      color: var(--color-text-primary);
      font-size: 0.875rem;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .conversations-list {
      flex: 1;
      overflow-y: auto;
    }

    .conversation-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      cursor: pointer;
      transition: background 0.2s;
      border-bottom: 1px solid var(--color-border);
    }

    .conversation-item:hover {
      background: var(--color-glass);
    }

    .conversation-item.active {
      background: rgba(200, 255, 0, 0.1);
    }

    .conv-avatar {
      position: relative;
      width: 45px;
      height: 45px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: var(--color-bg-dark);
    }

    .online-dot {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 10px;
      height: 10px;
      background: #22c55e;
      border-radius: 50%;
      border: 2px solid var(--color-bg-card);
    }

    .conv-info {
      flex: 1;
      min-width: 0;
    }

    .conv-info h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.25rem 0;
    }

    .conv-info p {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .conv-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .conv-meta .time {
      font-size: 0.7rem;
      color: var(--color-text-secondary);
    }

    .unread-badge {
      background: var(--color-primary);
      color: var(--color-bg-dark);
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 1rem;
    }

    .chat-panel {
      display: flex;
      flex-direction: column;
    }

    .chat-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--color-border);
    }

    .chat-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: var(--color-bg-dark);
    }

    .user-info h4 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .user-info .status {
      font-size: 0.75rem;
      color: #22c55e;
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message {
      display: flex;
      justify-content: flex-start;
    }

    .message.me {
      justify-content: flex-end;
    }

    .message-content {
      max-width: 70%;
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      background: var(--color-glass);
    }

    .message.me .message-content {
      background: var(--color-primary);
      color: var(--color-bg-dark);
    }

    .message-content p {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
    }

    .message-time {
      font-size: 0.65rem;
      opacity: 0.7;
    }

    .message-input {
      display: flex;
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--color-border);
    }

    .input-field {
      flex: 1;
      padding: 0.75rem 1rem;
      background: var(--color-glass);
      border: 1px solid var(--color-glass-border);
      border-radius: 0.5rem;
      color: var(--color-text-primary);
      font-size: 0.875rem;
    }

    .input-field:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .send-btn {
      padding: 0.75rem 1.5rem;
      background: var(--color-primary);
      color: var(--color-bg-dark);
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .send-btn:hover:not(:disabled) {
      background: var(--color-primary-dark);
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .empty-chat {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--color-text-secondary);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-chat h3 {
      color: var(--color-text-primary);
      margin: 0 0 0.5rem 0;
    }

    .empty-chat p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .chat-container {
        grid-template-columns: 1fr;
      }

      .conversations-panel {
        display: none;
      }

      .conversations-panel.active {
        display: flex;
        position: absolute;
        inset: 0;
        z-index: 10;
      }
    }
  `]
})
export class MensagensComponent {
  searchTerm = '';
  selectedConversation = signal<Conversation | null>(null);
  newMessage = '';

  conversations: Conversation[] = [];

  messages: Message[] = [];

  filteredConversations = signal<Conversation[]>(this.conversations);

  selectConversation(conv: Conversation): void {
    this.selectedConversation.set(conv);
    conv.unread = 0;
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({
        id: Date.now().toString(),
        sender: 'Eu',
        content: this.newMessage,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      });
      this.newMessage = '';
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
}
