import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleManagementPageComponent } from './article-management-page.component';

describe('ArticleManagementPageComponent', () => {
  let component: ArticleManagementPageComponent;
  let fixture: ComponentFixture<ArticleManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleManagementPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
