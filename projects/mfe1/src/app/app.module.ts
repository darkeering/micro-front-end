import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { APP_BASE_HREF } from '@angular/common';
import { Router } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    // {provide: APP_BASE_HREF, useValue: '/mfe1'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  static _router: any;
  constructor(private router: Router) {
    AppModule._router = this.router
  }
}
