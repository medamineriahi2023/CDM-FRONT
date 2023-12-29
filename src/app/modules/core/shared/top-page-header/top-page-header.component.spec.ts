import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPageHeaderComponent } from './top-page-header.component';

describe('TopPageHeaderComponent', () => {
  let component: TopPageHeaderComponent;
  let fixture: ComponentFixture<TopPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopPageHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
