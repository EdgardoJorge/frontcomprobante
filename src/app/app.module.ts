import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { SharedModule } from "./shared/shared.module";
import { HttpClientModule } from "@angular/common/http";
import { AuthModule } from "./modules/auth/auth.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgxPaginationModule } from "ngx-pagination";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBQG48zTSV4iBG8wyJOzgmsBZGBSxd45ok",
    authDomain: "image-upload-458ca.firebaseapp.com",
    projectId: "image-upload-458ca",
    storageBucket: "image-upload-458ca.appspot.com",
    messagingSenderId: "575916673190",
    appId: "1:575916673190:web:96a4e5014c8714f5458c67",
    measurementId: "G-76QC3FW5JE"
  };


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,   
        SharedModule,
        HttpClientModule,
        AuthModule,
        NgxPaginationModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireStorageModule
    ],
    providers: [
    provideAnimationsAsync(),
  ],
    bootstrap: [AppComponent]
})

export class AppModule {

}