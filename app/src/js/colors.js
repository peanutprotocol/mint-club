const root = document.documentElement;

root.addEventListener('mousemove', e => {
    let x = e.clientX / innerWidth,
        y = e.clientY / innerWidth;
    x = Math.floor(Math.sqrt(x) * 230);
    root.style.setProperty('--h', x)
    root.style.setProperty('--d', x-180)
});
