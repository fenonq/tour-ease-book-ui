import { Component } from '@angular/core';
import {ChatAiComponent} from "../chat-ai/chat-ai.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    ChatAiComponent
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
