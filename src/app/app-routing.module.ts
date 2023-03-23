import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './components/add-product/add-product.component';
import { CartComponent } from './components/cart/cart.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { DisplayCategoriesComponent } from './components/display-categories/display-categories.component';
import { ProductItemDetailComponent } from './components/product-item-detail/product-item-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
  {path: '', component: ProductListComponent},
  {path: 'product-category/:category', component: DisplayCategoriesComponent},
  {path: 'products/:product', component: ProductListComponent},
  {path: 'product-details/:productDetail', component: ProductItemDetailComponent},
  {path: 'confirmation', component: ConfirmationComponent},
  {path: 'cart', component: CartComponent},
  {path: 'create-product', component: AddProductComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'signin', component: SignInComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
