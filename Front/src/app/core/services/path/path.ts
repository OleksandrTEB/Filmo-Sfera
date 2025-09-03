import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Path {
  constructor() {}
  baseUrl: string = 'http://localhost/Filmo-Sfera/Back/public/api.php/';

//   WsUrl
  baseUrlWs: string = 'ws://192.168.0.135:8080/';
}
