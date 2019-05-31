package com.cognizant.BookAPI.repo;

import org.springframework.data.repository.CrudRepository;

import com.cognizant.BookAPI.model.Book;

public interface BookRepository extends CrudRepository<Book, Long> {
	
	
}
