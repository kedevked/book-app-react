import React from 'react'
import './App.css'
import {Route, Link} from 'react-router-dom'
import ListBooks from './ListBooks'
import * as BooksAPI from './BooksAPI'
import Book from './Book'

class BooksApp extends React.Component {
  state = {
    books: [],
    query: '',
    showingBooks: []
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({books})
    })
  }

  updateShelf = (book, shelf) => {
    let books;
    if (this.state.books.findIndex(b => b.id === book.id) > 0) {
      // change the position of an existing book in the shelf
      books = this.state.books.map(b => {
        if (b.id === book.id) {
          return {...book, shelf}
        } else {
          return b
        }
      })
    } else {
      // add a new book to the shelf
      books = [...this.state.books, {...book, shelf}]
    }

    this.setState({books})

    BooksAPI.update(book, shelf).then((data) => {
      // shelf updated on the server
    })
  }

  updateQuery = (query) => {
    this.setState({query: query})
    let showingBooks = []
    if (query) {
      BooksAPI.search(query).then(response => {
        if (response.length) {
         showingBooks = response.map(b => {
           const index = this.state.books.findIndex(c => c.id === b.id)
            if( index >= 0 ) {
              return this.state.books[index]
            } else {
              return b
            }
          })
        }
        this.setState({showingBooks})
      })
    }
    else {
      this.setState({showingBooks})
    }
  }
  

  render() {
    const {query} = this.state;


    return (
      <div className="app">
        <Route exact path='/search' render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to="/">Close</Link>
              <div className="search-books-input-wrapper">
                <input type="text"
                       placeholder="Search by title or author"
                       value={query}
                       onChange={(event) => this.updateQuery(event.target.value)}
                />

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {this.state.showingBooks.map(book => (
                  <Book key={book.id} book={book} onUpdateBook={(book, shelf) => this.updateShelf(book, shelf)}></Book>
                ))}
              </ol>
            </div>
          </div>
        )}/>
        <Route exact path="/" render={() => (
          <ListBooks books={this.state.books}
                     onUpdateShelf={(book, shelf) => this.updateShelf(book, shelf)}/>
        )}/>
      </div>
    )
  }
}

export default BooksApp
