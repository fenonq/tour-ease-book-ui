import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {HttpService} from "../../services/http.service";

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
export class ChatAiComponent implements OnInit {
  showChat = false;
  newMessage = '';
  messages = [
    { text: 'Привіт! Чим я можу Вам допомогти?', owner: false }
  ];

  constructor(
    private httpService: HttpService,
  ) {
  }

  ngOnInit(): void {
  }

  toggleChat() {
    this.showChat = !this.showChat;
  }

  sendMessage() {
    console.log(this.messages);
    const userMessage = this.newMessage.trim();
    if (userMessage) {
      this.messages.push({ text: userMessage, owner: true });
      this.newMessage = ''; // Очистка поля вводу після відправки

      this.httpService.get(`http://localhost:8765/chat?prompt=${userMessage}`).subscribe({
        next: (response) => {
          // Припускаємо, що сервер повертає об'єкт з полем 'text', яке містить відповідь
          this.messages.push({ text: response.choices[0].message.content, owner: false });
        },
        error: (err) => {
          // Обробка помилки, можливо, відобразити повідомлення про помилку
          console.error('Error receiving response from AI:', err);
        }
      });
    }
  }
}
