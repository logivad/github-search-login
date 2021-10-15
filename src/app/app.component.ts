import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Subject, combineLatest, from } from 'rxjs';
import { IGithubSearchUsersResult } from 'src/app/interfaces';
import { distinctUntilChanged, filter, map, startWith, switchAll, takeUntil } from 'rxjs/operators';
import { Octokit } from '@octokit/core';
import { DestroyService } from 'src/app/services/destroy.service';

const octokit = new Octokit({
  auth: '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',
});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class AppComponent implements OnInit {
  query$ = new Subject<string>();

  skipPageIndex = false;
  pageSize$ = new Subject<number>();

  pageIndex$ = new Subject<number>();

  // pageSize = 5;
  pageIndex = 0;

  data: Array<IGithubSearchUsersResult> = [];
  dataTotalCount = 0;

  constructor(
    private cd: ChangeDetectorRef,
    private destroy$: DestroyService,
  ) {
  }

  ngOnInit() {

    combineLatest([
      this.query$.pipe(distinctUntilChanged()),
      this.pageSize$.pipe(startWith(5), distinctUntilChanged()),
      this.pageIndex$.pipe(startWith(0), distinctUntilChanged()),
    ])
      .pipe(
        filter(() => !this.skipPageIndex),
        map(([query, pageSize, pageIndex]) => {
          this.pageIndex = pageIndex;
          // const uri = `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=${pageSize}&page=${pageIndex + 1} in:login`;
          // return this.http.get<IGithubSearchResult<IGithubSearchUsersResult>>(uri);

          // I started with HttpClient but I had hard time trying to make Github API work.
          // For example these two requests return the same results:
          //   - curl 'https://api.github.com/search/users?q=asdf&page=1%3Ain:login'
          //   - curl 'https://api.github.com/search/users?q=asdf&page=2%3Ain:login'
          // Also when `page` goes before `per_page` pagination didn't work at all.
          // But this Octokit works. So let it work.
          return from(octokit.request('GET /search/users', {
            q: query,
            page: pageIndex + 1,
            per_page: pageSize,
          }))
        }),
        switchAll(),
        takeUntil(this.destroy$),
      )
      .subscribe((resp) => {
        this.data = resp.data.items;
        this.dataTotalCount = resp.data.total_count;
        this.cd.markForCheck();
      })
  }

  onQueryChange(query: string) {
    if (query) {
      // We need to clear page index but we don't want it to trigger
      // a request, so let's set skipPageIndex
      this.skipPageIndex = true;
      this.pageIndex = 0;
      this.pageIndex$.next(0);
      this.skipPageIndex = false;

      this.query$.next(query);
    }
  }
}
