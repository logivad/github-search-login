import { UsersService } from './users.service';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';

describe('UsersService', () => {
    const service: UsersService = new UsersService();

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be able to call setter functions', () => {
        expect(service.setQuery('q')).toBeUndefined();
        expect(service.setPageSize(5)).toBeUndefined();
        expect(service.setPageIndex(4)).toBeUndefined();
    })

    it('should emit query when method invoked', (done) => {
        const testQuery = 'hello';

        service.query$.pipe(first()).subscribe((query) => {
            expect(query).toBe(testQuery);
            done();
        });

        service.setQuery(testQuery);
    });

    it('should emit pageSize when method invoked', (done) => {
        const testPageSize = 15;

        service.pageSize$.pipe(first()).subscribe((pageSize) => {
            expect(pageSize).toBe(testPageSize);
            done();
        });

        service.setPageSize(testPageSize);
    });

    it('should emit pageIndex when method invoked', (done) => {
        const testPageIndex = 2;

        service.pageIndex$.pipe(first()).subscribe((pageIndex) => {
            expect(pageIndex).toBe(testPageIndex);
            done();
        });

        service.setPageIndex(testPageIndex);
    });

    it('should return an Observable from getData()', function() {
        const o = service.getData();
        expect(o instanceof Observable).toBeTruthy();
    });
});
