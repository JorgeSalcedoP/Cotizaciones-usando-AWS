import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';


@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {
  titulo: string;
  constructor(private router: Router, private title: Title, private meta: Meta) {

     // como se que retorna un observable, entonces me subscribo
     this.getDataRoute()
     .subscribe(data => {
       this.titulo = data;
       this.title.setTitle('ITG - ' + this.titulo); // aqui seteo el nombre de la pestaña del browser segun la pagina donde este

       // agregando metatags
       const metaTag: MetaDefinition = {
         name: 'description',
         content: this.titulo
       };

       this.meta.updateTag(metaTag);
     });
   }

  ngOnInit() {
  }



  getDataRoute(): Observable<string> {
    // el events me retorna un observable

    console.log(this.router);

    return this.router.events.pipe(
      filter(evento => evento instanceof ActivationEnd), // filtra solo las instancias de ActivationEnd
      filter((evento: ActivationEnd) => evento.snapshot.firstChild == null), // filtra los que tiene firstChild nulo
      map((evento: ActivationEnd) => evento.snapshot.data.titulo) // retorna el titulo
    );
  }

}
