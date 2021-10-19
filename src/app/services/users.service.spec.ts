import { UsersService } from './users.service';
import { first } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('UsersService', () => {
    it('should be created', () => {
        const httpSpy = jasmine.createSpyObj('http', ['get']);
        const service = new UsersService(httpSpy);

        expect(service).toBeTruthy();
    });

    it('should be able to call setter functions', () => {
        const httpSpy = jasmine.createSpyObj('http', ['get']);
        const service = new UsersService(httpSpy);

        expect(service.setQuery('q')).toBeUndefined();
        expect(service.setPageSize(5)).toBeUndefined();
        expect(service.setPageIndex(4)).toBeUndefined();
    })

    it('should emit query when method invoked', (done) => {
        const httpSpy = jasmine.createSpyObj('http', ['get']);
        const service = new UsersService(httpSpy);
        const testQuery = 'hello';

        service.query$.pipe(first()).subscribe((query) => {
            expect(query).toBe(testQuery);
            done();
        });

        service.setQuery(testQuery);
    });

    it('should emit pageSize when method invoked', (done) => {
        const httpSpy = jasmine.createSpyObj('http', ['get']);
        const service = new UsersService(httpSpy);
        const testPageSize = 15;

        service.pageSize$.pipe(first()).subscribe((pageSize) => {
            expect(pageSize).toBe(testPageSize);
            done();
        });

        service.setPageSize(testPageSize);
    });

    it('should emit pageIndex when method invoked', (done) => {
        const httpSpy = jasmine.createSpyObj('http', ['get']);
        const service = new UsersService(httpSpy);
        const testPageIndex = 2;

        service.pageIndex$.pipe(first()).subscribe((pageIndex) => {
            expect(pageIndex).toBe(testPageIndex);
            done();
        });

        service.setPageIndex(testPageIndex);
    });

    it('should return an Observable from getData()', function(done) {
        // @ts-ignore
        const http = {
            get() {
                return of(null);
            }
        } as HttpClient;

        const q = 'vadim';
        const pageIndex = 5;
        const pageSize = 4;

        spyOn(http, 'get').and.returnValue(of(null));
        const service = new UsersService(http);
        const o = service.getData();
        expect(o instanceof Observable).toBeTruthy();

        o.subscribe((data) => {
            const query = encodeURIComponent(`${q} in:login`);

            expect(http.get).toHaveBeenCalledTimes(1);
            expect(http.get).toHaveBeenCalledWith(`https://api.github.com/search/users?q=${query}&page=${pageIndex}&per_page=${pageSize}`)
            done();
        })

        service.setQuery(q);
        service.setPageSize(pageSize);
        service.setPageIndex(pageIndex);
    });
});
