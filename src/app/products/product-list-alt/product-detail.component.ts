import {ChangeDetectionStrategy, Component} from '@angular/core';

import {ProductService} from '../product.service';
import {catchError} from 'rxjs/operators';
import {EMPTY, Subject} from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';
  errorMessage$: Subject<string> = new Subject<string>();

  product$ = this.productService.product$.pipe(
    catchError(err => {
      this.errorMessage$.next(err);
      return EMPTY;
    })
  );

  constructor(private productService: ProductService) { }

}
