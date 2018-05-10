import React, { Component } from 'react'

class Book extends Component {
  state = {
    shelf: 'none'
  }

  componentDidMount() {
    const { book } = this.props;
    if(book.shelf) {
      this.setState({ shelf: book.shelf })
    }
  }

  changeBookShelf = (event) => {
    this.setState({
      shelf: event.target.value
    })
     this.props.onUpdateBook(this.props.book, event.target.value)
  }
  render() {
   return (<li>
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{
            width: 128,
            height: 193,
            backgroundImage: `url(${this.props.book.imageLinks.thumbnail})`
          }}></div>
          <div className="book-shelf-changer">
            <select onChange={this.changeBookShelf} value={this.state.shelf}>
              <option value="none" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading
              </option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{this.props.book.title}</div>
        <div className="book-authors">{this.props.book.authors ? this.props.book.authors.toString() : ' '}</div>
      </div>
    </li>)
  }
}

export default Book