import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from '../../models/book';
import { FormControl, Validators } from '@angular/forms';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'edit-book',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditComponent>,
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

  submit() {

  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  doneEdit(id: number): void {
    this.bookService.updateBook(id,
      this.book)
      .subscribe(
        data => {
          console.log('Updated Book>>>',data);
        },
        error => {
          console.log('ERROR: ',error);
        }
      );
  }
  
  

}
