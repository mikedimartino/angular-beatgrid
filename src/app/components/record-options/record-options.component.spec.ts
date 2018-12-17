import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordOptionsComponent } from './record-options.component';

describe('RecordOptionsComponent', () => {
  let component: RecordOptionsComponent;
  let fixture: ComponentFixture<RecordOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
