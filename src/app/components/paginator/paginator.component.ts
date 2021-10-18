import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
} from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent implements OnInit {
    @Input()
    pageIndexSetter!: Observable<number>;

    @Input()
    set pageSize(val: number) {
        if (Number.isFinite(val)) {
            this._pageSize = val;
            this._usersService.setPageSize(this._pageSize);
        }
    }

    get pageSize() {
        return this._pageSize;
    }

    @Input()
    rowCount = 0;

    @Input()
    pageSizeOptions: Array<number> = [];

    pageIndex = 0;

    private _pageSize = 0;

    constructor(
        private _usersService: UsersService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.pageIndexSetter?.subscribe((pageIndex: number) => {
            if (Number.isFinite(pageIndex)) {
                this.pageIndex = pageIndex;
                this._usersService.setPageIndex(this.pageIndex);
            }
        })
    }

    onPaginatorChange(event: PageEvent) {
        this.pageIndex = event.pageIndex;
        this._usersService.setPageIndex(event.pageIndex);
        this._usersService.setPageSize(event.pageSize);
    }
}
