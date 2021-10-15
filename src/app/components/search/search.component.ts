import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  query = '';

  @Output()
  queryChange = new EventEmitter<string>();

  onSubmit() {
    this.queryChange.emit(this.query);
  }
}
