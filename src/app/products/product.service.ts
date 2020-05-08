import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {BehaviorSubject, combineLatest, EMPTY, from, merge, Observable, Subject, throwError} from 'rxjs';
import {catchError, filter, map, mergeMap, scan, shareReplay, switchMap, tap, toArray} from 'rxjs/operators';

import {Product} from './product';
import {SupplierService} from '../suppliers/supplier.service';
import {ProductCategoryService} from '../product-categories/product-category.service';
import {Supplier} from '../suppliers/supplier';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;
  private selectedProductId$: BehaviorSubject<number> = new BehaviorSubject(0);
  private newProductToAdd$: Subject<Product> = new Subject();

  products$ = this.http.get<Array<Product>>(this.productsUrl)
    .pipe(
      tap(data => console.log('Products: ', JSON.stringify(data))),
      catchError(this.handleError)
    );

  productsWithCat$ = combineLatest(
    [this.products$, this.productCategoryService.categories$]
  ).pipe(
    map((
      [products, categories]
      ) =>
        products.map(product => ({
          ...product,
          price: product.price * 1.5,
          searchKey: [product.productName],
          category: categories.find(c => product.categoryId === c.id).name
        }) as Product)
    ),
    shareReplay(1)
  );

  product$ = combineLatest([
    this.productsWithCat$, this.selectedProductId$
  ]).pipe(
    map(
      ([products, selectProductId]) =>
        products.find(product => selectProductId ? product.id === selectProductId : EMPTY)
    ),
    tap(product => console.log('selected product is: ', product)),
    shareReplay(1)
  ) as Observable<Product>;

  productsWithAdd$ = merge(
    this.productsWithCat$, this.newProductToAdd$
  ).pipe(
    scan((acc: Array<Product>, value: Product) => [...acc, value])
  );

  // TODO: just in time approach
  productSuppliers$ = this.product$.pipe(
    filter(product => Boolean(product)),
    switchMap(product =>
      from(product.supplierIds).pipe(
        mergeMap(supplierId => this.http.get<Supplier>(`${this.suppliersUrl}/${supplierId}`)),
        toArray()
      )
    )
  );


  // TODO: get all approach
  // productSuppliers$ = combineLatest(
  //   [this.product$, this.supplierService.suppliers$]
  // ).pipe(
  //   map(
  //     ([product, suppliers]) =>
  //       suppliers.filter(supplier => product.supplierIds.includes(supplier.id))
  //   ),
  // );

  constructor(private http: HttpClient,
              private supplierService: SupplierService,
              private productCategoryService: ProductCategoryService) {
    this.productSuppliers$.subscribe(s => console.log(s));
  }

  private fakeProduct() {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30
    };
  }

  selectedProductChanged(id: number) {
    this.selectedProductId$.next(id);
  }

  addNewProduct(newProduct?: Product) {
    this.newProductToAdd$.next(newProduct || this.fakeProduct());
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
