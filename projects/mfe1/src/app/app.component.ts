import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mfe1';

  constructor(private http: HttpClient) {}

  sendHttpRequest() {
    this.http.get('/api').subscribe(res => {
      console.log(res);
    })
  }
}
