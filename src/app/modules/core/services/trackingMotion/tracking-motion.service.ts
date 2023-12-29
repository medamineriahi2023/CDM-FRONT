import { Injectable } from '@angular/core';
import {AbstractCrudService} from "../abstract/abstract-crud.service";
import {TrackingMotion} from "../../models/entities/TrackingMotion";
// @ts-ignore
import * as SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
@Injectable({
  providedIn: 'root'
})
export class TrackingMotionService extends AbstractCrudService<TrackingMotion> {

  private stompClient!: Client;


  constructor() {
    super("tracking")
  }


  connect() {
    this.stompClient = new Client();
    this.stompClient.configure({
      brokerURL: 'ws://localhost:8081/ws',
      onConnect: () => {
        console.log('Connected to WebSocket server');
        this.stompClient.subscribe('/topic/emails', (email: any) => {
          console.log(email);
          // Update the frontend with the email address
        });
      }
    });
    this.stompClient.activate();
  }
}
