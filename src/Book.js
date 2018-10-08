import React from "react";

export default function Book(props) {
  const { title, imageLinks = {}, authors = [], shelf = "none" } = props.book;
  const { thumbnail } = imageLinks;
  const { updateBook } = props;
  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: 128,
            height: 193,
            backgroundImage: `url("${thumbnail}")`
          }}
        />
        <div className="book-shelf-changer">
          <select
            value={shelf}
            onChange={event => {
              updateBook(props.book, event.target.value);
            }}
          >
            <option value="move" disabled>
              Move to...
            </option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{title}</div>
      <div className="book-authors">{authors.join(", ")}</div>
    </div>
  );
}
