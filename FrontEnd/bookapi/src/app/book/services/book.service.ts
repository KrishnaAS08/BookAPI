import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/book';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private baseUrl = 'http://localhost:8091/api/books';
  
  dataChange: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);
  dialogData: any;

  constructor(private http: HttpClient) {}

  get data() : Book[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllBooks(): void {
    this.http.get<Book[]>(`${this.baseUrl}`)
      .subscribe(
        data => {
          this.dataChange.next(data);
          console.log('Data>>>',this.dataChange.value);
        },
        (error: HttpErrorResponse) => {
          console.log (error.name + ' ' + error.message);
        }
      );
  }

  getBookList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  addBook(book: Book): Observable<any> {
    this.dialogData = book;
    return this.http.post(`${this.baseUrl}`+ `/add`, book);
  }

  updateBook(id: number, book: Book): Observable<any> {
    this.dialogData = book;
    return this.http.put(`${this.baseUrl}` + `/update` + `/${id}`, book);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}` + `/delete` + `/${id}`, { responseType: 'text' });
  }

  getBookById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}` + `/${id}`);
  }
}
