import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionPageComponent } from './decision-page.component';

describe('DecisionPageComponent', () => {
  let component: DecisionPageComponent;
  let fixture: ComponentFixture<DecisionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
