// Main initialization script
console.log("Spider-Verse Clock Initialized!");

// Handle window resize dynamically to maintain full-screen layers
window.addEventListener('resize', () => {
    document.body.style.width = `${window.innerWidth}px`;
    document.body.style.height = `${window.innerHeight}px`;
});
