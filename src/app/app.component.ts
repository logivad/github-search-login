import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, combineLatest, from } from 'rxjs';
import { IGithubSearchUsersResult } from 'src/app/interfaces';
import { distinctUntilChanged, map, startWith, switchAll } from 'rxjs/operators';
import { Octokit } from '@octokit/core';

const octokit = new Octokit();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  query$ = new Subject<string>();
  pageSize$ = new Subject<number>();
  pageIndex$ = new Subject<number>();

  data: Array<IGithubSearchUsersResult> = [];
  dataTotalCount = 0;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    combineLatest([
      this.query$.pipe(distinctUntilChanged()),
      this.pageSize$.pipe(startWith(5), distinctUntilChanged()),
      this.pageIndex$.pipe(startWith(0), distinctUntilChanged()),
    ])
      .pipe(
        map(([query, pageSize, pageIndex]) => {
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
        switchAll()
      )
      .subscribe((resp) => {
        this.data = resp.data.items;
        this.dataTotalCount = resp.data.total_count;
        console.log(resp);
      })
  }

  onQueryChange(query: string) {
    if (query) {
      this.query$.next(query);
    }
  }
}
