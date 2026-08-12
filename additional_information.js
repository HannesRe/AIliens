document.addEventListener('DOMContentLoaded', function() {
    // Image viewer functionality
    const imageElement = document.getElementById('featured-image');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let currentImageIndex = 1;
    const totalImages = 8;
    
    function updateImage() {
        imageElement.src = `LearningFakeImage/${currentImageIndex}.jpg`;
        
        // Disable/enable buttons based on current image
        prevBtn.disabled = currentImageIndex === 1;
        nextBtn.disabled = currentImageIndex === totalImages;
    }
    
    prevBtn.addEventListener('click', function() {
      currentImageIndex--;
        if (currentImageIndex < 1) 
            currentImageIndex=totalImages
        updateImage();
    });
    
    nextBtn.addEventListener('click', function() {
        currentImageIndex++;
        if (currentImageIndex > totalImages) 
            currentImageIndex=1
        updateImage();
    
    });
    
    // Initialize the image viewer
    updateImage();
  
    // Track selected cards
    const selectedCards = new Set();
  
    // Add event listeners to option cards
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            const topic = this.getAttribute('data-topic');
            
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            // Toggle selection
            if (selectedCards.has(topic)) {
                this.classList.remove('selected');
                selectedCards.delete(topic);
            } 
            else {
                this.classList.add('selected');
                selectedCards.add(topic);
            }
            
            showInfo(topic);
        });
    });
  
    // Add event listener to back button
    document.getElementById('back-btn').addEventListener('click', goBack);
});
  
function showInfo(topic) {
    // Hide all info sections first
    document.querySelectorAll('.info-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected info section
    const infoSection = document.getElementById(`${topic}-info`);
    if (infoSection) {
        infoSection.style.display = 'block';
        infoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
  
function goBack() {
    window.location.href = 'index.html';
}