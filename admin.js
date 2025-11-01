// Movie Database Manager (Same as in script.js)
class MovieDatabase {
    constructor() {
        this.storageKey = 'bollywoodMovies';
        this.init();
    }

    init() {
        if (!this.getMovies().length) {
            this.setMovies(this.getDefaultMovies());
        }
    }

    getDefaultMovies() {
        return [
            {
                id: 1,
                title: "RRR",
                year: 2022,
                rating: 8.0,
                genre: ["Action", "Drama"],
                poster: "https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5Y2E5ZjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg",
                watchLink: "#"
            },
            {
                id: 2,
                title: "Dangal",
                year: 2016,
                rating: 8.4,
                genre: ["Action", "Drama", "Biography"],
                poster: "https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_FMjpg_UX1000_.jpg",
                watchLink: "#"
            },
            {
                id: 3,
                title: "3 Idiots",
                year: 2009,
                rating: 8.4,
                genre: ["Comedy", "Drama"],
                poster: "https://m.media-amazon.com/images/M/MV5BNTkyOGVjMGEtNmQzZi00NzFlLTlhOWQtODYyMDc2ZGJmYzFhXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg",
                watchLink: "#"
            }
        ];
    }

    getMovies() {
        const movies = localStorage.getItem(this.storageKey);
        return movies ? JSON.parse(movies) : [];
    }

    setMovies(movies) {
        localStorage.setItem(this.storageKey, JSON.stringify(movies));
    }

    addMovie(movie) {
        const movies = this.getMovies();
        const newId = movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1;
        movie.id = newId;
        movies.push(movie);
        this.setMovies(movies);
        return movie;
    }

    updateMovie(updatedMovie) {
        const movies = this.getMovies();
        const index = movies.findIndex(m => m.id === updatedMovie.id);
        if (index !== -1) {
            movies[index] = updatedMovie;
            this.setMovies(movies);
            return true;
        }
        return false;
    }

    deleteMovie(movieId) {
        const movies = this.getMovies();
        const filteredMovies = movies.filter(m => m.id !== movieId);
        this.setMovies(filteredMovies);
        return filteredMovies.length !== movies.length;
    }

    getMovieById(movieId) {
        const movies = this.getMovies();
        return movies.find(m => m.id === movieId);
    }
}

// Initialize database
const movieDB = new MovieDatabase();

// DOM Elements
const movieForm = document.getElementById('movieForm');
const messageDiv = document.getElementById('message');
const movieListContainer = document.getElementById('movieListContainer');
const movieCount = document.getElementById('movieCount');
const logoutBtn = document.getElementById('logoutBtn');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const movieIdInput = document.getElementById('movieId');

// Check authentication
if (sessionStorage.getItem('adminAuthenticated') !== 'true') {
    window.location.href = 'admin-login.html';
}

// Logout function
logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    sessionStorage.removeItem('adminAuthenticated');
    window.location.href = 'admin-login.html';
});

// Display movies in the admin panel
function displayMovies() {
    const movies = movieDB.getMovies();
    movieCount.textContent = movies.length;
    
    if (movies.length === 0) {
        movieListContainer.innerHTML = '<p>No movies added yet.</p>';
        return;
    }
    
    let moviesHTML = '';
    movies.forEach(movie => {
        moviesHTML += `
            <div class="movie-item">
                <div>
                    <strong>${movie.title}</strong> (${movie.year}) - Rating: ${movie.rating}
                    <br><small>${movie.genre.join(', ')}</small>
                </div>
                <div class="movie-actions">
                    <button class="edit-btn" data-id="${movie.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" data-id="${movie.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    });
    
    movieListContainer.innerHTML = moviesHTML;
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const movieId = parseInt(this.getAttribute('data-id'));
            editMovie(movieId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const movieId = parseInt(this.getAttribute('data-id'));
            deleteMovie(movieId);
        });
    });
}

// Edit movie function
function editMovie(movieId) {
    const movie = movieDB.getMovieById(movieId);
    if (movie) {
        // Fill form with movie data
        document.getElementById('movieId').value = movie.id;
        document.getElementById('title').value = movie.title;
        document.getElementById('poster').value = movie.poster;
        document.getElementById('watchLink').value = movie.watchLink;
        document.getElementById('year').value = movie.year;
        document.getElementById('rating').value = movie.rating;
        document.getElementById('genre').value = movie.genre.join(', ');
        
        // Change form to edit mode
        formTitle.textContent = 'Edit Movie';
        submitBtn.textContent = 'Update Movie';
        cancelBtn.style.display = 'block';
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete movie function
function deleteMovie(movieId) {
    const movie = movieDB.getMovieById(movieId);
    if (movie && confirm(`Are you sure you want to delete "${movie.title}"?`)) {
        if (movieDB.deleteMovie(movieId)) {
            showMessage(`"${movie.title}" deleted successfully!`, 'success');
            displayMovies();
            resetForm();
        }
    }
}

// Reset form function
function resetForm() {
    movieForm.reset();
    movieIdInput.value = '';
    formTitle.textContent = 'Add New Movie';
    submitBtn.textContent = 'Add Movie';
    cancelBtn.style.display = 'none';
}

// Cancel edit function
cancelBtn.addEventListener('click', resetForm);

// Show message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Form submission handler
movieForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        id: movieIdInput.value ? parseInt(movieIdInput.value) : null,
        title: document.getElementById('title').value,
        poster: document.getElementById('poster').value,
        watchLink: document.getElementById('watchLink').value,
        year: parseInt(document.getElementById('year').value),
        rating: parseFloat(document.getElementById('rating').value),
        genre: document.getElementById('genre').value.split(',').map(g => g.trim())
    };
    
    // Basic validation
    if (!formData.title || !formData.poster || !formData.watchLink) {
        showMessage('Please fill in all required fields!', 'error');
        return;
    }
    
    if (formData.year < 1950 || formData.year > 2023) {
        showMessage('Please enter a valid year between 1950 and 2023!', 'error');
        return;
    }
    
    if (formData.rating < 0 || formData.rating > 10) {
        showMessage('Please enter a valid rating between 0 and 10!', 'error');
        return;
    }
    
    let successMessage = '';
    
    if (formData.id) {
        // Update existing movie
        if (movieDB.updateMovie(formData)) {
            successMessage = `"${formData.title}" updated successfully!`;
        }
    } else {
        // Add new movie
        const newMovie = movieDB.addMovie(formData);
        successMessage = `"${newMovie.title}" added successfully!`;
    }
    
    showMessage(successMessage, 'success');
    displayMovies();
    resetForm();
});

// Initialize the admin panel
displayMovies();
