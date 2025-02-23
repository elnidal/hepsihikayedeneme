// Sample content data (you can replace this with real content later)
const sampleContent = {
    hikaye: [
        {
            title: 'Örnek Öykü 1',
            excerpt: 'Güzel bir yaz günüydü...',
            date: '2025-02-23',
            image: 'images/story1.jpg'
        },
        // Add more stories as needed
    ],
    masal: [
        {
            title: 'Örnek Masal 1',
            excerpt: 'Bir varmış bir yokmuş...',
            date: '2025-02-23',
            image: 'images/fairytale1.jpg'
        },
        // Add more fairy tales as needed
    ],
    // Add similar arrays for roman, siir, and video
};

// Function to create a content card
function createContentCard(item) {
    return `
        <div class="col-md-4 mb-4">
            <div class="card h-100 fade-in">
                <img src="${item.image}" class="card-img-top" alt="${item.title}" onerror="this.src='https://via.placeholder.com/350x200'">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.excerpt}</p>
                    <p class="card-text"><small class="text-muted">${item.date}</small></p>
                </div>
            </div>
        </div>
    `;
}

// Function to load content for each section
function loadContent() {
    Object.keys(sampleContent).forEach(section => {
        const contentContainer = document.getElementById(`${section}-content`);
        if (contentContainer && sampleContent[section]) {
            contentContainer.innerHTML = sampleContent[section]
                .map(item => createContentCard(item))
                .join('');
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    
    // Get all navigation buttons and content sections
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');

    // Add click event listeners to navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all buttons and sections
            navButtons.forEach(btn => btn.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the target section and show it
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle direct navigation through URL hash
    if (window.location.hash) {
        const targetButton = document.querySelector(`a[href="${window.location.hash}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }

    // Add animation to sections when they become visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    document.querySelectorAll('section').forEach((section) => {
        observer.observe(section);
    });
});

// Global variables for image handling
let selectedImages = [];
const MAX_IMAGES = 5;

// Show/Hide New Post Form
function showNewPostForm() {
    document.getElementById('newPostModal').style.display = 'block';
}

function hideNewPostForm() {
    document.getElementById('newPostModal').style.display = 'none';
    selectedImages = [];
    document.getElementById('imagePreviewGallery').innerHTML = '';
}

// Handle Image Upload
document.getElementById('postImages').addEventListener('change', handleImageSelect);
document.getElementById('uploadArea').addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
});

document.getElementById('uploadArea').addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
});

document.getElementById('uploadArea').addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    handleFiles(files);
});

function handleImageSelect(event) {
    const files = event.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    const remainingSlots = MAX_IMAGES - selectedImages.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    
    filesToProcess.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                selectedImages.push({
                    file: file,
                    dataUrl: e.target.result
                });
                updateImagePreviewGallery();
            };
            reader.readAsDataURL(file);
        }
    });
}

function updateImagePreviewGallery() {
    const gallery = document.getElementById('imagePreviewGallery');
    gallery.innerHTML = '';
    
    selectedImages.forEach((image, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
            <img src="${image.dataUrl}" alt="Preview ${index + 1}">
            <button class="remove-image" onclick="removeImage(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        gallery.appendChild(previewItem);
    });
}

function removeImage(index) {
    selectedImages.splice(index, 1);
    updateImagePreviewGallery();
}

// Handle Form Submission
document.getElementById('newPostForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    
    // Create new post HTML
    const postHTML = createPostHTML(title, content, selectedImages);
    
    // Add the new post to the top of the posts container
    const postsContainer = document.querySelector('.posts-container');
    postsContainer.insertAdjacentHTML('afterbegin', postHTML);
    
    // Reset form and close modal
    this.reset();
    hideNewPostForm();
});

// Create Post HTML
function createPostHTML(title, content, images) {
    const currentDate = new Date().toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    const galleryHTML = createGalleryHTML(images);
    
    return `
        <article class="post-card">
            <div class="post-header">
                <div class="author-info">
                    <img src="images/profile.jpg" alt="mrt ztrk" class="author-image">
                    <div class="post-meta">
                        <div class="author-name">mrt ztrk</div>
                        <div class="post-date">${currentDate} · 1 dakikada okunur</div>
                    </div>
                </div>
                <div class="post-actions">
                    <button class="more-options"><i class="fas fa-ellipsis-v"></i></button>
                </div>
            </div>
            <div class="post-content">
                <h2 class="post-title">${title}</h2>
                <div class="post-text">${content}</div>
                ${galleryHTML}
            </div>
            <div class="post-footer">
                <div class="post-stats">
                    <span>0 görüntüleme</span>
                    <span>0 yorum</span>
                </div>
                <button class="like-button"><i class="far fa-heart"></i></button>
            </div>
        </article>
    `;
}

function createGalleryHTML(images) {
    if (!images.length) return '';
    
    let galleryClass = 'post-gallery';
    if (images.length === 1) galleryClass += ' single-image';
    if (images.length === 2) galleryClass += ' two-images';
    if (images.length === 3) galleryClass += ' three-images';
    
    const maxVisibleImages = 4;
    const visibleImages = images.slice(0, maxVisibleImages);
    const remainingCount = images.length - maxVisibleImages;
    
    const imagesHTML = visibleImages.map((image, index) => {
        const isLast = index === maxVisibleImages - 1 && remainingCount > 0;
        const className = isLast ? 'gallery-item more-images' : 'gallery-item';
        const dataAttr = isLast ? `data-remaining="+${remainingCount}"` : '';
        
        return `
            <div class="${className}" ${dataAttr} onclick="openLightbox(${index})">
                <img src="${image.dataUrl}" alt="Post image ${index + 1}">
            </div>
        `;
    }).join('');
    
    return `
        <div class="${galleryClass}" data-total-images="${images.length}">
            ${imagesHTML}
        </div>
    `;
}

// Lightbox functionality
let currentImageIndex = 0;

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${selectedImages[index].dataUrl}" alt="Lightbox image" class="lightbox-image">
            <div class="lightbox-nav">
                <button class="lightbox-button prev" onclick="navigateLightbox(-1)">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="lightbox-button next" onclick="navigateLightbox(1)">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <button class="lightbox-close" onclick="closeLightbox()">×</button>
        </div>
    `;
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => lightbox.style.display = 'block', 100);
}

function navigateLightbox(direction) {
    currentImageIndex = (currentImageIndex + direction + selectedImages.length) % selectedImages.length;
    const lightboxImage = document.querySelector('.lightbox-image');
    lightboxImage.src = selectedImages[currentImageIndex].dataUrl;
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.remove();
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('newPostModal');
    if (event.target === modal) {
        hideNewPostForm();
    }
};

// Function to fetch posts from Contentful
async function fetchPosts() {
    try {
        const entries = await contentfulClient.getEntries({
            content_type: 'blogPost',
            order: '-sys.createdAt'
        });
        
        const postsContainer = document.querySelector('.posts-container');
        postsContainer.innerHTML = ''; // Clear existing posts
        
        entries.items.forEach(entry => {
            const post = entry.fields;
            const images = post.images ? post.images.map(image => image.fields.file.url) : [];
            
            const postHTML = createPostHTML(
                post.title,
                post.content,
                images.map(url => ({ dataUrl: url }))
            );
            
            postsContainer.insertAdjacentHTML('beforeend', postHTML);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Function to fetch posts by category
async function fetchPostsByCategory(category = null) {
    try {
        const query = {
            content_type: 'blogPost',
            order: '-sys.createdAt'
        };
        
        if (category) {
            query['fields.category'] = category;
        }
        
        const entries = await contentfulClient.getEntries(query);
        
        const postsContainer = document.querySelector('.posts-container');
        postsContainer.innerHTML = ''; // Clear existing posts
        
        if (entries.items.length === 0) {
            postsContainer.innerHTML = '<div class="no-posts">Bu kategoride henüz yazı bulunmamaktadır.</div>';
            return;
        }
        
        entries.items.forEach(entry => {
            const post = entry.fields;
            const images = post.images ? post.images.map(image => image.fields.file.url) : [];
            
            const postHTML = createPostHTML(
                post.title,
                post.content,
                images.map(url => ({ dataUrl: url }))
            );
            
            postsContainer.insertAdjacentHTML('beforeend', postHTML);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Initialize category functionality
function initializeCategories() {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get category and fetch posts
            const category = button.getAttribute('data-category');
            console.log('Selected category:', category); // Debug log
            fetchPostsByCategory(category);
        });
    });
    
    // Load initial posts (all or default category)
    const defaultCategory = document.querySelector('.nav-button.active')?.getAttribute('data-category');
    fetchPostsByCategory(defaultCategory);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCategories();
});

// Load posts when page loads
document.addEventListener('DOMContentLoaded', fetchPosts);
