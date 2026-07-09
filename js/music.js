/**
 * SpiderMusicPlayer
 * ──────────────────────────────────────────────────────────────────
 * • Builds the now-playing strip + spider music button
 * • Auto-starts dance + audio on load (no click needed for DesktopHut)
 * • Dance runs FOREVER — no auto-stop
 * • M key = toggle dance | Space key = skip song
 *
 * FIX: calls audioPlayer.begin() after UI is ready,
 *      guaranteeing the _onPlay notification finds the DOM elements.
 */
class SpiderMusicPlayer {
    constructor() {
        this.danceActive = false;
        this.danceLoop   = null;
        this.dancePhase  = 0;

        // Build UI first
        this._buildUI();
        this._setupKeyboard();

        // Then start audio + dance after a brief pause
        // (gives other modules like parallax-spiders a moment to settle)
        setTimeout(() => this._launch(), 1500);
    }

    /* ─── Launch (called once after DOM is ready) ───────────────────── */
    _launch() {
        // Start the audio player — it will call onSongStart() when playing
        const ap = window.spiderClock?.audioPlayer;
        if (ap) {
            ap.begin();
        }

        // Start the dance loop immediately (looks great even before audio loads)
        this.startDance();
    }

    /* ─── UI ────────────────────────────────────────────────────────── */
    _buildUI() {
        const layer = document.getElementById('effects-layer');
        if (!layer) return;

        // ── Now-playing strip (bottom centre) ──────────────────────────
        this.strip = document.createElement('div');
        this.strip.id = 'now-playing-strip';
        this.strip.innerHTML = `
            <span class="np-spider-icon">🕷️</span>
            <div class="np-info">
                <span class="np-label">NOW PLAYING</span>
                <span class="np-title" id="np-song-title">Loading Spider-Man playlist…</span>
            </div>
            <div class="np-controls">
                <button id="np-prev" title="Previous Song">⏮</button>
                <button id="np-playpause" title="Play/Pause">⏯</button>
                <button id="np-next" title="Next Song">⏭</button>
            </div>
            <div class="np-eq" id="np-eq">
                <span></span><span></span><span></span><span></span><span></span>
            </div>`;
        layer.appendChild(this.strip);

        // Hook up the new controls
        setTimeout(() => {
            const ap = window.spiderClock?.audioPlayer;
            document.getElementById('np-prev')?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (ap) ap.skipPrevious();
            });
            document.getElementById('np-playpause')?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (ap) ap.togglePlayPause();
                this.toggle(); // Toggle dance mode when paused/played
            });
            document.getElementById('np-next')?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (ap) ap.skipNext();
            });
        }, 100);

        // ── Spider music button (bottom-right) ─────────────────────────
        this.wrapper = document.createElement('div');
        this.wrapper.id = 'spider-music-btn-wrapper';
        this.wrapper.innerHTML = `
            <div id="spider-music-ring"></div>
            <button id="spider-music-btn" title="M = dance on/off | Space = skip song">
                <span class="music-spider-icon">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="50" cy="52" rx="16" ry="20" fill="#C00"/>
                        <ellipse cx="50" cy="36" rx="12" ry="11" fill="#C00"/>
                        <ellipse cx="44" cy="34" rx="7" ry="5" fill="white" transform="rotate(-15,44,34)"/>
                        <ellipse cx="56" cy="34" rx="7" ry="5" fill="white" transform="rotate(15,56,34)"/>
                        <line x1="34" y1="48" x2="8"  y2="36" stroke="#900" stroke-width="3.5" stroke-linecap="round"/>
                        <line x1="34" y1="53" x2="6"  y2="53" stroke="#900" stroke-width="3.5" stroke-linecap="round"/>
                        <line x1="34" y1="58" x2="10" y2="68" stroke="#900" stroke-width="3.5" stroke-linecap="round"/>
                        <line x1="66" y1="48" x2="92" y2="36" stroke="#900" stroke-width="3.5" stroke-linecap="round"/>
                        <line x1="66" y1="53" x2="94" y2="53" stroke="#900" stroke-width="3.5" stroke-linecap="round"/>
                        <line x1="66" y1="58" x2="90" y2="68" stroke="#900" stroke-width="3.5" stroke-linecap="round"/>
                        <text x="50" y="59" text-anchor="middle" font-size="20" fill="white" font-family="serif">♫</text>
                    </svg>
                </span>
                <span class="music-label">♫</span>
            </button>`;
        layer.appendChild(this.wrapper);

        // Click toggle (if the environment supports it)
        this.wrapper.querySelector('#spider-music-btn')
            ?.addEventListener('click', (e) => { e.stopPropagation(); this.toggle(); });
    }

    /* ─── Keyboard ──────────────────────────────────────────────────── */
    _setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'm' || e.key === 'M') this.toggle();
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                window.spiderClock?.audioPlayer?.skipNext();
            }
        });
    }

    /* ─── Called by audio-player when a new song starts ────────────── */
    onSongStart(title) {
        // Update title
        const el = document.getElementById('np-song-title');
        if (el) el.textContent = title;

        // Show the strip
        this.strip?.classList.add('visible');

        // Activate EQ bars
        document.getElementById('np-eq')?.classList.add('playing');

        // Ensure dance is running
        if (!this.danceActive) this.startDance();
    }

    /* ─── Toggle ────────────────────────────────────────────────────── */
    toggle() {
        if (this.danceActive) {
            this.stopDance();
            const ap = window.spiderClock?.audioPlayer;
            if (ap && !ap.audio.paused) ap.audio.pause();
        } else {
            this.startDance();
            const ap = window.spiderClock?.audioPlayer;
            if (ap && ap.audio.paused) ap.audio.play().catch(()=>{});
        }
    }

    /* ─── Dance ON ──────────────────────────────────────────────────── */
    startDance() {
        if (this.danceActive) return;
        this.danceActive = true;

        document.querySelector('#spider-music-btn')?.classList.add('dancing');
        document.querySelector('#spider-music-ring')?.classList.add('active');
        document.querySelector('#np-eq')?.classList.add('playing');
        document.body.classList.add('dance-mode');

        this._runDanceLoop();
    }

    /* ─── Dance OFF ─────────────────────────────────────────────────── */
    stopDance() {
        this.danceActive = false;
        cancelAnimationFrame(this.danceLoop);

        document.querySelector('#spider-music-btn')?.classList.remove('dancing');
        document.querySelector('#spider-music-ring')?.classList.remove('active');
        document.querySelector('#np-eq')?.classList.remove('playing');
        document.body.classList.remove('dance-mode');

        this._resetSpiders();
    }

    /* ─── Dance animation ───────────────────────────────────────────── */
    _runDanceLoop() {
        const tick = () => {
            if (!this.danceActive) return;
            this.dancePhase += 0.055;
            const t = this.dancePhase;

            // Parallax spiders dance
            const ps = window.spiderClock?.parallaxSpiders;
            if (ps?.spiders?.length) {
                const count = ps.spiders.length;
                ps.spiders.forEach((sp, i) => {
                    const off    = i * ((Math.PI * 2) / count);
                    const bounce = Math.sin(t * 3   + off) * 28 + Math.sin(t * 6 + off * 2) * 10;
                    const sway   = Math.cos(t * 2.5 + off) * 22 + Math.sin(t * 5 + off)     * 8;
                    const spin   = Math.sin(t * 2   + off) * 32;
                    const scale  = 1 + Math.abs(Math.sin(t * 3 + off)) * 0.45;
                    const hue    = (t * 50 + i * 72) % 360;

                    sp.element.style.transform =
                        `translate(${sway}px, ${bounce}px) rotate(${spin}deg) scale(${scale})`;
                    sp.element.style.filter =
                        `hue-rotate(${hue}deg) drop-shadow(0 0 14px rgba(255,40,40,0.95))`;
                });
            }

            // Main hanging spider dances too
            const ms = window.spiderClock?.spider;
            if (ms?.container) {
                ms.container.style.transform =
                    `rotate(${Math.cos(t * 1.3) * 22}deg) translateY(${Math.sin(t * 3) * 20}px)`;
            }

            this.danceLoop = requestAnimationFrame(tick);
        };
        this.danceLoop = requestAnimationFrame(tick);
    }

    /* ─── Reset spiders to normal ───────────────────────────────────── */
    _resetSpiders() {
        window.spiderClock?.parallaxSpiders?.spiders?.forEach(sp => {
            sp.element.style.filter    = '';
            sp.element.style.transform = '';
        });
        const ms = window.spiderClock?.spider;
        if (ms?.container) ms.container.style.transform = '';
    }
}

window.spiderClock = window.spiderClock || {};
window.spiderClock.musicPlayer = new SpiderMusicPlayer();
