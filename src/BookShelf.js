import React from "react";
import Book from "./Book";
export default function Bookshelf(props) {
  const { books = [], updateBook, title } = props;
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {books.map(book => {
            return (
              <li key={book.id}>
                <Book
                  book={book}
                  updateBook={(book, shelf) => {
                    updateBook(book, shelf);
                  }}
                />
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
