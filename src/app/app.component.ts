import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { IGithubSearchUsersResult } from 'src/app/interfaces';
import { DestroyService } from 'src/app/services/destroy.service';
import { UsersService } from 'src/app/services/users.service';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DestroyService],
})
export class AppComponent implements OnInit {
    pageIndex$ = new BehaviorSubject<number>(0);

    data: Array<IGithubSearchUsersResult> = [];
    dataTotalCount = 0;

    constructor(
        private _destroy$: DestroyService,
        private _usersService: UsersService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this._usersService.getData()
            .pipe(takeUntil(this._destroy$))
            .subscribe((resp) => {
                this.data = resp.data.items;
                this.dataTotalCount = resp.data.total_count;
                this._changeDetectorRef.markForCheck();
            });
    }

    onQueryChange(query: string) {
        if (query) {
            this.pageIndex$.next(0);
            this._usersService.setQuery(query);
        }
    }
}
