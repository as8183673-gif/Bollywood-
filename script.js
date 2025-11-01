// Movie Database Manager
class MovieDatabase {
    constructor() {
        this.storageKey = 'bollywoodMovies';
        this.init();
    }

    init() {
        // Initialize with default movies if none exist
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
            },
            {
                id: 4,
                title: "Kabir Singh",
                year: 2019,
                rating: 7.1,
                genre: ["Romance", "Drama"],
                poster: "https://m.media-amazon.com/images/M/MV5BYWY3ZDY4ZTItOTU5MC00OGU0LWI0YTYtNThlNjM4OTg4OWQ4XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg",
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
const moviesGrid = document.getElementById('moviesGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const header = document.getElementById('header');

// Display movies function
function displayMovies(moviesToDisplay) {
    moviesGrid.innerHTML = '';
    
    if (moviesToDisplay.length === 0) {
        moviesGrid.innerHTML = '<p class="no-movies">No movies found. Try a different search or filter.</p>';
        return;
    }
    
    moviesToDisplay.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/300x450/1f1f1f/ffffff?text=No+Image'">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="movie-year">${movie.year}</span>
                    <span class="movie-rating"><i class="fas fa-star"></i> ${movie.rating}</span>
                </div>
                <a href="${movie.watchLink}" class="watch-btn" target="_blank">Watch Now</a>
            </div>
        `;
        moviesGrid.appendChild(movieCard);
    });
}

// Filter movies function
function filterMovies(filter) {
    let filteredMovies = movieDB.getMovies();
    
    if (filter !== 'all') {
        if (filter === 'latest') {
            filteredMovies = filteredMovies.filter(movie => movie.year >= 2020);
        } else if (filter === 'classic') {
            filteredMovies = filteredMovies.filter(movie => movie.year < 2010);
        } else {
            filteredMovies = filteredMovies.filter(movie => 
                movie.genre.some(genre => 
                    genre.toLowerCase().includes(filter.toLowerCase())
                )
            );
        }
    }
    
    displayMovies(filteredMovies);
}

// Search movies function
function searchMovies(query) {
    const filteredMovies = movieDB.getMovies().filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
    );
    displayMovies(filteredMovies);
}

// Event Listeners
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        // Filter movies
        filterMovies(btn.dataset.filter);
    });
});

searchInput.addEventListener('input', (e) => {
    searchMovies(e.target.value);
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Initialize the page with all movies
displayMovies(movieDB.getMovies());
