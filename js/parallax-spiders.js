class ParallaxSpiders {
    constructor() {
        this.container = document.getElementById('parallax-spiders-container');
        this.spiders = [];
        this.init();
    }

    init() {
        if (!this.container) return;
        
        // Configuration for generated spiders
        const spiderConfigs = [
            { depth: 0.2, size: 30, x: 10, y: 150, blur: 4, opacity: 0.4 }, // Deep background left
            { depth: 0.5, size: 50, x: 85, y: 200, blur: 2, opacity: 0.6 }, // Mid background right
            { depth: 1.2, size: 100, x: 15, y: 300, blur: 0, opacity: 0.9 }, // Foreground left
            { depth: 1.8, size: 180, x: 90, y: 100, blur: 3, opacity: 0.8 }, // Very foreground right (out of focus)
            { depth: 0.8, size: 70, x: 25, y: 50, blur: 1, opacity: 0.7 }    // Mid left high
        ];

        spiderConfigs.forEach(config => {
            const wrapper = document.createElement('div');
            wrapper.className = 'parallax-spider-wrapper';
            wrapper.style.left = `${config.x}%`;
            // Calculate a random sway frequency
            const swayFreq = 1 + Math.random() * 2;
            
            const web = document.createElement('div');
            web.className = 'parallax-spider-web';
            web.style.height = `${config.y}px`;
            
            const sprite = document.createElement('div');
            sprite.className = 'parallax-spider-sprite';
            sprite.style.top = `${config.y}px`;
            sprite.style.width = `${config.size}px`;
            sprite.style.height = `${config.size}px`;
            
            // Apply depth of field
            if (config.blur > 0) {
                sprite.style.filter = `blur(${config.blur}px) drop-shadow(0 0 5px rgba(255, 0, 0, 0.8))`;
            } else {
                sprite.style.filter = `drop-shadow(0 0 5px rgba(255, 0, 0, 0.8))`;
            }
            wrapper.style.opacity = config.opacity;
            
            wrapper.appendChild(web);
            wrapper.appendChild(sprite);
            this.container.appendChild(wrapper);
            
            this.spiders.push({
                element: wrapper,
                depth: config.depth,
                swayFreq: swayFreq,
                baseX: config.x,
                currentRotation: 0,
                targetRotation: 0
            });
        });
    }

    // Called by the mouse loop
    update(mouseX, mouseY, velocityX) {
        const time = Date.now() / 1000;
        
        this.spiders.forEach(spider => {
            // Parallax offset
            const offsetX = mouseX * 50 * spider.depth;
            const offsetY = mouseY * 20 * spider.depth;
            
            // Physics swing based on velocity and depth
            // Fast mouse = big swing, heavy spiders swing differently
            spider.targetRotation = velocityX * 25 * spider.depth;
            
            // Smoothly interpolate rotation (adds springiness/weight)
            spider.currentRotation += (spider.targetRotation - spider.currentRotation) * 0.05;
            
            // Add a natural idle sway
            const idleSway = Math.sin(time * spider.swayFreq) * 2;
            const totalRotation = spider.currentRotation + idleSway;
            
            spider.element.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${totalRotation}deg)`;
        });
    }
}

window.spiderClock = window.spiderClock || {};
window.spiderClock.parallaxSpiders = new ParallaxSpiders();
