/**
 * LocalAudioPlayer — Spider-Man Soundtrack
 * ──────────────────────────────────────────────────────────────────
 * Streams 20 real Spider-Man songs directly from:
 *   https://github.com/20essentials/spider-man-soundtrack
 *
 * Songs play in shuffled order, loop forever, no download needed.
 * Also checks local  audio/  folder first — local files take priority.
 *
 * Called via audioPlayer.begin() by music.js after UI is ready.
 */
class LocalAudioPlayer {
    constructor() {
        // ── 20 songs from the GitHub repo (streamed directly) ────────────────
        // Raw URL base: https://raw.githubusercontent.com/20essentials/spider-man-soundtrack/main/songs/
        const RAW = 'https://raw.githubusercontent.com/20essentials/spider-man-soundtrack/main/songs/';

        this.playlist = [
            { file: RAW + 'n1.mp3',  local: 'audio/n1.mp3',  title: 'The Spectacular Spider-Man' },
            { file: RAW + 'n2.mp3',  local: 'audio/n2.mp3',  title: 'Hero' },
            { file: RAW + 'n3.mp3',  local: 'audio/n3.mp3',  title: 'Sunflower' },
            { file: RAW + 'n4.mp3',  local: 'audio/n4.mp3',  title: 'Main Titles – Spider-Man 1' },
            { file: RAW + 'n5.mp3',  local: 'audio/n5.mp3',  title: 'Main Titles – Spider-Man 2' },
            { file: RAW + 'n6.mp3',  local: 'audio/n6.mp3',  title: 'Main Titles – Spider-Man 3' },
            { file: RAW + 'n7.mp3',  local: 'audio/n7.mp3',  title: 'Black Suit Theme – Spider-Man 3 OST' },
            { file: RAW + 'n8.mp3',  local: 'audio/n8.mp3',  title: 'Farewell' },
            { file: RAW + 'n9.mp3',  local: 'audio/n9.mp3',  title: 'Spider-Man 90s Theme' },
            { file: RAW + 'n10.mp3', local: 'audio/n10.mp3', title: 'Spider-Man Theme (1967)' },
            { file: RAW + 'n11.mp3', local: 'audio/n11.mp3', title: "What We're All About – Sum 41" },
            { file: RAW + 'n12.mp3', local: 'audio/n12.mp3', title: 'The Edge – Allester Rein' },
            { file: RAW + 'n13.mp3', local: 'audio/n13.mp3', title: 'Spidey Bells' },
            { file: RAW + 'n14.mp3', local: 'audio/n14.mp3', title: 'Signal Fire' },
            { file: RAW + 'n15.mp3', local: 'audio/n15.mp3', title: 'Vindicated' },
            { file: RAW + 'n16.mp3', local: 'audio/n16.mp3', title: 'Stolen' },
            { file: RAW + 'n17.mp3', local: 'audio/n17.mp3', title: 'Save the Day – Train' },
            { file: RAW + 'n18.mp3', local: 'audio/n18.mp3', title: 'Counting Airplanes' },
            { file: RAW + 'n19.mp3', local: 'audio/n19.mp3', title: 'Elevator – Boxcar Racer' },
            { file: RAW + 'n20.mp3', local: 'audio/n20.mp3', title: 'Ordinary' },
        ];

        this.index     = 0;
        this.started   = false;
        this.skipCount = 0;

        this.audio         = new Audio();
        this.audio.volume  = 0.65;
        this.audio.preload = 'none';

        this.audio.addEventListener('ended',  () => { this.skipCount = 0; this._next(); });
        this.audio.addEventListener('error',  () => this._onError());
        this.audio.addEventListener('play',   () => this._onPlay());

        // Shuffle playlist
        this._shuffle();

        // Register globally BEFORE music.js runs
        window.spiderClock = window.spiderClock || {};
        window.spiderClock.audioPlayer = this;
    }

    /** Called by music.js after the UI is fully built */
    begin() {
        if (this.started) return;
        this.started = true;
        this._load();
    }

    // ── Internal ────────────────────────────────────────────────────────────
    _shuffle() {
        const a = this.playlist;
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }

    _load() {
        const song = this.playlist[this.index];
        if (!song) return;

        // Prefer local file if it exists, fall back to GitHub stream
        this.audio.src = song.local || song.file;
        this.audio.load();

        this.audio.play().catch(() => {
            // Autoplay blocked — try remote URL as fallback
            if (this.audio.src !== song.file) {
                this.audio.src = song.file;
                this.audio.load();
            }
            setTimeout(() => this.audio.play().catch(() => {}), 1500);
        });
    }

    _onError() {
        const song = this.playlist[this.index];

        // If we were on local file, try the remote GitHub URL instead
        if (song && this.audio.src.includes('audio/n')) {
            console.warn('[AudioPlayer] Local file missing, streaming from GitHub:', song.title);
            this.audio.src = song.file;
            this.audio.load();
            this.audio.play().catch(() => {
                setTimeout(() => this.audio.play().catch(() => {}), 1000);
            });
            return;
        }

        // Both sources failed — skip after full cycle guard
        this.skipCount++;
        if (this.skipCount >= this.playlist.length) {
            console.warn('[AudioPlayer] All sources failed. Retrying in 15s...');
            this.skipCount = 0;
            setTimeout(() => this._load(), 15000);
            return;
        }
        this._next();
    }

    _next() {
        this.index = (this.index + 1) % this.playlist.length;
        this._load();
    }

    _onPlay() {
        const song = this.playlist[this.index];
        if (!song) return;

        // Update now-playing title
        const el = document.getElementById('np-song-title');
        if (el) el.textContent = song.title;

        // Show the strip
        const strip = document.getElementById('now-playing-strip');
        if (strip) strip.classList.add('visible');

        // Notify music player
        window.spiderClock?.musicPlayer?.onSongStart(song.title);
    }

    // ── Public API ──────────────────────────────────────────────────────────
    skipNext()     { this.skipCount = 0; this._next(); }
    skipPrevious() {
        this.skipCount = 0;
        this.index = (this.index - 1 + this.playlist.length) % this.playlist.length;
        this._load();
    }
    togglePlayPause() {
        if (this.audio.paused) {
            this.audio.play().catch(()=>{});
        } else {
            this.audio.pause();
        }
    }
    setVolume(v)   { this.audio.volume = Math.max(0, Math.min(1, v / 100)); }
    currentTitle() { return this.playlist[this.index]?.title ?? ''; }
    currentIndex() { return this.index; }
    totalSongs()   { return this.playlist.length; }
}

window.spiderClock = window.spiderClock || {};
window.spiderClock.audioPlayer = new LocalAudioPlayer();
