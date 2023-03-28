import { Component } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-item-detail',
  templateUrl: './product-item-detail.component.html',
  styleUrls: ['./product-item-detail.component.css']
})
export class ProductItemDetailComponent {
  faArrowLeft = faArrowLeft;
  productDetail: Product = {
    name: '',
    price: 0,
    category: '',
    url: '',
    description: ''
  }

  quantity: number = 1;


  constructor(private router: Router) {
    this.productDetail = this.router.getCurrentNavigation()
    ?.extras
    .state
    ?.['productDetail'];
  }

  createCart(product: Product): void {
    if (localStorage.getItem(`item${product.id}`) === null) {
  localStorage.setItem(`item${product.id}`, (product.id as number).toString());
  localStorage.setItem(`productQuantity${product.id}`, this.quantity.toString());
}

    // Reload the page in order to update the cart 
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['product-details', product.name], {
        state: {productDetail: product}
      });
    })
  }
}