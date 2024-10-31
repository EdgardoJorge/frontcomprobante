import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesBrandsComponent } from './categories-brands.component';

describe('CategoriesBrandsComponent', () => {
  let component: CategoriesBrandsComponent;
  let fixture: ComponentFixture<CategoriesBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesBrandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
