import React from "react";
// import * as BooksAPI from './BooksAPI'
import "./App.css";
import BookShelf from "./BookShelf";
import { getAll, update, search } from "./BooksAPI";
import Book from "./Book";
class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    currentlyReading: [],
    wantToRead: [],
    read: [],
    books: {}
  };

  addBookToShelf(book, shelf) {
    this.setState(state => {
      return {
        books: {
          ...state.books,
          [book.id]: book
        },
        [shelf]: [...state[shelf], book]
      };
    });
  }

  handleSearchClose() {
    this.setState({
      showSearchPage: false,
      searchResults: [],
      searchTerm: ""
    });
  }

  resetShelfState() {
    this.setState({
      currentlyReading: [],
      wantToRead: [],
      read: []
    });
  }

  componentDidMount() {
    getAll().then((books = []) => {
      books.forEach(book => {
        this.addBookToShelf(book, book.shelf);
      });
    });
  }

  updateBook(book, shelf) {
    update(book, shelf).then(book => {
      this.resetShelfState();
      this.handleSearchClose();
      getAll().then((books = []) => {
        books.forEach(book => {
          this.addBookToShelf(book, book.shelf);
        });
      });
    });
  }

  handleSearch(event) {
    const { value } = event.target;
    this.setState({
      searchTerm: value
    });
    if (value) {
      search(value).then((results = []) => {
        const { books } = this.state;
        if (results.error) {
          this.setState({ searchResults: [] });
        } else {
          results.forEach(book => {
            const { id } = book;
            if (books[id]) {
              book["shelf"] = books[id].shelf;
            }
          });
          this.setState({ searchResults: results });
        }
      });
    } else {
      this.setState({ searchResults: [] });
    }
  }

  render() {
    const {
      currentlyReading,
      wantToRead,
      read,
      searchTerm = "",
      searchResults = []
    } = this.state;
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a
                className="close-search"
                onClick={() => this.handleSearchClose()}
              >
                Close
              </a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Search by title or author"
                  onChange={event => this.handleSearch(event)}
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {searchResults.map(book => (
                  <li key={book.id}>
                    <Book
                      book={book}
                      updateBook={(book, shelf) => this.updateBook(book, shelf)}
                    />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf
                  name="currentlyReading"
                  updateBook={(book, shelf) => this.updateBook(book, shelf)}
                  books={currentlyReading}
                  title="Currently Reading"
                />
                <BookShelf
                  updateBook={(book, shelf) => this.updateBook(book, shelf)}
                  name="wantToRead"
                  books={wantToRead}
                  title="Want to Read"
                />
                <BookShelf
                  updateBook={(book, shelf) => this.updateBook(book, shelf)}
                  name="read"
                  books={read}
                  title="Read"
                />
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>
                Add a book
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BooksApp;
