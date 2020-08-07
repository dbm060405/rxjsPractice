import {Component} from '@angular/core';
import {GoogleDriveProvider} from './shared/google-drive-provider';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle = 'Acme Product Management';

  constructor(private googleProvider: GoogleDriveProvider) {}

  testGoogle() {
    this.googleProvider.load().subscribe();
  }
}
