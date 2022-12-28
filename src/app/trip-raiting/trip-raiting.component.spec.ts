import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripRaitingComponent } from './trip-raiting.component';

describe('TripRaitingComponent', () => {
  let component: TripRaitingComponent;
  let fixture: ComponentFixture<TripRaitingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripRaitingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripRaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
