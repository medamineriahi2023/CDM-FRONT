import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfractionPageComponent } from './infraction-page.component';

describe('InfractionPageComponent', () => {
  let component: InfractionPageComponent;
  let fixture: ComponentFixture<InfractionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfractionPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfractionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
