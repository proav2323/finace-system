import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransdataComponent } from './transdata.component';

describe('TransdataComponent', () => {
  let component: TransdataComponent;
  let fixture: ComponentFixture<TransdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransdataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
