import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VorspeisenComponent } from './vorspeisen.component';

describe('VorspeisenComponent', () => {
  let component: VorspeisenComponent;
  let fixture: ComponentFixture<VorspeisenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VorspeisenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VorspeisenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
