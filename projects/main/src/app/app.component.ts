import { loadRemoteModule } from '@angular-architects/module-federation';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Directive,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { httpInterceptorProviders } from './interceptor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'main';

  component: any;

  constructor(private router: Router, private http: HttpClient) {}
  ngOnInit(): void {
    this.resetRouterConfig();
  }

  sendHttpRequest() {
    this.http.get('/api').subscribe((res) => {
      console.log(res);
    });
  }

  resetRouterConfig() {
    this.router.resetConfig([
      {
        path: 'mfe1',
        loadChildren: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:9001/remoteEntry.js',
            exposedModule: './AppModule',
          }).then((m) => {
            const appModuleProviders = m.AppModule.ɵinj.providers
            appModuleProviders.unshift(httpInterceptorProviders)
            return this.loadRemoteRootModule(m);
          }),
      },
      {
        path: 'mfe2',
        loadChildren: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:9002/remoteEntry.js',
            exposedModule: './AppModule',
          }).then((m) => this.loadRemoteRootModule(m)),
      },
    ]);
  }

  loadRemoteRootModule(m: any) {
    const appModuleImports = m.AppModule.ɵinj.imports;
    const appRoutingModule = appModuleImports.find(
      (i: any) => i.name === 'AppRoutingModule'
    );
    const appRoutingModuleImports = appRoutingModule.ɵinj.imports;
    appRoutingModuleImports[0].providers = [
      appRoutingModuleImports[0].providers[2],
    ];
    appRoutingModuleImports[0].providers[0].useValue = [
      {
        path: '',
        component: m.AppModule.ɵmod.bootstrap[0],
        children: appRoutingModuleImports[0].providers[0].useValue,
      },
    ];
    return m.AppModule;
  }
}
