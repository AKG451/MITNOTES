document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.card');
    const noResults = document.getElementById('noResults');
    const blogGrid = document.querySelector('.blog-grid');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            let visibleCards = 0;

            cards.forEach(card => {
                const title = card.getAttribute('data-title').toLowerCase();
                const tags = card.getAttribute('data-tags').toLowerCase();
                const description = card.querySelector('.card-description').textContent.toLowerCase();
                
                const isMatch = title.includes(searchTerm) || 
                               tags.includes(searchTerm) || 
                               description.includes(searchTerm);

                if (isMatch) {
                    card.style.display = 'block';
                    visibleCards++;
                    
                    // Add search highlight animation
                    card.style.animation = 'searchHighlight 0.5s ease';
                    setTimeout(() => {
                        card.style.animation = '';
                    }, 500);
                } else {
                    card.style.display = 'none';
                }
            });

            // Show/hide no results message
            if (visibleCards === 0 && searchTerm !== '') {
                noResults.style.display = 'block';
                blogGrid.style.display = 'none';
            } else {
                noResults.style.display = 'none';
                blogGrid.style.display = 'grid';
            }
        });

        // Clear search on escape key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                this.dispatchEvent(new Event('input'));
                this.blur();
            }
        });
    }

    // Card hover effects
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle parallax effect
            const icon = this.querySelector('.card-icon');
            const overlay = this.querySelector('.card-overlay');
            
            if (icon) {
                icon.style.transform = 'scale(1.1) translateY(-5px)';
            }
            
            if (overlay) {
                overlay.style.transform = 'translateY(0)';
                overlay.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.card-icon');
            const overlay = this.querySelector('.card-overlay');
            
            if (icon) {
                icon.style.transform = 'scale(1) translateY(0)';
            }
            
            if (overlay) {
                overlay.style.transform = 'translateY(20px)';
                overlay.style.opacity = '0';
            }
        });

        // Add click animation
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-10px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }, 150);
        });
    });

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation for page transitions
    const links = document.querySelectorAll('a:not([href^="#"])');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add loading indicator
            const loadingDiv = document.createElement('div');
            loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            loadingDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 255, 255, 0.95);
                padding: 1rem 2rem;
                border-radius: 10px;
                z-index: 9999;
                color: #333;
                font-weight: 500;
            `;
            document.body.appendChild(loadingDiv);
            
            // Remove loading indicator after a short delay (in case page loads quickly)
            setTimeout(() => {
                if (document.body.contains(loadingDiv)) {
                    document.body.removeChild(loadingDiv);
                }
            }, 2000);
        });
    });
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes searchHighlight {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .card {
        animation: fadeIn 0.6s ease forwards;
    }
    
    .card:nth-child(1) { animation-delay: 0.1s; }
    .card:nth-child(2) { animation-delay: 0.2s; }
    .card:nth-child(3) { animation-delay: 0.3s; }
    .card:nth-child(4) { animation-delay: 0.4s; }
    .card:nth-child(5) { animation-delay: 0.5s; }
`;
document.head.appendChild(style);