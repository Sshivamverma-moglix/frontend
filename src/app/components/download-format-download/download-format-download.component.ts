import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-download-format-download',
  templateUrl: './download-format-download.component.html',
  styleUrls: ['./download-format-download.component.css']
})
export class DownloadFormatDownloadComponent {

  constructor(public dialogRef: MatDialogRef<DownloadFormatDownloadComponent>) { }

  onChoose(format: string) {
    this.dialogRef.close(format);
  }

}
