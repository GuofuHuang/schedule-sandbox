import {Component, OnInit} from "@angular/core";
import template from "./chats.component.html"
import {Observable} from "rxjs";
import {Meteor} from 'meteor/meteor';
import {MeteorObservable} from 'meteor-rxjs';
import {Chat} from "../../../../both/models/chat.model";
import * as moment from "moment";
import style from "./chats.component.scss";
import {Chats} from "../../../../both/collections/chats.collection";
import {Message} from "../../../../both/models/message.model";
import {Messages} from "../../../../both/collections/messages.collection";
import {NavController, PopoverController, ModalController} from "ionic-angular";
import {MessagesPage} from "../chat/messages-page.component";
import {ChatsOptionsComponent} from '../chats/chats-options.component';
import {NewChatComponent} from './new-chat.component';

@Component({
  selector: "chats",
  template,
  styles: [
    style
  ]
})
export class ChatsComponent implements OnInit {
  chats: Observable<Chat[]>;
  senderId: string;

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController
    ) {}

  ngOnInit() {
    this.senderId = Meteor.userId();
    MeteorObservable.subscribe('chats').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        // console.log(Chats.find({}).zone());

        this.chats = Chats
          .find({})
          .map(chats => {
            console.log(chats);
            chats.forEach(chat => {
              const receiver = Meteor.users.findOne(chat.memberIds.find(memberId => memberId !== this.senderId))

              chat.title = receiver.profile.name;
              chat.picture = receiver.profile.picture;
            });

            return chats;
          }).zone();
      });
    });
  }

  addChat(): void {
    const modal = this.modalCtrl.create(NewChatComponent);
    modal.present();
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(ChatsOptionsComponent, {}, {
      cssClass: 'options-popover'
    });
 
    popover.present();
  }

  showMessages(chat): void {
    this.navCtrl.push(MessagesPage, {chat});
  }
}
