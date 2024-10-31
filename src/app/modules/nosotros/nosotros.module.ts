import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { TerminosComponent } from './pages/terminos/terminos.component';
import { NosotrosRoutingModule} from './nosotros-routing.module';
import { NavNosComponent } from './pages/nav-nos/nav-nos.component';
import { FooterComponent } from '../public/pages/footer/footer.component';


@NgModule({
  declarations: [
    NosotrosComponent,
    TerminosComponent,
    NavNosComponent,
    // FooterComponent,
  ],
  imports: [
    CommonModule,
    NosotrosRoutingModule,
  ]
})
export class NosotrosModule 
{

}
