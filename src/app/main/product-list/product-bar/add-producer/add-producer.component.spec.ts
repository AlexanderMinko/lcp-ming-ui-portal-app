import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProducerComponent } from './add-producer.component';

describe('AddProducerComponent', () => {
  let component: AddProducerComponent;
  let fixture: ComponentFixture<AddProducerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProducerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProducerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
