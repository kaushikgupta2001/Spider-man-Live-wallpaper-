class MouseHandler {
    constructor() {
        this.skyline        = window.spiderClock.skyline;
        this.spider         = window.spiderClock.spider;
        this.particles      = window.spiderClock.particles;
        this.parallaxSpiders = window.spiderClock.parallaxSpiders;

        this.uiLayer       = document.getElementById('ui-layer');
        this.slideshowLayer = document.getElementById('slideshow-layer');

        // Normalized target coords [-1, 1]
        this.mouseX = 0;
        this.mouseY = 0;

        // Smoothed coords
        this.currentX = 0;
        this.currentY = 0;

        // Velocity
        this.velocityX = 0;
        this.lastX     = 0;

        // Raw pixels (for click)
        this.rawX = window.innerWidth  / 2;
        this.rawY = window.innerHeight / 2;

        // ── Auto-pilot: simulate mouse when DesktopHut gives no input ──────────
        // If no real mouse event fires within 2 s, switch to Lissajous motion.
        this.autoPilot     = false;
        this.autoPilotTime = 0;
        this._lastRealMove = Date.now();

        setInterval(() => {
            if (Date.now() - this._lastRealMove > 2000) {
                this.autoPilot = true;
            }
        }, 1000);

        // ── Wallpaper Engine native API ────────────────────────────────────────
        if (typeof window.wallpaperRegisterMouseMoveEvent === 'function') {
            window.wallpaperRegisterMouseMoveEvent((x, y) => {
                this._lastRealMove = Date.now();
                this.autoPilot = false;
                this.rawX  = x * window.innerWidth;
                this.rawY  = y * window.innerHeight;
                this.mouseX = x * 2 - 1;
                this.mouseY = y * 2 - 1;
            });
        }

        // ── DOM fallback (browser preview / some DesktopHut builds) ───────────
        document.addEventListener('mousemove', (e) => {
            this._lastRealMove = Date.now();
            this.autoPilot = false;
            this.rawX  = e.clientX;
            this.rawY  = e.clientY;
            this.mouseX = (e.clientX / window.innerWidth)  * 2 - 1;
            this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        });

        // ── Click: shoot web + THWIP ──────────────────────────────────────────
        document.addEventListener('click', (e) => {
            if (this.spider && this.particles) {
                this.spider.shootWebTo(e.clientX, e.clientY);
                this.particles.addThwip(e.clientX, e.clientY);
            }
        });

        this.updateLoop();
    }

    updateLoop() {
        // ── Auto-pilot: Lissajous curve gives natural slow drift ──────────────
        if (this.autoPilot) {
            this.autoPilotTime += 0.004;
            const t = this.autoPilotTime;
            this.mouseX = Math.sin(t * 0.7 + 1.0) * 0.65;
            this.mouseY = Math.sin(t * 0.5)        * 0.45;
        }

        // Smooth lerp
        this.currentX += (this.mouseX - this.currentX) * 0.05;
        this.currentY += (this.mouseY - this.currentY) * 0.05;

        // Velocity
        this.velocityX = (this.currentX - this.lastX) * 60;
        this.lastX     = this.currentX;

        // 1. Skyline parallax
        if (this.skyline) {
            const smoothClientX = (this.currentX + 1) / 2 * window.innerWidth;
            this.skyline.setParallax(smoothClientX);
        }

        // 2. Parallax spiders (skipped during dance — music.js overrides)
        if (this.parallaxSpiders && !document.body.classList.contains('dance-mode')) {
            this.parallaxSpiders.update(this.currentX, this.currentY, this.velocityX);
        }

        // 3. UI Clock layer (subtle inverse pop)
        if (this.uiLayer) {
            this.uiLayer.style.transform =
                `translate(${this.currentX * -15}px, ${this.currentY * -15}px)`;
        }

        // 4. Background slideshow (depth shift)
        if (this.slideshowLayer) {
            this.slideshowLayer.style.transform =
                `translate(${this.currentX * 10}px, ${this.currentY * 10}px) scale(1.05)`;
        }

        requestAnimationFrame(() => this.updateLoop());
    }
}

window.spiderClock = window.spiderClock || {};
setTimeout(() => {
    window.spiderClock.mouse = new MouseHandler();
}, 100);
