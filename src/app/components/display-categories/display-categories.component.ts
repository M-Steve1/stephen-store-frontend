import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { faEye, faCutlery, faPersonDress, faShirt, faDiamond, faBook, faComputer } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Product } from 'src/app/models/Product';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/models/Cart';

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
      res?.forEach(r => {
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
  
    if (localStorage.getItem(`item${product.id}`) === null) {
      localStorage.setItem(`item${product.id}`, (product.id as number).toString());
      localStorage.setItem(`productQuantity${product.id}`, product.productQuantity.toString());
    }

    this.router.navigateByUrl('/', {skipLocationChange: false}).then(() => {
      this.router.navigate(['product-category', product.category], {
        state: {products: this.products}
      })
    })
  }
}
