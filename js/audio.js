class AudioSystem {
    constructor() {
        this.bgMusic = document.getElementById('bg-music');
        this.volume = 0;
        
        // We'll set the source dynamically or via wallpaper engine settings
    }

    setVolume(val) {
        this.volume = val;
        if (this.bgMusic) {
            this.bgMusic.volume = val / 100;
            if (val > 0 && this.bgMusic.paused) {
                // Browsers often block autoplay without user interaction, 
                // but Wallpaper Engine allows it.
                this.bgMusic.play().catch(e => console.log('Audio play prevented: ', e));
            } else if (val === 0 && !this.bgMusic.paused) {
                this.bgMusic.pause();
            }
        }
    }
}

window.spiderClock = window.spiderClock || {};
window.spiderClock.audio = new AudioSystem();
