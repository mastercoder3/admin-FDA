import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PizzaExtrasComponent } from './pizza-extras.component';

describe('PizzaExtrasComponent', () => {
  let component: PizzaExtrasComponent;
  let fixture: ComponentFixture<PizzaExtrasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PizzaExtrasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PizzaExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
