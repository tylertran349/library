const booksContainer = document.querySelector('#books-container');
const addBookButton = document.querySelector('#add-book-btn');
const addBookOverlay = document.querySelector('#add-book-overlay');
const submitButton = document.querySelector('#submit-button');
const titleInput = document.querySelector('#title-input');
const authorInput = document.querySelector('#author-input');
const pagesInput = document.querySelector('#pages-input');
const statusInput = document.querySelector('#status-checkbox');
const form = document.querySelector('#form');

let myLibrary = [];

function Book(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
}

function addStatusButtonListeners() {
    statusButtons = document.querySelectorAll('#status');
    statusButtons.forEach((statusButton) => {
        statusButton.addEventListener('click', () => {
            changeReadStatus(statusButton.getAttribute("data-index"));
        });
    });
}

function addRemoveButtonListeners() {
    removeButtons = document.querySelectorAll('#remove');
    removeButtons.forEach((removeButton) => {
        removeButton.addEventListener('click', () => {
            removeBook(removeButton.getAttribute("data-index"));
        });
    });
}

function changeReadStatus(index) {
    if(myLibrary[index].status === true) {
        myLibrary[index].status = false;
        printBooksToScreen();
    } else {
        myLibrary[index].status = true;
        printBooksToScreen();
    }
}

function removeBook(index) {
    myLibrary.splice(index, 1);
    printBooksToScreen(); // Update book divs with new indices and update books on screen
}

function addBookToScreen(obj, index) {
    // Create elements
    bookDiv = document.createElement('div');
    title = document.createElement('span');
    author = document.createElement('span');
    pages = document.createElement('span');
    statusButton = document.createElement('button');
    removeButton = document.createElement('button');

    // Change text content of elements
    title.textContent = obj.title;
    author.textContent = obj.author;
    pages.textContent = obj.pages;
    removeButton.textContent = "Remove";

    // Change read/not read status of element
    if(obj.status === true) {
        statusButton.textContent = "Read";
        statusButton.setAttribute('style', 'background: #9fff9c');
    } else {
        statusButton.textContent = "Not read";
    }

    // Add data attribute for each element that corresponds to its index in the library array
    statusButton.setAttribute('data-index', index);
    removeButton.setAttribute('data-index', index);

    // Add ID attribute for each element
    bookDiv.setAttribute('id', 'book');
    title.setAttribute('id', 'title');
    author.setAttribute('id', 'author');
    pages.setAttribute('id', 'pages');
    statusButton.setAttribute('id', 'status');
    removeButton.setAttribute('id', 'remove');

    // Add all book div content (children nodes) to book div (parent node)
    bookDiv.appendChild(title);
    bookDiv.appendChild(author);
    bookDiv.appendChild(pages);
    bookDiv.appendChild(statusButton);
    bookDiv.appendChild(removeButton);

    // Add book div (child node) to content div (parent node)
    booksContainer.appendChild(bookDiv);
}

function addBookToLibrary(title, author, pages, status) {
    temp = new Book(title, author, pages, status);
    myLibrary.push(temp); // Add book to myLibrary array
    printBooksToScreen(); // Print new book list to screen
}

function printBooksToScreen() {
    // Clear all current books from screen
    books = document.querySelectorAll('#book');
    books.forEach((book) => {
        book.remove();
    });

    // Go through myLibrary array and add each book to the DOM individually
    for(let i = 0; i < myLibrary.length; i++) {
        addBookToScreen(myLibrary[i], i);
    }
    addStatusButtonListeners(); // Add event listeners for all status buttons
    addRemoveButtonListeners(); // Add event listeners for all remove buttons
}

// If add book button is clicked, show add book overlay
addBookButton.addEventListener('click', () => {
    addBookOverlay.style.display = "flex";
});

// When form is submitted, add the new book, reset the form input values, and hide the add book overlay
function submitFunction() {
    const titleError = document.querySelector('#title-error');
    const authorError = document.querySelector('#author-error');
    const pagesError = document.querySelector('#pages-error');

    if(!titleInput.validity.valid || !authorInput.validity.valid || !pagesInput.validity.valid) {
        if(titleInput.validity.valueMissing) {
            titleError.textContent = "You must enter a title.";
            titleError.style.display = "flex";
        } else {
            titleError.style.display = "none"; // Hide title error message if title is valid
        }

        if(authorInput.validity.valueMissing) {
            authorError.textContent = "You must enter an author.";
            authorError.style.display = "flex";
        } else {
            authorError.style.display = "none"; // Hide author error message if author is valid
        }

        if(pagesInput.validity.valueMissing) {
            pagesError.textContent = "You must enter a number.";
            pagesError.style.display = "flex";
        } else if(pagesInput.validity.rangeUnderflow) {
            pagesError.textContent = "You must enter a number greater than or equal to 1.";
            pagesError.style.display = "flex";
        } else if(pagesInput.validity.rangeOverflow) {
            pagesError.textContent = "You must enter a number less than or equal to 10000.";
            pagesError.style.display = "flex";
        } else {
            pagesError.style.display = "none"; // Hide pages error message if page count is valid
        }
        return; // Break out of function if any part of the form is invalid
    }

    addBookToLibrary(titleInput.value, authorInput.value, pagesInput.value, statusInput.checked);
    form.reset(); // Reset form input values
    addBookOverlay.style.display = "none"; // Hide add book overlay
    
    /* Hide all form error messages if the whole form is successfully submitted (no validation errors) */
    titleError.style.display = "none";
    authorError.style.display = "none"; 
    pagesError.style.display = "none"; 
}

addBookOverlay.addEventListener('click', function(event) {
  if (addBookOverlay !== event.target) {
    return;
  } else {
    addBookOverlay.style.display = "none"; // Only hide book overlay if user is pressing any part of the add book overlay, not including the form container or inputs themselves
  }
}, false);