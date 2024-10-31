import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";


const routes: Routes = [

    {
        path: '',
        loadChildren: () => import('./modules/public/public.module')
        .then(m  => m.PublicModule)

    },
    {
        path: 'acceso',
        loadChildren: () => import('./modules/auth/auth.module')
        .then(m => m.AuthModule)
    },

    {
        path: 'admin',
        loadChildren: () => import('./modules/admi-panel/admi-panel.module')
        .then(m => m.AdmiPanelModule)
    },

    {
        path: 'nosotros',
        loadChildren: () => import('./modules/nosotros/nosotros.module')
        .then(m => m.NosotrosModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule] 
})

export class AppRoutingModule {
    
}
