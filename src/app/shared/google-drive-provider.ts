import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';


/*
  Generated class for the GoogleDrive provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
  apiKey = AIzaSyDjrprLqkS8spXL4ryluYdScc6uQrsBpao
*/
@Injectable(
  {providedIn: 'root'}
)
export class GoogleDriveProvider {
  data: any = null;
  id = '1limUgcHdp4LRUFy0KcGBjeL-YL6YK7BeJ2YJTnFeGJI';
  key = 'AIzaSyDjrprLqkS8spXL4ryluYdScc6uQrsBpao';

  constructor(public http: HttpClient) {}

  load() {
    const url = `https://docs.google.com/spreadsheets/${this.id}/edit#gid=0&key=${this.key}`;
    // don't have the data yet
    return this.http.get(url)
      .pipe(
        tap(response => console.log(response))
        // map((res: any) => {
        //   const data = res.feed.entry;
        //
        //   const returnArray: Array<any> = [];
        //   if (data && data.length > 0) {
        //     data.forEach(entry => {
        //       const obj = {};
        //       for (const x in entry) {
        //         if (x.includes('gsx$') && entry[x].$t) {
        //           obj[x.split('$')[1]] = entry[x]['$t'];
        //         }
        //       }
        //       returnArray.push(obj);
        //     });
        //   }
        //   return returnArray;
        // })
      );
  }
}
