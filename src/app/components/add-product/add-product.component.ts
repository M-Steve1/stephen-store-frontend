import { Component } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  name: string = '';
  price: number = 0;
  category: string = '';
  url: string = '';
  description: string = '';

  constructor(private productService: ProductService) {}

  createProduct(): void {
    const product: Product = {
      name: this.name,
      price: this.price,
      category: this.category,
      url: this.url,
      description: this.description
    }

    this.productService.createProduct(product);

    this.name = '';
    this.price = 0;
    this.category = '';
    this.url = '';
    this.description = '';

  }
}
