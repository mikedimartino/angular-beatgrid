import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundBrowserComponent } from './sound-browser.component';

describe('SoundBrowserComponent', () => {
  let component: SoundBrowserComponent;
  let fixture: ComponentFixture<SoundBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoundBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
