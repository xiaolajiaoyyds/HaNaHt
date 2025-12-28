class GestureHandler {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      onSwipeLeft: () => {},
      onSwipeRight: () => {},
      threshold: 50,
      ...options
    };
    
    this.startX = 0;
    this.currentX = 0;
    this.isDragging = false;
    
    this.init();
  }
  
  init() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }
  
  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.isDragging = true;
    this.element.style.transition = 'none';
  }
  
  handleTouchMove(e) {
    if (!this.isDragging) return;
    
    this.currentX = e.touches[0].clientX;
    const diff = this.currentX - this.startX;
    
    // Limit swipe range
    if (Math.abs(diff) > 20) {
      this.element.style.transform = `translateX(${diff}px)`;
    }
  }
  
  handleTouchEnd(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    const diff = this.currentX - this.startX;
    this.element.style.transition = 'transform 0.3s ease-out';
    
    if (diff < -this.options.threshold) {
      // Swipe Left
      this.element.style.transform = 'translateX(-100px)';
      this.options.onSwipeLeft(this.element);
    } else if (diff > this.options.threshold) {
      // Swipe Right
      this.element.style.transform = 'translateX(100px)';
      this.options.onSwipeRight(this.element);
    } else {
      // Reset
      this.element.style.transform = 'translateX(0)';
    }
    
    // Reset after action (optional, depending on UX)
    setTimeout(() => {
      this.element.style.transform = 'translateX(0)';
    }, 1000);
  }
}

// Auto init on elements with data-gesture
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-gesture="swipe"]').forEach(el => {
    new GestureHandler(el, {
      onSwipeLeft: (target) => {
        console.log('Swiped Left');
        // Example: Show delete button or action
      }
    });
  });
});