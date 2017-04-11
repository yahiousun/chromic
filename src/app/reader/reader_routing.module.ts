import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReaderComponent } from './reader.component';

const readerRoutes: Routes = [
  { path: 'reader:id', component: ReaderComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(readerRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ReaderRoutingModule { }
