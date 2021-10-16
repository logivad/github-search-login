import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IGithubSearchUsersResult } from 'src/app/interfaces';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent {
    @Input()
    data: Array<IGithubSearchUsersResult> = [];

    columnsToDisplay = ['avatar_url', 'login', 'type'];
}
