// Write your code here!
// File: index.js

// Sample quick-render fallback using the first JSONPlaceholder post
const samplePosts = [
    {
        userId: 1,
        id: 1,
        title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
    }
];

// Function to display posts
function displayPosts(posts) {
    const ul = document.getElementById('post-list');
    
    // Clear any existing content
    ul.innerHTML = '';
    
    // Loop through the posts list
    posts.forEach(post => {
        // Create li tag
        const li = document.createElement('li');
        li.className = 'post-item';
        
        // Create h1 tag for title
        const h1 = document.createElement('h1');
        h1.textContent = post.title;
        h1.className = 'post-title';
        
        // Create p tag for body
        const p = document.createElement('p');
        p.textContent = post.body;
        p.className = 'post-body';
        
        // Append h1 and p to li
        li.appendChild(h1);
        li.appendChild(p);
        
        // Append li to ul
        ul.appendChild(li);
    });
}

// Function to fetch posts (using fetch method)
function fetchPostsWithFetch() {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=1')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(posts => {
            displayPosts(posts);
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            displayError('Failed to load posts. Please try again later.');
        });
}

// Function to get random posts
function getRandomPosts(posts, count) {
    const shuffled = [...posts];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

// Refactored version using async/await
async function fetchPostsWithAsyncAwait() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=1');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const posts = await response.json();
        displayPosts(posts);
        
    } catch (error) {
        console.error('Error fetching posts:', error);
        displayError('Failed to load posts. Please try again later.');
    }
}

// Function to display error message
function displayError(message) {
    const ul = document.getElementById('post-list');
    ul.innerHTML = '';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    ul.appendChild(errorDiv);
}

// Function to get random posts for a specific tab (as per requirement)
async function loadRandomTabPosts(tabId) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const allPosts = await response.json();
        
        // Simulate different tabs showing different random posts
        const randomPosts = getRandomPosts(allPosts, 8);
        displayPosts(randomPosts);
        
        console.log(`Loaded ${randomPosts.length} random posts for tab: ${tabId}`);
        
    } catch (error) {
        console.error(`Error loading posts for tab ${tabId}:`, error);
        displayError(`Failed to load posts for this tab.`);
    }
}

// Alternative: Function that refreshes posts periodically
function autoRefreshPosts(intervalMs = 30000) {
    // Initial load
    fetchPostsWithAsyncAwait();
    
    // Refresh posts at specified interval
    setInterval(() => {
        fetchPostsWithAsyncAwait();
    }, intervalMs);
}

// Event listeners for different tab buttons (if you have multiple tabs)
function initializeApp() {
    // Render a quick sample immediately so the page has content before fetch resolves.
    displayPosts(samplePosts);

    // Option 1: Use async/await version
    fetchPostsWithAsyncAwait();
    
    // Option 2: Use fetch version (uncomment to use)
    // fetchPostsWithFetch();
    
    // Option 3: Auto-refresh posts every 30 seconds
    // autoRefreshPosts(30000);
    
    // Example: Load random posts for different tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const tabId = event.target.dataset.tabId;
            loadRandomTabPosts(tabId);
        });
    });
}

if (document.getElementById('post-list')) {
    initializeApp();
} else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export functions for testing (if using Node.js with module system)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        displayPosts,
        fetchPostsWithFetch,
        fetchPostsWithAsyncAwait,
        getRandomPosts,
        loadRandomTabPosts
    };
}