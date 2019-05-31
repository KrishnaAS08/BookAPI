package com.cognizant.BookAPI.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cognizant.BookAPI.model.Book;
import com.cognizant.BookAPI.repo.BookRepository;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class BookController {
	
	@Autowired
	BookRepository repository;
	
	@GetMapping(value = "/books")
	public List<Book> getAllBooks() {
		System.out.println("Get all Books...");
		
		List<Book> books = new ArrayList<>();
		repository.findAll().forEach(books::add);
		
		return books;
	}
	
	@PostMapping(value = "/books/add")
	public Book addBook(@RequestBody Book book) {
		
		Book _book = repository.save(new Book(book.getTitle(), book.getAuthor()));
		return _book;
	}
	
	@PutMapping(value = "/books/update/{id}")
	public ResponseEntity<Book> updateBook(@PathVariable("id") Long id, @RequestBody Book book) {
		
		Optional<Book> bookdata = repository.findById(id);
		
		if(bookdata.isPresent()) {
			Book _book = bookdata.get();
			_book.setTitle(book.getTitle());
			_book.setAuthor(book.getAuthor());
			return new ResponseEntity<>(repository.save(_book),HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@DeleteMapping(value = "books/delete/{id}")
	public ResponseEntity<String> deleteBook(@PathVariable("id") Long id) {
		
		repository.deleteById(id);
		return new ResponseEntity<>("The Book has been deleted!",HttpStatus.OK);
	}
	
	@GetMapping(value = "/books/{id}")
	public Book getBookbyId(@PathVariable("id") Long id) {
		System.out.println("Get Book by id: " + id +"...");
		
		Book book = repository.findById(id).get();
		
		return book;
	}
}
