import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { faEye, faCutlery, faPersonDress, faShirt, faDiamond, faBook, faComputer } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Product } from 'src/app/models/Product';
import { Order } from 'src/app/models/Order';
import { OrderService } from 'src/app/services/order.service';
import { Cart } from 'src/app/models/Cart';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-display-categories',
  templateUrl: './display-categories.component.html',
  styleUrls: ['./display-categories.component.css']
})
export class DisplayCategoriesComponent implements OnInit{
  allCategories: string[] = [];
  categoriesAndIcons: {category: string, icon: IconProp}[] = [
    {category: '', icon: faEye}, 
    {category: '', icon:faCutlery},
    {category: '', icon:faPersonDress},
    {category: '', icon:faShirt},
    {category: '', icon:faDiamond},
    {category: '', icon:faBook},
    {category: '', icon:faComputer}
  ]
  products: Product[] = [];
  category: string = '';

  constructor(private productService: ProductService, private router: Router, private cartService: CartService) {
    this.products = this.router.getCurrentNavigation()
    ?.extras
    .state
    ?.['products'];
  }

  ngOnInit(): void {
    this.productService.getAllProductCategories().subscribe(res => {
      res.forEach(r => {
        this.allCategories.push(r.category)
      })
      for (let i = 0; i < this.categoriesAndIcons.length; i++) {
        this.categoriesAndIcons[i].category = this.allCategories[i];
      }
    })
  }

  theCategory(category: string): void {
    this.category = category;
    this.productService.getProductsByCategory(category).subscribe(res => {
      this.products = res;
    }
  ) 
    // delay for this.product to be updated before routing
    setTimeout(() => {
      this.router.navigate(['product-category', category], {
        state: {products: this.products}
      })
    }, 1000);
  }

  hasRoute(router: string): boolean {
    const result = this.router.url.split('/');
    const routerSplit = router.split('/');
    if (result[1] === routerSplit[1]) {
      return true;
    } else {
      return false;
    }
  }
  
  createCart(product: Product & {productQuantity: number}): void {
    const token = sessionStorage.getItem('myToken')
    if (token === null) {
      localStorage.setItem(`item${product.id}`, product.id as string);
      localStorage.setItem(`productQuantity${product.id}`, product.productQuantity.toString());
      console.log(localStorage)
    } else {
       const userId  = sessionStorage.getItem('userId');
       const cart: Cart = {
         user_id: userId as string,
         status: 'active'
       }
       this.cartService.getCartByUserId(cart.user_id).subscribe((res) => {
        if (res !== null && res.user_id === cart.user_id) {
          this.cartService.addProductInCart({cart_id: res.id as string, product_id: product.id as string, product_quantity: product.productQuantity}).subscribe()
        } else {
          this.cartService.create(cart).subscribe((res) => {
            this.cartService.addProductInCart({cart_id: res.id as string, product_id: product.id as string, product_quantity: product.productQuantity}).subscribe()
          })
        }
       })
    }
   

    this.router.navigateByUrl('/', {skipLocationChange: false}).then(() => {
      this.router.navigate(['product-category', product.category], {
        state: {products: this.products}
      })
    })
  }
}
