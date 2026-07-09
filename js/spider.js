class Spider {
    constructor() {
        this.container = document.getElementById('spider-container');
        this.sprite = document.getElementById('spider-sprite');
        this.webLine = document.getElementById('web-line');
        
        this.init();
    }

    init() {
        this.sprite.style.backgroundImage = 'url(assets/spider.svg)';
        
        // Idle animation loop
        this.idleLoop();
    }

    idleLoop() {
        // Subtle crawling/swinging movement
        const time = Date.now() / 1000;
        const rotate = Math.sin(time) * 5;
        this.container.style.transform = `rotate(${rotate}deg)`;
        
        // Subtle bobbing up and down
        const bob = Math.cos(time * 2) * 5;
        this.container.style.top = `${bob - 50}px`;
        
        // Match webline height to top
        this.webLine.style.height = `${this.container.offsetTop + 50}px`;
        this.webLine.style.transform = `rotate(${rotate}deg)`;
        
        requestAnimationFrame(() => this.idleLoop());
    }

    shootWebTo(x, y) {
        // Create a visual web line from spider to target
        const spiderRect = this.container.getBoundingClientRect();
        const startX = spiderRect.left + spiderRect.width / 2;
        const startY = spiderRect.top + spiderRect.height / 2;
        
        const length = Math.hypot(x - startX, y - startY);
        const angle = Math.atan2(y - startY, x - startX) * 180 / Math.PI;
        
        const web = document.createElement('div');
        web.className = 'shot-web';
        web.style.left = startX + 'px';
        web.style.top = startY + 'px';
        web.style.width = length + 'px';
        web.style.transform = `rotate(${angle}deg)`;
        
        document.getElementById('spider-layer').appendChild(web);
        
        // Remove after a short time
        setTimeout(() => web.remove(), 200);
    }
}

window.spiderClock = window.spiderClock || {};
window.spiderClock.spider = new Spider();
