import {Injectable} from '@angular/core';
import {WsComment} from '../../models/interfaces';
import {Subject} from 'rxjs';
import {Path} from '../path/path';

@Injectable({
  providedIn: 'root'
})
export class ConnSocket {
  private ws: WebSocket;
  public messages$ = new Subject<WsComment>();

  constructor(private path: Path,) {

    this.ws = new WebSocket(this.path.baseUrlWs);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messages$.next(data);
    }
  }

  async connSocket(data: WsComment) {
    const message = JSON.stringify(data);

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.messages$.next(data);
      }
    }
  }
}
