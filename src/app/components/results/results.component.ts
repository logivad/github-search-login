import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { IGithubSearchResult, IGithubSearchUsersResult } from 'src/app/interfaces';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  @Input()
  data: Array<IGithubSearchUsersResult> = [];

  @Input()
  dataCount = 0;

  @Output()
  pageSizeChange = new EventEmitter<number>();

  @Output()
  pageIndexChange = new EventEmitter<number>();

  columnsToDisplay = ['avatar_url', 'login', 'type'];

  constructor() { }

  ngOnInit(): void {
  }


  onPaginatorChange(event: PageEvent) {
    this.pageSizeChange.emit(event.pageSize);
    this.pageIndexChange.emit(event.pageIndex);
  }
}
