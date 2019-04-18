//core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http';


//packages
import { FilterPipeModule } from 'ngx-filter-pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { TagInputModule } from 'ngx-chips';

//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { FirestoreSettingsToken } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { NavbarComponent } from './pages/shared/navbar/navbar.component';
import { SidebarComponent } from './pages/shared/sidebar/sidebar.component';
import { LoginComponent } from './pages/entry/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { HomeComponent } from './pages/dashboard/home/home.component';
import { SpinnerComponent } from './pages/shared/ui/spinner/spinner.component';
import { AuthService } from './services/auth/auth.service';
import { ApiService } from './services/api/api.service';
import { VorspeisenComponent } from './pages/dashboard/vorspeisen/vorspeisen.component';
import { PizzaComponent } from './pages/dashboard/pizza/pizza.component';
import { PizzaExtrasComponent } from './pages/dashboard/pizza-extras/pizza-extras.component';
import { PastaComponent } from './pages/dashboard/pasta/pasta.component';
import { PastaExtrasComponent } from './pages/dashboard/pasta-extras/pasta-extras.component';
import { SaladComponent } from './pages/dashboard/salad/salad.component';
import { DessertComponent } from './pages/dashboard/dessert/dessert.component';
import { BeveragesComponent } from './pages/dashboard/beverages/beverages.component';
import { ZipCodeComponent } from './pages/dashboard/zip-code/zip-code.component';
import { DealsComponent } from './pages/dashboard/deals/deals.component';
import { TimmingsComponent } from './pages/dashboard/timmings/timmings.component';
import { OrdersComponent } from './pages/dashboard/orders/orders.component';

import {NgxPrintModule} from 'ngx-print';
import {ENgxPrintModule} from "e-ngx-print";
import { AuthGaurdService } from './services/auth-gaurd/auth-gaurd.service';
import { AddCategoriesComponent } from './pages/dashboard/add-categories/add-categories.component';
import { CategoryItemsComponent } from './pages/dashboard/category-items/category-items.component';


const routes = [
  {path: '' , redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, children: [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'vorspeisen', component: VorspeisenComponent},
    {path: 'pizza', component: PizzaComponent},
    {path: 'pizza-extras', component: PizzaExtrasComponent},
    {path: 'pasta', component: PastaComponent},
    {path: 'pasta-extras', component: PastaExtrasComponent},
    {path: 'salad', component: SaladComponent},
    {path: 'dessert', component: DessertComponent},
    {path: 'beverages', component: BeveragesComponent},
    {path: 'zip-codes', component: ZipCodeComponent},
    {path: 'deals', component: DealsComponent},
    {path: 'timing', component: TimmingsComponent},
    {path: 'orders', component: OrdersComponent},
    {path: 'others', component: AddCategoriesComponent},
    {path: 'category-items', component: CategoryItemsComponent}
  ], canActivate: [AuthGaurdService]}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    SpinnerComponent,
    VorspeisenComponent,
    PizzaComponent,
    PizzaExtrasComponent,
    PastaComponent,
    PastaExtrasComponent,
    SaladComponent,
    DessertComponent,
    BeveragesComponent,
    ZipCodeComponent,
    DealsComponent,
    TimmingsComponent,
    OrdersComponent,
    AddCategoriesComponent,
    CategoryItemsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgxPrintModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgbModalModule,
    NgbModule,
    ENgxPrintModule,
    NgxUiLoaderModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    TagInputModule,
    FilterPipeModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ApiService, AuthService,AuthGaurdService, AuthService, { provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
