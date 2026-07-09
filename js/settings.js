window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        const sc = window.spiderClock;
        
        if (properties.clockcolor && sc.clock) {
            let rgb = properties.clockcolor.value.split(' ').map(c => parseFloat(c));
            sc.clock.setColor(rgb);
        }
        
        if (properties.glowintensity) {
            let val = properties.glowintensity.value;
            let clockContainer = document.getElementById('clock-container');
            if (clockContainer) {
                clockContainer.style.boxShadow = `0 8px ${val}px 0 rgba(0, 0, 0, 0.37)`;
            }
        }
        
        if (properties.rainamount && sc.rain) {
            sc.rain.setAmount(properties.rainamount.value);
        }
        
        if (properties.animationspeed && sc.rain) {
            sc.rain.speedMultiplier = properties.animationspeed.value / 100;
        }
        
        if (properties.showseconds && sc.clock) {
            sc.clock.setShowSeconds(properties.showseconds.value);
        }
        
        if (properties.use24hour && sc.clock) {
            sc.clock.set24Hour(properties.use24hour.value);
        }
        
        if (properties.slideshowspeed && sc.slideshow) {
            sc.slideshow.setIntervalTime(properties.slideshowspeed.value);
        }
        
        if (properties.musicvolume && sc.audio) {
            sc.audio.setVolume(properties.musicvolume.value);
        }
    }
};
