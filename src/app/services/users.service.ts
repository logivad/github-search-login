import { Injectable } from '@angular/core';
import { combineLatest, from, Observable, of, Subject } from 'rxjs';
import { Octokit } from '@octokit/core';
import {
    distinctUntilChanged,
    map,
    switchAll,
    takeUntil,
    catchError,
    switchMap,
} from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    query$ = new Subject<string>();
    pageIndex$ = new Subject<number>();
    pageSize$ = new Subject<number>();

    constructor(public http: HttpClient) {}

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
            switchMap(([query, pageIndex, pageSize]) => {
                const q = encodeURIComponent(`${query} in:login`);
                return this.http
                    .get(
                        `https://api.github.com/search/users?q=${q}&page=${pageIndex}&per_page=${pageSize}`
                    )
                    .pipe(
                        catchError((err: HttpErrorResponse) => {
                            return of(new Error(err.error.message));
                        })
                    );
            })
        );
    }
}
