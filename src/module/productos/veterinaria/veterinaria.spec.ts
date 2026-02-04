import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Veterinaria } from './veterinaria';

describe('Veterinaria', () => {
  let component: Veterinaria;
  let fixture: ComponentFixture<Veterinaria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Veterinaria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Veterinaria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
