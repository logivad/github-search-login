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
import { MatSnackBar } from '@angular/material/snack-bar';

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
    loading = false;
    pristine = true;

    constructor(
        private _destroy$: DestroyService,
        private _usersService: UsersService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
    ) {}

    ngOnInit() {
        this._usersService.loadDataStart$
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                this.loading = true;
            });

        this._usersService.loadDataEnd$
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                this.loading = false;
                this.pristine = false;
            });

        this._usersService.getData()
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: (resp) => {
                    if (resp instanceof Error) {
                        this._snackBar.open(resp.message, 'ok');
                    } else {
                        this.data = resp.items;
                        this.dataTotalCount = resp.total_count;
                    }
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    onQueryChange(query: string) {
        if (query) {
            this.pageIndex$.next(0);
            this._usersService.setQuery(query);
        }
    }
}
