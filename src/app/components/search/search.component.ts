import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
    @Input()
    loading = false;

    @Output()
    queryChange = new EventEmitter<string>();

    query = '';

    onSubmit() {
        this.queryChange.emit(this.query);
    }
}
