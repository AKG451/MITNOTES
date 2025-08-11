document.addEventListener('DOMContentLoaded', function() {
// Stacked Cards Navigation
const cards = document.querySelectorAll('.card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const cardStack = document.querySelector('.card-stack');
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');
    const cardStackContainer = document.querySelector('.card-stack-container');
    
    let currentIndex = 2; // Start with middle card (index 2) as active
    let isAnimating = false;

    function updateCardPositions() {
        if (isAnimating) return;
        
        cards.forEach((card, index) => {
            card.classList.remove('active');
            
            // Calculate relative position from current active card
            const relativePos = index - currentIndex;
            
            // Reset any inline styles from previous animations
            card.style.display = 'block';
            
            // Apply positioning based on relative position
            if (relativePos === -2) {
                card.setAttribute('data-index', '0');
            } else if (relativePos === -1) {
                card.setAttribute('data-index', '1');
            } else if (relativePos === 0) {
                card.setAttribute('data-index', '2');
                card.classList.add('active');
            } else if (relativePos === 1) {
                card.setAttribute('data-index', '3');
            } else if (relativePos === 2) {
                card.setAttribute('data-index', '4');
            } else {
                // Hide cards that are too far from center
                card.style.display = 'none';
            }
        });
    }

    function navigateNext() {
        if (isAnimating) return;
        
        isAnimating = true;
        currentIndex = (currentIndex + 1) % cards.length;
    updateCardPositions();
        
        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }

    function navigatePrev() {
        if (isAnimating) return;
        
        isAnimating = true;
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCardPositions();
        
        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }

    // Event listeners for navigation
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Next button clicked');
            navigateNext();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Prev button clicked');
            navigatePrev();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navigatePrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navigateNext();
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (cardStack) {
        cardStack.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        cardStack.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            const difference = touchStartX - touchEndX;
            
            if (Math.abs(difference) > 50) { // Minimum swipe distance
                if (difference > 0) {
                    navigateNext(); // Swipe left = next
                } else {
                    navigatePrev(); // Swipe right = previous
                }
            }
        });
    }

    // Search functionality (modified for stacked cards)
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            let visibleCards = 0;

            if (searchTerm === '') {
                // Reset to stacked view
                cardStackContainer.style.display = 'block';
                noResults.style.display = 'none';
                updateCardPositions();
                return;
            }

            cards.forEach((card, index) => {
                const title = card.getAttribute('data-title').toLowerCase();
                const tags = card.getAttribute('data-tags').toLowerCase();
                const description = card.querySelector('.card-description').textContent.toLowerCase();
                
                const isMatch = title.includes(searchTerm) || 
                               tags.includes(searchTerm) || 
                               description.includes(searchTerm);

                if (isMatch) {
                    visibleCards++;
                    
                    // If this is the first match, make it active
                    if (visibleCards === 1) {
                        currentIndex = index;
                    }
                }
            });

            // Show/hide no results message
            if (visibleCards === 0) {
                cardStackContainer.style.display = 'none';
                noResults.style.display = 'block';
            } else {
                cardStackContainer.style.display = 'block';
                noResults.style.display = 'none';
                updateCardPositions();
                
                // Add search highlight animation to active card
                const activeCard = cards[currentIndex];
                if (activeCard) {
                    activeCard.style.animation = 'searchHighlight 0.5s ease';
                    setTimeout(() => {
                        activeCard.style.animation = '';
                    }, 500);
                }
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

    // Enhanced card hover effects for active card
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (this.classList.contains('active')) {
                const icon = this.querySelector('.card-icon');
                const overlay = this.querySelector('.card-overlay');
                
                if (icon) {
                    icon.style.transform = 'scale(1.1) translateY(-5px)';
                }
            }
        });

        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('active')) {
                const icon = this.querySelector('.card-icon');
                
                if (icon) {
                    icon.style.transform = 'scale(1) translateY(0)';
                }
            }
        });

        // Click to activate card (if not already active)
        card.addEventListener('click', function(e) {
            const cardIndex = Array.from(cards).indexOf(this);
            if (cardIndex !== currentIndex && cardIndex >= 0) {
                e.preventDefault(); // Prevent navigation
                currentIndex = cardIndex;
                updateCardPositions();
            }
        });
    });

    // Initialize the stack
    console.log('Initializing card stack...');
    console.log('Found cards:', cards.length);
    console.log('Next button:', nextBtn);
    console.log('Prev button:', prevBtn);
    updateCardPositions();

    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes searchHighlight {
            0% { transform: translateY(0) translateX(0) scale(1) rotateY(0deg); }
            50% { transform: translateY(-10px) translateX(0) scale(1.05) rotateY(0deg); }
            100% { transform: translateY(0) translateX(0) scale(1) rotateY(0deg); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .card-stack {
            animation: fadeIn 0.8s ease forwards;
        }
    `;
    document.head.appendChild(style);
});