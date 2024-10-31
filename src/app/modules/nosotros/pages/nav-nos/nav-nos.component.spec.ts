import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavNosComponent } from './nav-nos.component';

describe('NavNosComponent', () => {
  let component: NavNosComponent;
  let fixture: ComponentFixture<NavNosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavNosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavNosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
