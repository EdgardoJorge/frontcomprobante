import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecojoComponent } from './recojo.component';

describe('RecojoComponent', () => {
  let component: RecojoComponent;
  let fixture: ComponentFixture<RecojoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecojoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecojoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
