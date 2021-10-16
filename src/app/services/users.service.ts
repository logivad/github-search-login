import { Injectable } from '@angular/core';
import { combineLatest, from, Observable, Subject } from 'rxjs';
import { Octokit } from '@octokit/core';
import { distinctUntilChanged, map, switchAll, takeUntil } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private query$ = new Subject<string>();
    private pageIndex$ = new Subject<number>();
    private pageSize$ = new Subject<number>();

    setQuery(val: string) {
        console.log('setQuery', val);
        this.query$.next(val);
    }

    setPageIndex(val: number) {
        console.log('setPageIndex', val);
        this.pageIndex$.next(val);
    }

    setPageSize(val: number) {
        console.log('setPageSize', val);
        this.pageSize$.next(val);
    }

    getData(): Observable<any> {
        const octokit = new Octokit({
            auth: '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',
        });

        return combineLatest([
            this.query$.pipe(distinctUntilChanged()),
            this.pageIndex$.pipe(distinctUntilChanged()),
            this.pageSize$.pipe(distinctUntilChanged()),
        ]).pipe(
            map(([query, pageIndex, pageSize]) =>
                from(
                    octokit.request('GET /search/users', {
                        q: query,
                        page: pageIndex + 1,
                        per_page: pageSize,
                    })
                )
            ),
            switchAll()
        );
    }
}
