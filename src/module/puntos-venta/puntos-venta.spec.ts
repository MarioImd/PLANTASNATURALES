import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntosVenta } from './puntos-venta';

describe('PuntosVenta', () => {
  let component: PuntosVenta;
  let fixture: ComponentFixture<PuntosVenta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuntosVenta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuntosVenta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
