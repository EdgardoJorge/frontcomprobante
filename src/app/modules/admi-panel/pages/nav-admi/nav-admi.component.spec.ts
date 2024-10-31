import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavAdmiComponent } from './nav-admi.component';

describe('NavAdmiComponent', () => {
  let component: NavAdmiComponent;
  let fixture: ComponentFixture<NavAdmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavAdmiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavAdmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
