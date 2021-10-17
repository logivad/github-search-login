import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IGithubSearchUsersResult } from 'src/app/interfaces';
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent {
    @Input()
    set data(val: Array<IGithubSearchUsersResult>) {
        this._data = val;
        this.sortData({ active: 'login', direction: 'asc' });
    }

    get data() {
        return this._data;
    }

    columnsToDisplay = ['avatar_url', 'login', 'type'];

    private _data: Array<IGithubSearchUsersResult> = [];

    sortData(event: Sort) {
        const prop = event.active as keyof IGithubSearchUsersResult;
        if (event.direction) {
            this.data.sort((a, b) => {
                const first = a[prop].toLowerCase();
                const second = b[prop].toLowerCase();

                if (first === second) {
                    return 0;
                }

                if (event.direction === 'asc') {
                    return first > second ? 1 : -1;
                } else {
                    return first > second ? -1 : 1;
                }
            });

            this._data = this.data.slice();
        }
    }
}
