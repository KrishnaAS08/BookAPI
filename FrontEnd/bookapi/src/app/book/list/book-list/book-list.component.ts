import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { AddComponent } from '../../dialogs/add/add.component';
import { EditComponent } from '../../dialogs/edit/edit.component';
import { DeleteComponent } from '../../dialogs/delete/delete.component';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, fromEvent,merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {

  displayedColumns = ['id', 'title', 'author', 'actions'];
  exampleDatabase: BookService | null;
  dataSource: ExampleDataSource | null;
  index: number;
  id: number;  

  constructor(public dialog: MatDialog, public bookService: BookService, public http: HttpClient) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }


  addNew(book: Book) {
    const dialogRef = this.dialog.open(AddComponent, {
      data: {book: book}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.exampleDatabase.dataChange.value.push(this.bookService.dialogData);
        this.refreshTable();
        this.loadData();

      }
      
    });


  }

  startEdit(i: number, id: number, title: string, author: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(EditComponent, {
      data: {id: id, title: title, author: author}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        this.exampleDatabase.dataChange.value[foundIndex] = this.bookService.dialogData;
        this.refreshTable();
      }
      
    });
  }

  deleteItem(i: number, id: number, title: string, author: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {id: id, title: title, author: author}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
      
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.exampleDatabase = new BookService(this.http);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe((val) => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
        console.log(this.dataSource.filter);
      });
  }


}



export class ExampleDataSource extends DataSource<Book> {

  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  callNext(val){
    this._filterChange.next(val);
  }

  filteredData: Book[] = [];
  renderedData: Book[] = [];

  constructor(public _exampleDatabase: BookService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Book[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllBooks();


    return merge(...displayDataChanges).pipe(map( () => {
        // Filter data
        this.filteredData = this._exampleDatabase.data.slice().filter((book: Book) => {
          const searchStr = (book.id + book.title + book.author ).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        return this.renderedData;
      }
    ));
  }

  disconnect() {}


  /** Returns a sorted copy of the database data. */
  sortData(data: Book[]): Book[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this._sort.direction === 'asc';
      switch (this._sort.active) {
        case 'title': return compare(a.title, b.title, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'author': return compare(a.author, b.author, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
