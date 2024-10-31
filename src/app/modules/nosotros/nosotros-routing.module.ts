import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { TerminosComponent } from "./pages/terminos/terminos.component";
import { NosotrosComponent } from "./pages/nosotros/nosotros.component";
import { NavNosComponent } from "./pages/nav-nos/nav-nos.component";


const routes: Routes = [
    { path: '', component: NavNosComponent, children: [
        {path: 'terminos-condiciones', component: TerminosComponent},
        {path: 'sobre-nosotros', component: NosotrosComponent},
      ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NosotrosRoutingModule {
   
}