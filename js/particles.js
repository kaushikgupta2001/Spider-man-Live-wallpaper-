class ComicParticles {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addThwip(x, y) {
        // Add text effect
        const text = document.createElement('div');
        text.className = 'comic-text';
        text.textContent = 'THWIP!';
        text.style.left = (x - 50) + 'px';
        text.style.top = (y - 30) + 'px';
        document.getElementById('effects-layer').appendChild(text);
        
        // Cleanup text
        setTimeout(() => text.remove(), 500);
        
        // Add particles
        for(let i=0; i<15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                color: Math.random() > 0.5 ? 'red' : 'blue'
            });
        }
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05;
            
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, Math.random() * 5 + 2, 0, Math.PI*2);
            this.ctx.fill();
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                i--;
            }
        }
        
        this.ctx.globalAlpha = 1.0;
        requestAnimationFrame(this.loop);
    }
}

window.spiderClock = window.spiderClock || {};
window.spiderClock.particles = new ComicParticles();
