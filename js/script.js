/* ═══════════════════════════════════════════
   MISHKI ANNIVERSARY — JavaScript
   Multi-page navigation + all interactions
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    const TOTAL_PAGES = 8;

    // ─── LOADER & LOCK SCREEN ────────────────
    const lockScreen = document.getElementById('lockScreen');
    const pinInputs = document.querySelectorAll('.pin-box');
    const pinError = document.getElementById('pinError');
    const CORRECT_PIN = '0426';

    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    if (pinInputs.length > 0) pinInputs[0].focus();
                }, 800);
            }
        }, 1600);
    });

    if (pinInputs.length > 0) {
        pinInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const val = e.target.value;
                if (val.length === 1) {
                    if (index < pinInputs.length - 1) {
                        pinInputs[index + 1].focus();
                    } else {
                        checkPin();
                    }
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '') {
                    if (index > 0) {
                        pinInputs[index - 1].focus();
                    }
                }
            });
        });

        function checkPin() {
            const enteredPin = Array.from(pinInputs).map(inp => inp.value).join('');
            if (enteredPin === CORRECT_PIN) {
                if (pinError) pinError.classList.remove('show');
                if (lockScreen) lockScreen.classList.add('hidden');
                setTimeout(() => {
                    if (lockScreen) lockScreen.style.display = 'none';
                    if (bgMusic && !isPlaying) {
                        bgMusic.play().then(() => updateMusicState(true)).catch(() => { });
                    }
                }, 600);
            } else {
                if (pinError) pinError.classList.add('show');
                pinInputs.forEach(inp => {
                    inp.value = '';
                    inp.classList.add('shake');
                    setTimeout(() => inp.classList.remove('shake'), 400);
                });
                pinInputs[0].focus();
            }
        }
    }

    // ─── CUSTOM CURSOR ────────────────────────
    const cursorOuter = document.getElementById('cursor-outer');
    const cursorInner = document.getElementById('cursor-inner');
    let mouseX = 0, mouseY = 0, outerX = 0, outerY = 0;

    let lastHeartTime = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorInner.style.left = mouseX + 'px';
        cursorInner.style.top = mouseY + 'px';

        const now = Date.now();
        if (now - lastHeartTime > 50) {
            createHeartTrail(mouseX, mouseY);
            lastHeartTime = now;
        }
    });

    function createHeartTrail(x, y) {
        const heart = document.createElement('div');
        heart.className = 'mouse-heart';
        const trailEmojis = ['💗', '❤️', '💖', '💕', '🌸', '✨', '🌹', '🦋', '🧸', '💌'];
        heart.textContent = trailEmojis[Math.floor(Math.random() * trailEmojis.length)];
        heart.style.left = (x - 10) + 'px';
        heart.style.top = (y - 10) + 'px';
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 1000);
    }

    (function animateCursor() {
        outerX += (mouseX - outerX) * 0.11;
        outerY += (mouseY - outerY) * 0.11;
        cursorOuter.style.left = outerX + 'px';
        cursorOuter.style.top = outerY + 'px';
        requestAnimationFrame(animateCursor);
    })();

    function attachCursorGrow() {
        document.querySelectorAll('button, .char-card, .song-list li, .reason-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOuter.classList.add('cursor-grow'));
            el.addEventListener('mouseleave', () => cursorOuter.classList.remove('cursor-grow'));
        });
    }

    // ─── PARTICLE CANVAS ─────────────────────
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const FLOWER_EMOJIS = ['🌸', '🌹', '🌺', '🌻', '🌼', '🌷'];
    const particles = [];

    class Particle {
        constructor() { this.reset(true); }
        reset(init) {
            this.x = Math.random() * canvas.width;
            this.y = init ? Math.random() * canvas.height : -40;
            this.size = Math.random() * 15 + 10;
            this.speedY = Math.random() * 1 + 0.6;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.emoji = FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)];
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 1.5;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotSpeed;
            if (this.y > canvas.height + 40) this.reset(false);
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px serif`;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillText(this.emoji, -this.size / 2, this.size / 2);
            ctx.restore();
        }
    }

    for (let i = 0; i < 45; i++) particles.push(new Particle());

    (function renderParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(renderParticles);
    })();

    // ─── TOGETHERNESS CLOCK ──────────────────
    const startDate = new Date('2022-04-26T00:00:00');
    const pad = n => String(n).padStart(2, '0');

    function updateCounter() {
        const diff = new Date() - startDate;
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.4375));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.4375)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        ['years', 'months', 'days', 'hours', 'minutes', 'seconds'].forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) el.innerText = pad([years, months, days, hours, minutes, seconds][i]);
        });
    }
    setInterval(updateCounter, 1000);
    updateCounter();

    // ─── A–Z GRID ────────────────────────────
    const alphabetData = {
        'A': 'Always by my side',
        'B': 'Best friend forever',
        'C': 'Caring & kind',
        'D': 'Dream girl',
        'E': 'Everything to me',
        'F': 'Flawless smile',
        'G': 'Gorgeous soul',
        'H': 'Home is with you',
        'I': 'Incredible person',
        'J': 'Joy you bring',
        'K': 'Kindness overflows',
        'L': 'Love of my life',
        'M': 'Mishki ❤️',
        'N': 'Never-ending fun',
        'O': 'Only one for me',
        'P': 'Peace of mind',
        'Q': 'Queen of my heart',
        'R': 'Radiant beauty',
        'S': 'Soulmate forever',
        'T': 'Trust we share',
        'U': 'Understanding',
        'V': 'Very precious',
        'W': 'Wonderful spirit',
        'X': 'X-tra special',
        'Y': 'You are the one',
        'Z': 'Zeal for life'
    };

    const grid = document.getElementById('alphabetGrid');
    if (grid) {
        Object.entries(alphabetData).forEach(([letter, reason]) => {
            const card = document.createElement('div');
            card.className = 'char-card';
            card.innerHTML = `<span class="letter">${letter}</span><span class="reason">${reason}</span>`;
            grid.appendChild(card);
        });
    }

    // ─── PAGE NAVIGATION ─────────────────────
    let currentPage = 0;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsWrap = document.getElementById('pageDots');
    const curPageEl = document.getElementById('currentPage');

    document.getElementById('totalPages').textContent = TOTAL_PAGES;

    // Build dots
    for (let i = 0; i < TOTAL_PAGES; i++) {
        const d = document.createElement('button');
        d.className = 'page-dot-b' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', `Go to page ${i + 1}`);
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
    }

    function updateDots() {
        document.querySelectorAll('.page-dot-b').forEach((d, i) => {
            d.classList.toggle('active', i === currentPage);
        });
    }

    function goTo(index, direction) {
        if (index < 0 || index >= TOTAL_PAGES) return;

        const oldSlide = document.getElementById('page-' + currentPage);
        const newSlide = document.getElementById('page-' + index);

        // Determine slide direction
        const goingForward = direction !== undefined ? direction : index > currentPage;

        // Exit old
        oldSlide.classList.remove('active');
        oldSlide.classList.add(goingForward ? 'exit-left' : 'enter-right');

        // Prepare new (off-screen on correct side)
        newSlide.style.transition = 'none';
        newSlide.style.opacity = '0';
        newSlide.style.transform = goingForward ? 'translateX(60px)' : 'translateX(-60px)';
        newSlide.style.pointerEvents = 'none';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                newSlide.style.transition = '';
                newSlide.style.opacity = '1';
                newSlide.style.transform = 'translateX(0)';
                newSlide.style.pointerEvents = 'all';
                newSlide.classList.add('active');
            });
        });

        // Clean old after transition
        setTimeout(() => {
            oldSlide.classList.remove('exit-left', 'enter-right');
            oldSlide.style.opacity = '';
            oldSlide.style.transform = '';
        }, 600);

        currentPage = index;

        // Update UI
        curPageEl.textContent = currentPage + 1;
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === TOTAL_PAGES - 1;
        updateDots();

        // Scroll A-Z page to top
        if (currentPage === 3) {
            const p3 = document.getElementById('page-3');
            if (p3) p3.scrollTop = 0;
        }

        attachCursorGrow();
    }

    prevBtn.addEventListener('click', () => goTo(currentPage - 1, false));
    nextBtn.addEventListener('click', () => goTo(currentPage + 1, true));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(currentPage + 1, true);
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(currentPage - 1, false);
    });

    // Touch / swipe
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) {
            if (dx < 0) goTo(currentPage + 1, true);
            else goTo(currentPage - 1, false);
        }
    }, { passive: true });

    // Initial state
    prevBtn.disabled = true;

    // ─── MUSIC ───────────────────────────────
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    const bgMusic = document.getElementById('bgMusic');
    const volSlider = document.getElementById('volSlider');
    let isPlaying = false;

    function updateMusicState(playing) {
        isPlaying = playing;
        if (playing) {
            if (musicToggle) musicToggle.classList.add('playing');
            if (musicIcon) musicIcon.textContent = '▶';
        } else {
            if (musicToggle) musicToggle.classList.remove('playing');
            if (musicIcon) musicIcon.textContent = '♫';
        }
    }

    if (bgMusic) {
        bgMusic.volume = volSlider ? volSlider.value : 0.5;
        // Music plays upon unlocking the lock screen.
    }

    if (musicToggle) {
        musicToggle.addEventListener('click', (e) => {
            if (e.target.closest('.volume-controls')) return;
            if (isPlaying) {
                bgMusic.pause();
                updateMusicState(false);
            } else {
                bgMusic.play().then(() => updateMusicState(true)).catch(() => { });
            }
        });
    }

    if (volSlider) {
        volSlider.addEventListener('input', (e) => {
            if (bgMusic) bgMusic.volume = e.target.value;
        });
    }

    // ─── PLAYLIST CLICKS ─────────────────────
    document.querySelectorAll('#songList li').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('#songList li').forEach(s => s.classList.remove('active'));
            item.classList.add('active');

            const newSrc = item.getAttribute('data-src');
            if (bgMusic && newSrc) {
                bgMusic.src = newSrc;
                
                bgMusic.play().then(() => {
                    updateMusicState(true);
                }).catch(() => { });

                const nowPlaying = document.querySelector('.now-playing');
                if (nowPlaying) {
                    const songName = item.textContent.split('—')[0].trim();
                    nowPlaying.textContent = songName + ' ♥';
                }
            }
        });
    });

    // Auto-play next song when current finishes
    if (bgMusic) {
        bgMusic.addEventListener('ended', () => {
            const currentActive = document.querySelector('#songList li.active');
            if (currentActive) {
                let nextLi = currentActive.nextElementSibling;
                if (!nextLi) {
                    // Loop back to the first song
                    nextLi = document.querySelector('#songList li:first-child');
                }
                if (nextLi) {
                    nextLi.click(); // Trigger the click event on the next song
                }
            }
        });
    }

    // ─── SURPRISE BUTTON + MODAL ─────────────
    const surpriseBtn = document.getElementById('surpriseBtn');
    const surpriseModal = document.getElementById('surpriseModal');
    const modalClose = document.getElementById('modalClose');

    function openModal() {
        surpriseModal.classList.add('active');

        // Big confetti burst
        const end = Date.now() + 5500;
        const colors = ['#D63060', '#E8748A', '#C8801A', '#EBB04A', '#F7AABB'];

        (function burst() {
            if (Date.now() > end) return;
            const tl = end - Date.now();
            confetti({
                particleCount: 45 * (tl / 5500),
                spread: 360,
                startVelocity: 32,
                origin: { x: Math.random() < 0.5 ? 0.1 : 0.9, y: 0.1 },
                colors,
                ticks: 55,
                zIndex: 5000
            });
            setTimeout(burst, 220);
        })();
    }

    if (surpriseBtn) surpriseBtn.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', () => surpriseModal.classList.remove('active'));
    if (surpriseModal) surpriseModal.addEventListener('click', (e) => {
        if (e.target === surpriseModal) surpriseModal.classList.remove('active');
    });

    // ─── GSAP ANIMATIONS PER PAGE ────────────
    if (typeof gsap !== 'undefined') {
        // A-Z cards animate when page 3 becomes active — triggered by nav
        const origGoTo = goTo;

        function animatePageIn(idx) {
            if (idx === 3) {
                // A-Z
                gsap.from('.char-card', {
                    opacity: 0, scale: 0.65, duration: 0.45,
                    stagger: 0.025, ease: 'back.out(1.5)',
                    clearProps: 'all'
                });
            }
            if (idx === 5) {
                // Reasons
                gsap.from('.reason-card', {
                    opacity: 0, y: 40, duration: 0.5,
                    stagger: 0.1, ease: 'power3.out',
                    clearProps: 'all'
                });
            }
            if (idx === 2) {
                // Clock blocks
                gsap.from('.time-block', {
                    opacity: 0, scale: 0.5, duration: 0.55,
                    stagger: 0.08, ease: 'elastic.out(1,0.75)',
                    clearProps: 'all'
                });
            }
            if (idx === 1) {
                // Proposal stats
                gsap.from('.stat', {
                    opacity: 0, y: 25, duration: 0.6,
                    stagger: 0.18, ease: 'power2.out',
                    clearProps: 'all'
                });
            }
        }

        // Monkey-patch navigation to fire GSAP after transition
        const _goTo = window._goTo = (index, direction) => {
            const prev = currentPage;
            goTo(index, direction);
            setTimeout(() => animatePageIn(index), 200);
        };

        prevBtn.addEventListener('click', () => _goTo(currentPage - 1, false), { capture: true });
        nextBtn.addEventListener('click', () => _goTo(currentPage + 1, true), { capture: true });

        document.querySelectorAll('.page-dot-b').forEach((d, i) => {
            d.addEventListener('click', () => _goTo(i), { capture: true });
        });
    }

    // ─── MEMORY SLIDER LOGIC ───────────────
    const memGallery = document.getElementById('memGallery');
    const memPrev = document.getElementById('memPrev');
    const memNext = document.getElementById('memNext');
    const memDots = document.getElementById('memDots');
    let currentMemIndex = 0;
    
    if (memGallery && memPrev && memNext && memDots) {
        const memCards = memGallery.querySelectorAll('.memory-card');
        const totalMems = memCards.length;

        // Create dots
        for (let i = 0; i < totalMems; i++) {
            const dot = document.createElement('div');
            dot.className = 's-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToMem(i));
            memDots.appendChild(dot);
        }

        function updateMemUI() {
            memGallery.style.transform = `translateX(-${currentMemIndex * 100}%)`;
            
            // update dots
            document.querySelectorAll('.s-dot').forEach((d, i) => {
                d.classList.toggle('active', i === currentMemIndex);
            });
            
            // Handle video play/pause based on active slide
            memCards.forEach((card, idx) => {
                const vid = card.querySelector('video');
                if (vid) {
                    if (idx === currentMemIndex) {
                        vid.currentTime = 0;
                        vid.play().catch(()=>{});
                    } else {
                        vid.pause();
                    }
                }
            });

            memPrev.disabled = currentMemIndex === 0;
            memNext.disabled = currentMemIndex === totalMems - 1;
        }

        function goToMem(index) {
            currentMemIndex = Math.max(0, Math.min(index, totalMems - 1));
            updateMemUI();
        }

        memPrev.addEventListener('click', () => goToMem(currentMemIndex - 1));
        memNext.addEventListener('click', () => goToMem(currentMemIndex + 1));
        
        // Setup touch swipe for slider
        let memTouchStartX = 0;
        memGallery.addEventListener('touchstart', e => {
            memTouchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        
        memGallery.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - memTouchStartX;
            if (Math.abs(dx) > 40) {
                if (dx < 0) goToMem(currentMemIndex + 1);
                else goToMem(currentMemIndex - 1);
            }
        }, { passive: true });

        // Initial state
        updateMemUI();
    }

    // ─── LIGHTBOX LOGIC ──────────────────────
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightbox) {
        // Open lightbox
        document.querySelectorAll('.memory-card img, .memory-card video').forEach(el => {
            el.addEventListener('click', () => {
                if (el.tagName === 'IMG') {
                    lightboxImg.src = el.src;
                    lightboxImg.style.display = 'block';
                    lightboxVideo.style.display = 'none';
                    lightboxVideo.pause();
                } else if (el.tagName === 'VIDEO') {
                    lightboxVideo.src = el.src;
                    lightboxVideo.style.display = 'block';
                    lightboxImg.style.display = 'none';
                    lightboxVideo.play().catch(()=>{});
                }
                lightbox.classList.add('active');
            });
        });

        // Close lightbox
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightboxImg.src = '';
                lightboxVideo.pause();
                lightboxVideo.src = '';
            }, 300); // clear after animation
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Initial cursor grow
    attachCursorGrow();
});
