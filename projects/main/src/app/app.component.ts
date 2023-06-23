import { loadRemoteModule } from '@angular-architects/module-federation';
import {
  Component,
  Directive,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'main';

  component: any;

  constructor(private router: Router) {
    this.router.resetConfig([
      {
        path: 'mfe1',
        loadChildren: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:9001/remoteEntry.js',
            exposedModule: './AppModule',
          }).then((m) => this.loadRemoteRootModule(m, 'mfe1')),
      },
      {
        path: 'mfe2',
        loadChildren: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:9002/remoteEntry.js',
            exposedModule: './AppModule',
          }).then((m) => this.loadRemoteRootModule(m, 'mfe2')),
      },
    ]);
  }

  loadRemoteRootModule(m: any, prefix: string) {
    setTimeout(() => {
      (m.AppModule._router as Router).events
        .pipe(filter((event: any) => event instanceof NavigationEnd))
        .subscribe((res) => {
          console.log(res);
          const url = res.url === '/' ? '' : res.url
          this.router.navigateByUrl(`/${prefix}${url}`)
        });
    });

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
