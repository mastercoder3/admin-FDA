import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimmingsComponent } from './timmings.component';

describe('TimmingsComponent', () => {
  let component: TimmingsComponent;
  let fixture: ComponentFixture<TimmingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimmingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimmingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
