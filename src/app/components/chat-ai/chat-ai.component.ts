import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {HttpService} from "../../services/http.service";
import {SessionService} from "../../services/session.service";

@Component({
  selector: 'app-chat-ai',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgIf,
    NgForOf
  ],
  templateUrl: './chat-ai.component.html',
  styleUrl: './chat-ai.component.css'
})
export class ChatAiComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') chatContainer: ElementRef;

  showChat = false;
  newMessage = '';
  messages: Array<any>;

  constructor(
    private httpService: HttpService,
    public sessionService: SessionService
  ) {
  }

  ngOnInit(): void {
    this.messages = this.sessionService.getScope('aiChat') || [{role: 'system', content: 'Привіт!'}];
  }

  sendMessage(): void {
    const userMessage = this.newMessage.trim();
    if (userMessage) {
      this.messages.push({role: 'user', content: userMessage});
      this.sessionService.setScope('aiChat', this.messages);
      this.newMessage = '';

      this.httpService.post(`http://localhost:8765/chat`, this.messages).subscribe({
        next: (response) => {
          this.messages.push({role: 'assistant', content: response.choices[0].message.content});
          this.sessionService.setScope('aiChat', this.messages);
        },
        error: (err) => {
          console.error('Error receiving response from AI:', err);
        }
      });
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  toggleChat(): void {
    this.showChat = !this.showChat;
  }


}
