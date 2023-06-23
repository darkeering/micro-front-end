import { loadRemoteModule } from '@angular-architects/module-federation';
import {
  AfterViewInit,
  Component,
  Directive,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[container]',
})
export class ContainerDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(ContainerDirective, { static: true }) container!: ContainerDirective;
  title = 'main';

  component: any;

  constructor(
    private router: Router,
  ) {
    this.router.resetConfig([
      {
        path: 'mfe1',
        loadChildren: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:9001/remoteEntry.js',
            exposedModule: './AppModule',
          }).then((m) => {
            console.log(m);
            const list = m.AppModule.ɵinj.imports;
            const appRoutingModule = list.find(
              (i: any) => i.name === 'AppRoutingModule'
            );
            appRoutingModule.ɵinj.imports[0].providers = [
              appRoutingModule.ɵinj.imports[0].providers[2],
            ];

            this.component = m.AppModule.AppComponent;
            this.container.viewContainerRef.createComponent(this.component)
            return m.AppModule;
          }),
      },
    ]);
  }

  ngAfterViewInit() {}
}
