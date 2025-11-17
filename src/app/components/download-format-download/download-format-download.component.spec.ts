import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFormatDownloadComponent } from './download-format-download.component';

describe('DownloadFormatDownloadComponent', () => {
  let component: DownloadFormatDownloadComponent;
  let fixture: ComponentFixture<DownloadFormatDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadFormatDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadFormatDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
