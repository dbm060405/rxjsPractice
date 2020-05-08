import {ChangeDetectionStrategy, Component} from '@angular/core';

import {ProductService} from '../product.service';
import {catchError, filter, map} from 'rxjs/operators';
import {combineLatest, EMPTY, Subject} from 'rxjs';
import {Product} from '../product';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  errorMessage$: Subject<string> = new Subject<string>();

  product$ = this.productService.product$.pipe(
    catchError(err => {
      this.errorMessage$.next(err);
      return EMPTY;
    })
  );

  pageTitle$ = this.product$.pipe(
    map((p: Product) => p ? `Product Detail for: ${p.productName}` : null)
  );

  productSuppliers$ = this.productService.productSuppliers$.pipe(
    catchError(err => {
      this.errorMessage$.next(err);
      return EMPTY;
    })
  );

  vm$ = combineLatest(
    [this.product$, this.pageTitle$, this.productSuppliers$]
  ).pipe(
    filter(([product]) => Boolean(product)),
    map(
      ([product, pageTitle, productSuppliers]) =>
        ({product, pageTitle, productSuppliers})
    )
  );

  constructor(private productService: ProductService) {
  }

}
