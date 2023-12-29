import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenderPageComponent } from './sender-page.component';

describe('SenderPageComponent', () => {
  let component: SenderPageComponent;
  let fixture: ComponentFixture<SenderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenderPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
