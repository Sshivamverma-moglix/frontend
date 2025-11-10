import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {

  // Pagination state
  @Input() totalItems: number = 0;  // ✅ Add this line
  @Input() pageSize: number = 10;    // optional: set default
  @Input() pageIndex: number = 0;   // optional: set default


  // Output event to parent
  @Output() paginationEvent = new EventEmitter<{ length: number, pageIndex: number, pageSize: number }>();

  // Handle paginator changes
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    // Emit a full PageEvent object
    this.paginationEvent.emit({
      ...event,
      length: this.totalItems
    });
  }

}

