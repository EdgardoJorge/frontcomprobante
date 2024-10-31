import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { NgModule } from "@angular/core";
import { BrandComponent } from "./pages/brand/brand.component";
import { CategoryComponent } from "./pages/category/category.component";
import { DetailsComponent } from "./pages/details/details.component";
import { ConsultationComponent } from "./pages/consultation/consultation.component";
import { NavComponent } from "./pages/nav/nav.component";
import { CartComponent } from "./pages/cart/cart.component";
import { CustomerComponent } from "./pages/customer/customer.component";
import { LocationComponent } from "./pages/location/location.component";
import { PaymentComponent } from "./pages/payment/payment.component";

const routes: Routes = [
    { path: '', component: NavComponent, children: [
        {path: '', component: HomeComponent},
        {path: 'categoria/:id', component: CategoryComponent},
        {path: 'marca/:id', component: BrandComponent},
        {path: 'producto/:idProducto', component: DetailsComponent},
        {path: 'rastreo-de-pedido', component: ConsultationComponent},
        {path: 'recorrido/carrito', component: CartComponent},
        {path: 'recorrido/cliente', component: CustomerComponent},
        {path: 'recorrido/ubicacion', component: LocationComponent},
        {path: 'recorrido/pago', component: PaymentComponent}
      ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PublicRoutingModule {
   
}