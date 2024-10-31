import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './pages/products/products.component';
import { BannersComponent } from './pages/banners/banners.component';
import { CategoriesBrandsComponent } from './pages/categories-brands/categories-brands.component';
import { CollaboratorsComponent } from './pages/collaborators/collaborators.component';
import { CreateBannerComponent } from './pages/create-banner/create-banner.component';
import { CreateBrandComponent } from './pages/create-brand/create-brand.component';
import { CreateCategoryComponent } from './pages/create-category/create-category.component';
import { CreateCollaboratorComponent } from './pages/create-collaborator/create-collaborator.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { CreateStaffComponent } from './pages/create-staff/create-staff.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NavAdmiComponent } from './pages/nav-admi/nav-admi.component';
import { OrderComponent } from './pages/order/order.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RecojoComponent } from './pages/recojo/recojo.component';
import { RecojosComponent } from './pages/recojos/recojos.component';
import { ShipmentComponent } from './pages/shipment/shipment.component';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { UpdateBannerComponent } from './pages/update-banner/update-banner.component';
import { UpdateCategoryComponent } from './pages/update-category/update-category.component';
import { UpdateBrandComponent } from './pages/update-brand/update-brand.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { UpdateStaffComponent } from './pages/update-staff/update-staff.component';
import { VoucherComponent } from './pages/voucher/voucher.component';
import { VouchersComponent } from './pages/vouchers/vouchers.component';
import { AdmiRoutingModule } from './admi-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ProductsComponent,
    BannersComponent,
    CategoriesBrandsComponent,
    CollaboratorsComponent,
    CreateBannerComponent,
    CreateBrandComponent,
    CreateCategoryComponent,
    CreateCollaboratorComponent,
    CreateProductComponent,
    CreateStaffComponent,
    DashboardComponent,
    NavAdmiComponent,
    OrderComponent,
    OrdersComponent,
    ProfileComponent,
    RecojoComponent,
    RecojosComponent,
    ShipmentComponent,
    ShippingComponent,
    UpdateBannerComponent,
    UpdateBrandComponent,
    UpdateCategoryComponent,
    UpdateProductComponent,
    UpdateProfileComponent,
    UpdateStaffComponent,
    VoucherComponent,
    VouchersComponent,
  ],
  imports: [
    CommonModule,
    AdmiRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class AdmiPanelModule { }
