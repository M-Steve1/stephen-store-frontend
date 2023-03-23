import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/Order';
import { Product } from 'src/app/models/Product';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent {
  faCheck: IconProp = faCheck;
  @Input() product: Product & {addedToCart?: string} = {
    name: '',
    price: 0,
    category: '',
    url: '',
    description: ''
  }

  @Output() createCart: EventEmitter<Product & {productQuantity: number}> = new EventEmitter();
  quantity: number = 1;

  constructor(private router: Router, private cartService: CartService) {}

  onDblClick(product: Product) {
    this.router.navigate(['product-details', product.name], {
      state: {productDetail: product}
    }
    );
  }

  onCreateCart(product: Product) {
    const theProduct: Product & {productQuantity: number} = {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      url: product.url,
      description: product.description,
      productQuantity: this.quantity
    }
    
    this.createCart.emit(theProduct);
    this.quantity = 1;
  }
}
