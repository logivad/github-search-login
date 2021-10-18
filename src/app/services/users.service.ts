import { Injectable } from '@angular/core';
import { combineLatest, from, Observable, Subject } from 'rxjs';
import { Octokit } from '@octokit/core';
import { distinctUntilChanged, map, switchAll, takeUntil } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    query$ = new Subject<string>();
    pageIndex$ = new Subject<number>();
    pageSize$ = new Subject<number>();

    setQuery(val: string) {
        this.query$.next(val);
    }

    setPageIndex(val: number) {
        this.pageIndex$.next(val);
    }

    setPageSize(val: number) {
        this.pageSize$.next(val);
    }

    getData(): Observable<any> {
        const auth = process.env.NG_APP_OCTOKIT_TOKEN;
        let octokit: Octokit;

        if (!auth) {
            octokit = new Octokit({
                auth: process.env.NG_APP_OCTOKIT_TOKEN,
            });
        } else {
            octokit = new Octokit();
        }

        return combineLatest([
            this.query$.pipe(distinctUntilChanged()),
            this.pageIndex$.pipe(distinctUntilChanged()),
            this.pageSize$.pipe(distinctUntilChanged()),
        ]).pipe(
            map(([query, pageIndex, pageSize]) => {
                return from(
                    octokit.request('GET /search/users', {
                        q: query,
                        page: pageIndex + 1,
                        per_page: pageSize,
                    }).catch(err => err)
                )
            }),
            switchAll()
        );
    }
}
