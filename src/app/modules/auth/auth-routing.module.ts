import { Routes, RouterModule } from "@angular/router";
import { NavComponent } from "./pages/nav/nav.component";
import { NgModule } from "@angular/core";
import { LoginComponent } from "./pages/login/login.component";

const routes: Routes = [
    {path: '', component: NavComponent, children: [
        {path: 'inicio-sesion', component: LoginComponent},
    ]}
];

@NgModule({
    imports: [RouterModule. forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {

}