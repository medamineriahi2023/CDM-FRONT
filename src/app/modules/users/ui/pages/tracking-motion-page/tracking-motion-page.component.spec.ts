import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingMotionPageComponent } from './tracking-motion-page.component';

describe('TrackingMotionPageComponent', () => {
  let component: TrackingMotionPageComponent;
  let fixture: ComponentFixture<TrackingMotionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingMotionPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingMotionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
