import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverPageComponent } from './receiver-page.component';

describe('ReceiverPageComponent', () => {
  let component: ReceiverPageComponent;
  let fixture: ComponentFixture<ReceiverPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiverPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiverPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
