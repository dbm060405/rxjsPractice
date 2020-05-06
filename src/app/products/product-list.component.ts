import {ChangeDetectionStrategy, Component} from '@angular/core';

import {BehaviorSubject, combineLatest, EMPTY} from 'rxjs';
import {ProductService} from './product.service';
import {catchError, map} from 'rxjs/operators';
import {Product} from './product';
import {ProductCategoryService} from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  selectedCatSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  categories$ = this.productCategoryService.categories$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  productSimpleFilter$ = combineLatest([this.productService.productsWithAdd$, this.selectedCatSubject])
    .pipe(
      map(([products, selectedCatId]) =>
          products.filter(product => selectedCatId ? product.categoryId === selectedCatId : true)
      ),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) {
  }

  onAdd(): void {
    console.log('Not yet implemented');
    this.productService.addNewProduct();
  }

  onSelected(categoryId: string): void {
    console.log(`category id changed to ${categoryId}`);
    this.selectedCatSubject.next(+categoryId);
  }
}
