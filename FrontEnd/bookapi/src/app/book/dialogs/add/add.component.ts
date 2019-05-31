import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from '../../models/book';
import { FormControl, Validators } from '@angular/forms';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'add-book',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public book: Book,
              public bookService: BookService) { }
  
  formControl = new FormControl('', [
    Validators.required
    ]);
            
  ngOnInit() {
  }
            
  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  public confirmAdd(): void {
    this.bookService.addBook(this.book)
      .subscribe(
        data => {
          console.log('Added Book', data);
        },
        error => {
          console.log('ERROR: ',error);
        }
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
  }

}
