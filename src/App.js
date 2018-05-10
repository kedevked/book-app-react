import React from 'react'
// import * as BooksAPI from './BooksAPI'
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
      console.log(this.state.books)
    })
  }

  updateShelf = (book, shelf) => {
    let books;
    if (this.state.books.includes(book)) {
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

    if (query) {
      BooksAPI.search(query).then(response => {
        console.log('response', response)
        this.setState({showingBooks: response})
      })
    } else {
      this.setState({showingBooks: []})
    }
  }
  

  render() {
    const {query} = this.state;


    return (
      <div className="app">
        <Route exact path='/search' render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to='/'>Close</Link>
              {/*<a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>*/}
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
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
