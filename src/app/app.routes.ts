import { Routes } from '@angular/router';
import { CollectionsComponent } from './component/collections/collections.component';

import { ProductDetailsComponent } from './component/product-details/product-details.component';
import { AddToCartComponent } from './component/add-to-cart/add-to-cart.component';
import { PolicyComponent } from './component/policy/policy.component';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { MyOrderComponent } from './component/my-order/my-order.component';
import { DeliveryAddressComponent } from './component/delivery-address/delivery-address.component';
import { ProfileComponent } from './component/profile/profile.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { MyAccountComponent } from './component/my-account/my-account.component';
import { PrivacyComponent } from './component/privacy/privacy.component';
import { HomeComponent } from './component/home/home.component';
import { SearchComponent } from './component/search/search.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products/:category', component: CollectionsComponent }, // Full-page cart here
    { path: 'product/:id', component: ProductDetailsComponent },
    { path: 'cart', component: AddToCartComponent }, // Full page cart route
    {path:'policy' ,component:PolicyComponent},
    {path:'login',component:LoginComponent},
    {path:'signup',component:SignupComponent},
    {path:'my-order' ,component:MyOrderComponent},
    {path:'delivery-address',component:DeliveryAddressComponent},
    {path:'my-profile',component:ProfileComponent},
    {path:'checkout',component:CheckoutComponent},
    {path:'privacy',component:PrivacyComponent},
    {path:'search' ,component:SearchComponent},
    { path: '**', redirectTo: '' }
];
