import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { AidComponent } from './pages/aid/aid.component';
import { BrandComponent } from './pages/brand/brand.component';
import { CartComponent } from './pages/cart/cart.component';
import { CategoryComponent } from './pages/category/category.component';
import { ConsultationComponent } from './pages/consultation/consultation.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { DetailsComponent } from './pages/details/details.component';
import { FooterComponent } from './pages/footer/footer.component';
import { LocationComponent } from './pages/location/location.component';
import { NavComponent } from './pages/nav/nav.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { TerminosComponent } from './pages/terminos/terminos.component';
import { PublicRoutingModule } from './public-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    AidComponent,
    BrandComponent,
    CartComponent,
    CategoryComponent,
    ConsultationComponent,
    CustomerComponent,
    DetailsComponent,
    FooterComponent,
    HomeComponent,
    LocationComponent,
    NavComponent,
    PaymentComponent,
    SidebarComponent,
    SummaryComponent,
    TerminosComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PublicModule { }
