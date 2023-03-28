import { Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})

export class SearchBarComponent implements OnInit{
  faSearch = faSearch;
  allProducts: string[] = [];
  filteredProducts: string[] = []
  productName: string = '';
  products: Product[] = [];
  show: boolean = false;

  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(res => {
      res?.forEach(r => {
        this.allProducts.push(r.name)
      })
    })
  }

  searchedProduct(productName: string): void {
    this.productService.getProductByName(productName).subscribe(res => {
      this.products = res;
    })

    setTimeout(() => {
      this.router.navigate(['products', this.products[0].name], {
        state: {product: this.products}
      })
    }, 1000);
    this.router.navigate([''])
  }

  showSuggestions(option: boolean): void {
    this.show = option
  }

  suggestions(): void {
    this.filteredProducts = this.allProducts.filter(r => {
      return r[this.productName.length - 1] === this.productName[this.productName.length - 1]
    })
  }

  redoSuggestions(): void {
    this.filteredProducts = this.allProducts;
  }


  checkProduct(productName: string) {
    this.showSuggestions(false);
    this.searchedProduct(productName);
    this.productName = '';
  }
}
