class RainSystem {
    constructor() {
        this.canvas = document.getElementById('rain-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.amount = 50; // Wallpaper Engine setting
        this.speedMultiplier = 1;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setAmount(val) {
        this.amount = val;
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Spawn
        if (this.particles.length < this.amount * 5) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -10,
                l: Math.random() * 20 + 10,
                v: Math.random() * 15 + 10
            });
        }
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p.x + p.v * 0.1, p.y + p.l);
            p.y += p.v * this.speedMultiplier;
            p.x += p.v * 0.1 * this.speedMultiplier; // Slight wind
            
            if (p.y > this.canvas.height) {
                this.particles.splice(i, 1);
                i--;
            }
        }
        
        this.ctx.stroke();
        requestAnimationFrame(this.loop);
    }
}

window.spiderClock = window.spiderClock || {};
window.spiderClock.rain = new RainSystem();
