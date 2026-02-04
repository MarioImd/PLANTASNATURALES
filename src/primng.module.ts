import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Solo los módulos que necesitas
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    CardModule
  ],
  exports: [
    ButtonModule,
    InputTextModule,
    CardModule
  ]
})
export class PrimengModule { }