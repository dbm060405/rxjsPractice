import {ChangeDetectionStrategy, Component} from '@angular/core';

import {EMPTY, Subject} from 'rxjs';
import {ProductService} from '../product.service';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage$: Subject<string> = new Subject<string>();

  products$ = this.productService.productsWithCat$.pipe(
    catchError(err => {
      this.errorMessage$.next(err);
      return EMPTY;
    })
  );

  selectedProduct$ = this.productService.product$.pipe(
    catchError(err => {
      this.errorMessage$.next(err);
      return EMPTY;
    })
  );

  constructor(private productService: ProductService) {
  }

  onSelected(productId: number): void {
    console.log(`here is this new Id: ${productId}`);
    this.productService.selectedProductChanged(+productId);
  }
}
