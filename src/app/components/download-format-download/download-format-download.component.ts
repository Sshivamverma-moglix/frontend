import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DownloadDialogData {
  title: string;
  message?: string;
}


@Component({
  selector: 'app-download-format-download',
  templateUrl: './download-format-download.component.html',
  styleUrls: ['./download-format-download.component.css']
})
export class DownloadFormatDownloadComponent {

  constructor(
    public dialogRef: MatDialogRef<DownloadFormatDownloadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DownloadDialogData
  ) { }

  onChoose(format: string) {
    this.dialogRef.close(format);
  }

}
