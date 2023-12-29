import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutOfStockPageComponent } from './out-of-stock-page.component';

describe('OutOfStockPageComponent', () => {
  let component: OutOfStockPageComponent;
  let fixture: ComponentFixture<OutOfStockPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutOfStockPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutOfStockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
