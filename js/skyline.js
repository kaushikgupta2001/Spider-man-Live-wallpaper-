class Skyline {
    constructor() {
        this.back = document.querySelector('.skyline-back');
        this.mid = document.querySelector('.skyline-mid');
        this.front = document.querySelector('.skyline-front');
        this.clouds = document.getElementById('clouds-container');
        this.skyLayer = document.getElementById('sky-layer');
        
        this.init();
    }

    init() {
        // Load SVGs
        this.back.style.backgroundImage = 'url(assets/skyline.svg)';
        this.mid.style.backgroundImage = 'url(assets/skyline.svg)';
        this.front.style.backgroundImage = 'url(assets/skyline.svg)';
        
        // Add moving clouds
        for(let i=0; i<5; i++) {
            let c = document.createElement('img');
            c.src = 'assets/cloud.svg';
            c.style.position = 'absolute';
            c.style.width = (Math.random() * 200 + 100) + 'px';
            c.style.top = (Math.random() * 40) + '%';
            c.style.left = (Math.random() * 100) + 'vw';
            c.style.opacity = Math.random() * 0.5 + 0.2;
            c.style.animation = `cloudMove ${Math.random() * 30 + 30}s linear infinite`;
            this.clouds.appendChild(c);
        }
        
        this.updateTimeOfDay();
        setInterval(() => this.updateTimeOfDay(), 60000);
    }
    
    updateTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) {
            this.skyLayer.style.background = 'radial-gradient(circle at center bottom, #e6b981 0%, #3e5151 100%)'; // Morning
        } else if (hour >= 12 && hour < 18) {
            this.skyLayer.style.background = 'radial-gradient(circle at center bottom, #004e92 0%, #000428 100%)'; // Day
        } else if (hour >= 18 && hour < 20) {
            this.skyLayer.style.background = 'radial-gradient(circle at center bottom, #b30000 0%, #4a00e0 100%)'; // Sunset
        } else {
            this.skyLayer.style.background = 'radial-gradient(circle at center bottom, #000000 0%, #000428 100%)'; // Night
        }
    }

    setParallax(mouseX) {
        const pct = mouseX / window.innerWidth - 0.5;
        this.back.style.transform = `translateX(${-pct * 20}px)`;
        this.mid.style.transform = `translateX(${-pct * 40}px)`;
        this.front.style.transform = `translateX(${-pct * 80}px)`;
    }
}

window.spiderClock = window.spiderClock || {};
window.spiderClock.skyline = new Skyline();
