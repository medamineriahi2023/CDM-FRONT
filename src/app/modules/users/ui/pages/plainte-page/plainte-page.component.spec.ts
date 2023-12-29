import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaintePageComponent } from './plainte-page.component';

describe('PlaintePageComponent', () => {
  let component: PlaintePageComponent;
  let fixture: ComponentFixture<PlaintePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaintePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaintePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
