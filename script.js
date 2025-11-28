// Digital Library Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // DOM Elements
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    const booksGrid = document.getElementById('books-grid');
    const noBooks = document.getElementById('no-books');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeLogin = document.getElementById('close-login');
    const loginForm = document.getElementById('login-form');
    const adminModal = document.getElementById('admin-modal');
    const closeAdmin = document.getElementById('close-admin');
    const addBookForm = document.getElementById('add-book-form');
    const editMenuForm = document.getElementById('edit-menu-form');
    const bookCoverInput = document.getElementById('book-cover');
    const imagePreview = document.getElementById('image-preview');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Current category for filtering
    let currentCategory = 'all';
    
    // Initialize the application
    function initApp() {
        // Initialize localStorage if empty
        if (!localStorage.getItem('books')) {
            localStorage.setItem('books', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('menuItems')) {
            const defaultMenu = {
                'bengali': 'Bengali',
                'english': 'English',
                'geography': 'Geography',
                'life-science': 'Life Science',
                'physical-science': 'Physical Science',
                'mathematics': 'Mathematics',
                'comparative-exam': 'Comparative Exam Books'
            };
            localStorage.setItem('menuItems', JSON.stringify(defaultMenu));
        }
        
        // Load books and update UI
        loadBooks();
        updateMenuFromStorage();
    }
    
    // Load books from localStorage and display them
    function loadBooks() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        displayBooks(books);
    }
    
    // Display books in the grid
    function displayBooks(books) {
        booksGrid.innerHTML = '';
        
        // Filter books by current category if not 'all'
        const filteredBooks = currentCategory === 'all' 
            ? books 
            : books.filter(book => book.category === currentCategory);
        
        if (filteredBooks.length === 0) {
            noBooks.style.display = 'block';
            return;
        }
        
        noBooks.style.display = 'none';
        
        filteredBooks.forEach(book => {
            const bookCard = createBookCard(book);
            booksGrid.appendChild(bookCard);
        });
    }
    
    // Create a book card element
    function createBookCard(book) {
        const card = document.createElement('div');
        card.className = 'book-card';
        
        card.innerHTML = `
            <img src="${book.cover}" alt="${book.name}" class="book-cover">
            <div class="book-info">
                <h3 class="book-title">${book.name}</h3>
                <p class="book-description">${book.description}</p>
                <a href="${book.url}" target="_blank" class="download-btn">Download</a>
            </div>
        `;
        
        return card;
    }
    
    // Update menu items from localStorage
    function updateMenuFromStorage() {
        const menuItems = JSON.parse(localStorage.getItem('menuItems'));
        const navLinks = document.querySelectorAll('.nav-link[data-category]');
        
        navLinks.forEach(link => {
            const category = link.getAttribute('data-category');
            if (category !== 'all' && menuItems[category]) {
                link.textContent = menuItems[category];
            }
        });
    }
    
    // Event Listeners
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Category navigation
    document.querySelectorAll('.nav-link[data-category]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            document.querySelectorAll('.nav-link').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update current category and display books
            currentCategory = this.getAttribute('data-category');
            loadBooks();
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Admin login button
    adminLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'block';
    });
    
    // Close login modal
    closeLogin.addEventListener('click', function() {
        loginModal.style.display = 'none';
        loginForm.reset();
        document.getElementById('login-error').textContent = '';
    });
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('login-error');
        
        // Check credentials
        if (username === 'pass' && password === 'pass@2003') {
            loginModal.style.display = 'none';
            adminModal.style.display = 'block';
            loginForm.reset();
            errorElement.textContent = '';
            
            // Load current menu values into form
            const menuItems = JSON.parse(localStorage.getItem('menuItems'));
            document.getElementById('bengali-menu').value = menuItems.bengali;
            document.getElementById('english-menu').value = menuItems.english;
            document.getElementById('geography-menu').value = menuItems.geography;
            document.getElementById('life-science-menu').value = menuItems['life-science'];
            document.getElementById('physical-science-menu').value = menuItems['physical-science'];
            document.getElementById('mathematics-menu').value = menuItems.mathematics;
            document.getElementById('comparative-exam-menu').value = menuItems['comparative-exam'];
        } else {
            errorElement.textContent = 'Invalid username or password';
        }
    });
    
    // Close admin modal
    closeAdmin.addEventListener('click', function() {
        adminModal.style.display = 'none';
        addBookForm.reset();
        imagePreview.innerHTML = '';
    });
    
    // Tab switching in admin panel
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Image preview for book cover
    bookCoverInput.addEventListener('change', function() {
        const file = this.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.addEventListener('load', function() {
                imagePreview.innerHTML = `<img src="${reader.result}" alt="Preview">`;
            });
            
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '';
        }
    });
    
    // Add book form submission
    addBookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const bookName = document.getElementById('book-name').value;
        const bookDescription = document.getElementById('book-description').value;
        const bookCategory = document.getElementById('book-category').value;
        const bookUrl = document.getElementById('book-url').value;
        const bookCoverFile = bookCoverInput.files[0];
        
        if (!bookCoverFile) {
            alert('Please select a book cover image');
            return;
        }
        
        // Convert image to Base64
        const reader = new FileReader();
        reader.onload = function() {
            const bookCoverBase64 = reader.result;
            
            // Create book object
            const newBook = {
                id: Date.now(), // Simple ID generation
                name: bookName,
                description: bookDescription,
                category: bookCategory,
                url: bookUrl,
                cover: bookCoverBase64
            };
            
            // Save to localStorage
            const books = JSON.parse(localStorage.getItem('books')) || [];
            books.push(newBook);
            localStorage.setItem('books', JSON.stringify(books));
            
            // Reset form and show success message
            addBookForm.reset();
            imagePreview.innerHTML = '';
            alert('Book added successfully!');
            
            // Reload books if we're in the same category
            if (currentCategory === 'all' || currentCategory === bookCategory) {
                loadBooks();
            }
        };
        
        reader.readAsDataURL(bookCoverFile);
    });
    
    // Edit menu form submission
    editMenuForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get updated menu values
        const updatedMenu = {
            'bengali': document.getElementById('bengali-menu').value,
            'english': document.getElementById('english-menu').value,
            'geography': document.getElementById('geography-menu').value,
            'life-science': document.getElementById('life-science-menu').value,
            'physical-science': document.getElementById('physical-science-menu').value,
            'mathematics': document.getElementById('mathematics-menu').value,
            'comparative-exam': document.getElementById('comparative-exam-menu').value
        };
        
        // Save to localStorage
        localStorage.setItem('menuItems', JSON.stringify(updatedMenu));
        
        // Update UI
        updateMenuFromStorage();
        
        alert('Menu updated successfully!');
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
            loginForm.reset();
            document.getElementById('login-error').textContent = '';
        }
        
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
            addBookForm.reset();
            imagePreview.innerHTML = '';
        }
    });
});
