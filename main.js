document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');
    const searchBookForm = document.getElementById('searchBook');
    const searchBookTitle = document.getElementById('searchBookTitle');
    
    let editingBookId = null;

    function createBookItem({ id, title, author, year, isComplete }) {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.dataset.bookid = id;
        bookItem.dataset.testid = 'bookItem';
        
        bookItem.innerHTML = `
            <h3 data-testid="bookItemTitle">${title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${author}</p>
            <p data-testid="bookItemYear">Tahun: ${year}</p>
            <div>
                <button data-testid="bookItemIsCompleteButton">${isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
                <button data-testid="bookItemDeleteButton">Hapus Buku</button>
                <button data-testid="bookItemEditButton">Edit Buku</button>
            </div>
        `;
        return bookItem;
    }

    function appendBookToList(book) {
        const bookItem = createBookItem(book);
        const targetList = book.isComplete ? completeBookList : incompleteBookList;
        targetList.appendChild(bookItem);
    }

    function saveBooksToLocalStorage() {
        const books = [];
        document.querySelectorAll('#incompleteBookList .book-item, #completeBookList .book-item').forEach(bookItem => {
            const title = bookItem.querySelector('[data-testid="bookItemTitle"]').textContent;
            const author = bookItem.querySelector('[data-testid="bookItemAuthor"]').textContent.split(': ')[1];
            const year = parseInt(bookItem.querySelector('[data-testid="bookItemYear"]').textContent.split(': ')[1], 10);
            const isComplete = bookItem.parentElement.id === 'completeBookList';
            books.push({
                id: bookItem.dataset.bookid,
                title,
                author,
                year,
                isComplete
            });
        });
        localStorage.setItem('books', JSON.stringify(books));
    }

    function loadBooksFromLocalStorage() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        books.forEach(book => appendBookToList(book));
    }

    loadBooksFromLocalStorage();

    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('bookFormTitle').value;
        const author = document.getElementById('bookFormAuthor').value;
        const year = parseInt(document.getElementById('bookFormYear').value, 10);
        const isComplete = document.getElementById('bookFormIsComplete').checked;

        if (editingBookId) {
            const bookItem = document.querySelector(`.book-item[data-bookid="${editingBookId}"]`);
            bookItem.querySelector('[data-testid="bookItemTitle"]').textContent = title;
            bookItem.querySelector('[data-testid="bookItemAuthor"]').textContent = `Penulis: ${author}`;
            bookItem.querySelector('[data-testid="bookItemYear"]').textContent = `Tahun: ${year}`;
            bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]').textContent = isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';

            if (isComplete) {
                completeBookList.appendChild(bookItem);
            } else {
                incompleteBookList.appendChild(bookItem);
            }
        } else {
            const bookId = new Date().getTime(); // ID unik berdasarkan timestamp
            const bookItem = createBookItem({ id: bookId, title, author, year, isComplete });
            if (isComplete) {
                completeBookList.appendChild(bookItem);
            } else {
                incompleteBookList.appendChild(bookItem);
            }
        }

        saveBooksToLocalStorage();
        bookForm.reset();
        editingBookId = null;
    });

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.dataset.testid === 'bookItemIsCompleteButton') {
            const bookItem = target.closest('.book-item');
            const isComplete = bookItem.parentElement.id === 'incompleteBookList';
            target.textContent = isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
            (isComplete ? completeBookList : incompleteBookList).appendChild(bookItem);
            saveBooksToLocalStorage();
        } else if (target.dataset.testid === 'bookItemDeleteButton') {
            target.closest('.book-item').remove();
            saveBooksToLocalStorage();
        } else if (target.dataset.testid === 'bookItemEditButton') {
            const bookItem = target.closest('.book-item');
            document.getElementById('bookFormTitle').value = bookItem.querySelector('[data-testid="bookItemTitle"]').textContent;
            document.getElementById('bookFormAuthor').value = bookItem.querySelector('[data-testid="bookItemAuthor"]').textContent.split(': ')[1];
            document.getElementById('bookFormYear').value = parseInt(bookItem.querySelector('[data-testid="bookItemYear"]').textContent.split(': ')[1], 10);
            document.getElementById('bookFormIsComplete').checked = bookItem.parentElement.id === 'completeBookList';

            editingBookId = bookItem.dataset.bookid;
        }
    });

    function searchBooks(query) {
        query = query.toLowerCase();
        document.querySelectorAll('#incompleteBookList .book-item, #completeBookList .book-item').forEach(bookItem => {
            const title = bookItem.querySelector('[data-testid="bookItemTitle"]').textContent.toLowerCase();
            bookItem.style.display = title.includes(query) ? '' : 'none';
        });
    }

    searchBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        searchBooks(searchBookTitle.value);
    });
});
