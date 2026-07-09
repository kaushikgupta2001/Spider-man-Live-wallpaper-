class Weather {
    constructor() {
        this.lightningOverlay = document.getElementById('lightning-overlay');
        this.rainSystem = window.spiderClock.rain;
        
        this.startLightningTimer();
    }
    
    startLightningTimer() {
        setTimeout(() => {
            this.flashLightning();
            this.startLightningTimer();
        }, Math.random() * 10000 + 5000); // Every 5-15 seconds
    }
    
    flashLightning() {
        if (this.rainSystem.amount < 30) return; // Only lightning if raining decently
        
        this.lightningOverlay.style.animation = 'none';
        void this.lightningOverlay.offsetWidth; // Trigger reflow
        this.lightningOverlay.style.animation = 'lightningFlash 0.5s ease-out';
    }
}

window.spiderClock = window.spiderClock || {};
window.spiderClock.weather = new Weather();
