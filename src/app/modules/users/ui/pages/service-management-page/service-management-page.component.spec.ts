import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceManagementPageComponent } from './service-management-page.component';

describe('ServiceManagementPageComponent', () => {
  let component: ServiceManagementPageComponent;
  let fixture: ComponentFixture<ServiceManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceManagementPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
