import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Accesorios } from './accesorios';

describe('Accesorios', () => {
  let component: Accesorios;
  let fixture: ComponentFixture<Accesorios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accesorios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Accesorios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
