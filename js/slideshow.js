class Slideshow {
    constructor() {
        this.layer = document.getElementById('slideshow-layer');
        this.images = [];
        this.currentIndex = 0;
        this.intervalTime = 30000; // 30 seconds default
        this.timer = null;
        this.imageElements = [];
        
        this.init();
    }

    async init() {
        try {
            // Use the statically generated image list to bypass local CORS restrictions
            this.images = window.spiderClockImages || [];
            
            if (this.images.length > 0) {
                // Shuffle array
                this.images = this.images.sort(() => Math.random() - 0.5);
                
                // Create two image containers for crossfading
                for(let i=0; i<2; i++) {
                    let img = document.createElement('div');
                    img.className = 'slideshow-image';
                    this.layer.appendChild(img);
                    this.imageElements.push(img);
                }
                
                this.showNext();
                this.startTimer();
            }
        } catch (e) {
            console.error("Could not load slideshow images:", e);
        }
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.showNext(), this.intervalTime);
    }

    setIntervalTime(val) {
        // value from 1 to 60 seconds
        this.intervalTime = val * 1000;
        this.startTimer();
    }

    showNext() {
        const nextImage = this.images[this.currentIndex];
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        
        // Determine which element is currently active
        const activeEl = this.imageElements.find(el => el.classList.contains('active'));
        const nextEl = this.imageElements.find(el => !el.classList.contains('active'));
        
        if (nextEl) {
            const safeUrl = encodeURIComponent(nextImage).replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
            nextEl.style.backgroundImage = `url("assets/backgrounds/${safeUrl}")`;
            
            // Random glitch effect class
            const glitches = ['glitch-1', 'glitch-2', 'glitch-none', 'glitch-none'];
            const glitchClass = glitches[Math.floor(Math.random() * glitches.length)];
            
            // Apply glitch animation
            nextEl.className = `slideshow-image active ${glitchClass}`;
            
            if (activeEl) {
                activeEl.className = 'slideshow-image fade-out';
                setTimeout(() => {
                    activeEl.className = 'slideshow-image'; // reset after fade
                }, 1000);
            }
        }
        
        this.currentIndex = nextIndex;
    }
}

window.spiderClock = window.spiderClock || {};
window.spiderClock.slideshow = new Slideshow();
