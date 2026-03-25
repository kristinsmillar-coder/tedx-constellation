// TEDx Ad Astra - Submit Page v2.0
// Canvas starfield background + premium interactions

document.addEventListener('DOMContentLoaded', () => {
    // === Background Starfield ===
    const bgCanvas = document.getElementById('bg-canvas');
    const bgCtx = bgCanvas.getContext('2d');
    let stars = [];
    let shootingStars = [];

    function resizeBg() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    }
    resizeBg();
    window.addEventListener('resize', resizeBg);

    // Generate stars
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 1.5 + 0.2,
            brightness: Math.random() * 0.5 + 0.1,
            twinkleSpeed: Math.random() * 2 + 0.5,
            twinkleOffset: Math.random() * Math.PI * 2,
            color: [
                {r:255,g:255,b:255},
                {r:200,g:220,b:255},
                {r:255,g:240,b:210},
                {r:180,g:200,b:255},
            ][Math.floor(Math.random() * 4)]
        });
    }

    function spawnShootingStar() {
        shootingStars.push({
            x: Math.random(), y: -0.05,
            vx: (Math.random() - 0.5) * 0.002,
            vy: 0.003 + Math.random() * 0.003,
            life: 1, decay: 0.008 + Math.random() * 0.01,
            trail: [], maxTrail: 12
        });
    }

    setInterval(spawnShootingStar, 4000 + Math.random() * 5000);

    function renderBg(t) {
        const w = bgCanvas.width;
        const h = bgCanvas.height;

        bgCtx.fillStyle = '#050510';
        bgCtx.fillRect(0, 0, w, h);

        // Nebula
        const nebulae = [
            { cx: 0.3, cy: 0.3, r: 0.35, color: [60, 30, 90] },
            { cx: 0.7, cy: 0.65, r: 0.3, color: [25, 40, 80] },
        ];
        for (const n of nebulae) {
            const grad = bgCtx.createRadialGradient(n.cx*w, n.cy*h, 0, n.cx*w, n.cy*h, n.r*w);
            const [r,g,b] = n.color;
            grad.addColorStop(0, `rgba(${r},${g},${b},0.05)`);
            grad.addColorStop(1, 'transparent');
            bgCtx.fillStyle = grad;
            bgCtx.fillRect(0, 0, w, h);
        }

        // Stars
        for (const star of stars) {
            const twinkle = Math.sin(t * 0.001 * star.twinkleSpeed + star.twinkleOffset);
            const brightness = star.brightness + twinkle * 0.15;
            if (brightness <= 0) continue;

            const sx = star.x * w;
            const sy = star.y * h;
            const {r,g,b} = star.color;

            if (star.size > 1) {
                const glow = bgCtx.createRadialGradient(sx, sy, 0, sx, sy, star.size * 3);
                glow.addColorStop(0, `rgba(${r},${g},${b},${brightness * 0.2})`);
                glow.addColorStop(1, 'transparent');
                bgCtx.beginPath();
                bgCtx.arc(sx, sy, star.size * 3, 0, Math.PI * 2);
                bgCtx.fillStyle = glow;
                bgCtx.fill();
            }

            bgCtx.beginPath();
            bgCtx.arc(sx, sy, star.size, 0, Math.PI * 2);
            bgCtx.fillStyle = `rgba(${r},${g},${b},${brightness})`;
            bgCtx.fill();
        }

        // Shooting stars
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const s = shootingStars[i];
            s.trail.unshift({x: s.x, y: s.y});
            if (s.trail.length > s.maxTrail) s.trail.pop();
            s.x += s.vx;
            s.y += s.vy;
            s.life -= s.decay;

            if (s.life <= 0) { shootingStars.splice(i, 1); continue; }

            for (let j = 0; j < s.trail.length - 1; j++) {
                const tp = s.trail[j];
                const np = s.trail[j + 1];
                const alpha = (1 - j / s.trail.length) * s.life * 0.5;
                bgCtx.beginPath();
                bgCtx.moveTo(tp.x * w, tp.y * h);
                bgCtx.lineTo(np.x * w, np.y * h);
                bgCtx.strokeStyle = `rgba(255,255,255,${alpha})`;
                bgCtx.lineWidth = (1 - j / s.trail.length) * 1.5;
                bgCtx.stroke();
            }
        }

        // Vignette
        const vig = bgCtx.createRadialGradient(w/2, h/2, w*0.15, w/2, h/2, w*0.8);
        vig.addColorStop(0, 'transparent');
        vig.addColorStop(1, 'rgba(3,3,10,0.6)');
        bgCtx.fillStyle = vig;
        bgCtx.fillRect(0, 0, w, h);

        requestAnimationFrame(renderBg);
    }
    requestAnimationFrame(renderBg);

    // === Form Logic ===
    const form = document.getElementById('dream-form');
    const dreamTextarea = document.getElementById('dream');
    const charCount = document.getElementById('char-count');
    const charCountWrap = charCount.parentElement;
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');
    const submitAnother = document.getElementById('submit-another');

    // Character counter
    dreamTextarea.addEventListener('input', () => {
        const count = dreamTextarea.value.length;
        charCount.textContent = count;
        charCountWrap.classList.toggle('near-limit', count > 130);
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const dream = dreamTextarea.value.trim();

        if (!name || !dream) return;

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/dreams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, dream })
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess();
            } else {
                showError(data.error || 'Something went wrong');
            }
        } catch (err) {
            showError('Could not connect to server. Please try again.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    submitAnother.addEventListener('click', resetForm);

    function showSuccess() {
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
        createSuccessParticles();
    }

    function resetForm() {
        form.classList.remove('hidden');
        successMessage.classList.add('hidden');
        form.reset();
        charCount.textContent = '0';
        charCountWrap.classList.remove('near-limit');
    }

    function showError(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(20px);
            background: rgba(180, 50, 50, 0.9); backdrop-filter: blur(10px);
            color: #fff; padding: 0.8rem 1.5rem; border-radius: 12px;
            font-family: 'Cormorant Garamond', serif; font-size: 1rem;
            z-index: 100; opacity: 0; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255, 100, 100, 0.3);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // Success particle explosion
    function createSuccessParticles() {
        const canvas = document.getElementById('success-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const particles = [];
        const cx = canvas.width / 2;
        const cy = canvas.height * 0.25;

        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 4;
            particles.push({
                x: cx, y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1,
                life: 1,
                decay: 0.008 + Math.random() * 0.015,
                size: 1 + Math.random() * 3,
                gold: Math.random() > 0.3
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05; // gravity
                p.life -= p.decay;
                if (p.life <= 0) continue;
                alive = true;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                if (p.gold) {
                    ctx.fillStyle = `rgba(212, 175, 55, ${p.life})`;
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.7})`;
                }
                ctx.fill();

                // Glow
                if (p.size > 1.5) {
                    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                    glow.addColorStop(0, `rgba(212, 175, 55, ${p.life * 0.3})`);
                    glow.addColorStop(1, 'transparent');
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = glow;
                    ctx.fill();
                }
            }

            if (alive) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }
});
