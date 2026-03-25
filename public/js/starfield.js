// TEDx Ad Astra - Constellation Renderer v3.0
// 3D depth, overflow star cloud, milestone celebrations

class Starfield {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.dreams = [];
        this.overflowStars = []; // Stars beyond the chapel (86+)
        this.backgroundStars = [];
        this.dustParticles = [];
        this.shootingStars = [];
        this.birthAnimations = [];
        this.hoverParticles = [];

        // 3D rotation for chapel — gentle oscillation, not full spin
        this.rotationY = 0;
        this.rotationSpeed = 0.15; // Speed of oscillation
        this.maxRotation = 0.18;   // Max ~10 degrees each way
        this.tiltX = 0.08;        // Very slight X tilt for depth

        // No mouse interaction — fully automated
        this.mouse = { x: 0.5, y: 0.5 };

        // Camera
        this.camera = {
            x: 0.5, y: 0.5, zoom: 1,
            targetX: 0.5, targetY: 0.5, targetZoom: 1,
            startX: 0.5, startY: 0.5, startZoom: 1
        };

        // Animation phases: 'building', 'complete_flash', 'living', 'milestone_flash'
        this.lastTime = 0;
        this.animationPhase = 'building';
        this.phaseStartTime = 0;
        this.showLines = false;
        this.linesOpacity = 0;

        // Milestone tracking
        this.CHAPEL_STARS = 0; // Set after generating points
        this.MILESTONE_INTERVAL = 50;
        this.lastMilestone = 0;
        this.milestoneFlashStart = 0;
        this.milestoneFlashCount = 0;

        // Dream showcase
        this.showcaseState = 'viewing';
        this.showcaseStartTime = 0;
        this.showcasedDreams = [];
        this.currentShowcaseDream = null;
        this.SHOWCASE_VIEW_TIME = 4000;  // time showing full constellation
        this.SHOWCASE_ZOOM_TIME = 2000; // time for camera to reach the star
        this.SHOWCASE_HOLD_TIME = 500;  // pause at star before showing text
        this.SHOWCASE_SHOW_TIME = 4000; // text visible for 4 seconds
        this.SHOWCASE_FADE_TIME = 1000; // text fades out
        this.SHOWCASE_ZOOMOUT_TIME = 2000; // zoom back to full view

        // Chapel constellation
        this.chapelConstellation = this.generateChapelPoints();
        this.constellationLines = this.generateChapelLines();
        this.CHAPEL_STARS = this.chapelConstellation.length;
        this.lastMilestone = this.CHAPEL_STARS;

        this.init();
    }

    // ==================== CHAPEL GEOMETRY ====================

    generateChapelPoints() {
        const P = [];

        // BELL TOWER
        P.push({x:8,y:8});    // 0
        P.push({x:8,y:25});   // 1
        P.push({x:8,y:40});   // 2
        P.push({x:8,y:55});   // 3
        P.push({x:8,y:70});   // 4
        P.push({x:8,y:80});   // 5
        P.push({x:8,y:82});   // 6
        P.push({x:14,y:88});  // 7
        P.push({x:20,y:82});  // 8
        P.push({x:20,y:80});  // 9
        P.push({x:20,y:70});  // 10
        P.push({x:20,y:55});  // 11
        P.push({x:20,y:40});  // 12
        P.push({x:20,y:25});  // 13
        P.push({x:20,y:8});   // 14
        P.push({x:14,y:94});  // 15 cross top
        P.push({x:14,y:90});  // 16 cross bot
        P.push({x:12,y:92});  // 17 cross left
        P.push({x:16,y:92});  // 18 cross right
        P.push({x:11,y:73});  // 19
        P.push({x:11,y:63});  // 20
        P.push({x:14,y:73});  // 21
        P.push({x:14,y:63});  // 22
        P.push({x:17,y:73});  // 23
        P.push({x:17,y:63});  // 24
        P.push({x:12,y:52});  // 25
        P.push({x:12,y:42});  // 26
        P.push({x:16,y:52});  // 27
        P.push({x:16,y:42});  // 28

        // LEFT WING
        P.push({x:20,y:8});   // 29
        P.push({x:20,y:30});  // 30
        P.push({x:35,y:38});  // 31
        P.push({x:35,y:8});   // 32
        P.push({x:25,y:22});  // 33
        P.push({x:29,y:22});  // 34
        P.push({x:29,y:16});  // 35
        P.push({x:25,y:16});  // 36

        // MAIN CHAPEL
        P.push({x:35,y:8});   // 37
        P.push({x:35,y:25});  // 38
        P.push({x:35,y:38});  // 39
        P.push({x:35,y:50});  // 40
        P.push({x:35,y:52});  // 41
        P.push({x:40,y:58});  // 42
        P.push({x:45,y:64});  // 43
        P.push({x:50,y:70});  // 44 peak
        P.push({x:55,y:64});  // 45
        P.push({x:60,y:58});  // 46
        P.push({x:65,y:52});  // 47
        P.push({x:65,y:50});  // 48
        P.push({x:65,y:38});  // 49
        P.push({x:65,y:25});  // 50
        P.push({x:65,y:8});   // 51
        P.push({x:50,y:76});  // 52 cross top
        P.push({x:50,y:72});  // 53
        P.push({x:48,y:74});  // 54
        P.push({x:52,y:74});  // 55
        P.push({x:46,y:50});  // 56
        P.push({x:46,y:40});  // 57
        P.push({x:50,y:50});  // 58
        P.push({x:50,y:40});  // 59
        P.push({x:54,y:50});  // 60
        P.push({x:54,y:40});  // 61

        // ENTRANCE ARCH
        P.push({x:44,y:8});   // 62
        P.push({x:44,y:15});  // 63
        P.push({x:44,y:22});  // 64
        P.push({x:44,y:27});  // 65
        P.push({x:45,y:30});  // 66
        P.push({x:47,y:32});  // 67
        P.push({x:50,y:33});  // 68
        P.push({x:53,y:32});  // 69
        P.push({x:55,y:30});  // 70
        P.push({x:56,y:27});  // 71
        P.push({x:56,y:22});  // 72
        P.push({x:56,y:15});  // 73
        P.push({x:56,y:8});   // 74

        // RIGHT WING
        P.push({x:65,y:8});   // 75
        P.push({x:65,y:38});  // 76
        P.push({x:82,y:30});  // 77
        P.push({x:82,y:8});   // 78
        P.push({x:71,y:22});  // 79
        P.push({x:75,y:22});  // 80
        P.push({x:75,y:16});  // 81
        P.push({x:71,y:16});  // 82

        // BASE
        P.push({x:3,y:8});    // 83
        P.push({x:88,y:8});   // 84

        return P.map(p => ({
            x: (p.x - 45) / 90 + 0.5,
            y: (50 - p.y) / 90 + 0.5,
            z: 0 // Chapel is at z=0 (center plane)
        }));
    }

    generateChapelLines() {
        return [
            [0,1],[1,2],[2,3],[3,4],[4,5],
            [5,6],[6,7],[7,8],[8,9],
            [9,10],[10,11],[11,12],[12,13],[13,14],
            [0,14],
            [15,16],[16,7],[17,18],
            [19,20],[21,22],[23,24],
            [25,26],[27,28],
            [14,30],[30,31],[31,32],[32,14],
            [33,34],[34,35],[35,36],[36,33],
            [37,38],[38,39],[39,40],
            [41,42],[42,43],[43,44],
            [44,45],[45,46],[46,47],
            [48,49],[49,50],[50,51],
            [52,53],[53,44],[54,55],
            [56,57],[58,59],[60,61],
            [40,41],[47,48],
            [62,63],[63,64],[64,65],[65,66],[66,67],[67,68],
            [68,69],[69,70],[70,71],[71,72],[72,73],[73,74],
            [75,76],[76,77],[77,78],[78,75],
            [79,80],[80,81],[81,82],[82,79],
            [83,0],[0,14],[14,32],[32,37],[37,62],[74,51],[51,75],[75,78],[78,84],
            [31,40],[48,76],
        ];
    }

    // ==================== INIT ====================

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());


        this.generateBackgroundStars(350);
        this.generateDustParticles(80);
        this.connectWebSocket();

        this.lastTime = performance.now();
        this.phaseStartTime = performance.now();
        this.showcaseStartTime = performance.now();

        setInterval(() => this.spawnShootingStar(), 3000 + Math.random() * 4000);
        requestAnimationFrame((t) => this.render(t));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // ==================== BACKGROUND ====================

    generateBackgroundStars(count) {
        const colors = [
            {r:255,g:255,b:255},{r:200,g:220,b:255},{r:255,g:240,b:200},
            {r:255,g:200,b:150},{r:180,g:200,b:255},
        ];
        this.backgroundStars = [];
        for (let i = 0; i < count; i++) {
            this.backgroundStars.push({
                x: Math.random(), y: Math.random(),
                z: Math.random() * 2 - 1, // -1 (far) to 1 (near)
                size: Math.random() * 2.2 + 0.4,
                brightness: Math.random() * 0.6 + 0.3,
                twinkleSpeed: Math.random() * 3 + 0.5,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }

    generateDustParticles(count) {
        this.dustParticles = [];
        for (let i = 0; i < count; i++) {
            this.dustParticles.push({
                x: Math.random(), y: Math.random(),
                z: Math.random() * 2 - 1,
                size: Math.random() * 3 + 0.5,
                opacity: Math.random() * 0.04 + 0.01,
                speedX: (Math.random() - 0.5) * 0.00003,
                speedY: (Math.random() - 0.5) * 0.00003,
                hue: Math.random() * 40 + 220
            });
        }
    }

    spawnShootingStar() {
        const side = Math.random();
        let x, y, angle;
        if (side < 0.5) { x = Math.random(); y = -0.05; angle = Math.PI * 0.3 + Math.random() * Math.PI * 0.4; }
        else { x = -0.05; y = Math.random() * 0.5; angle = Math.PI * -0.1 + Math.random() * Math.PI * 0.3; }
        this.shootingStars.push({
            x, y, vx: Math.cos(angle) * 0.004, vy: Math.sin(angle) * 0.004,
            life: 1, decay: 0.006 + Math.random() * 0.008,
            size: 1.5 + Math.random() * 2,
            trail: [], maxTrail: 20 + Math.floor(Math.random() * 15)
        });
    }

    // ==================== WEBSOCKET ====================

    connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        this.ws = new WebSocket(`${protocol}//${window.location.host}`);
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'init') {
                this.dreams = data.dreams.map((d, i) => ({
                    ...d, colorTemp: Math.random(),
                    constellationIndex: i < this.CHAPEL_STARS ? i : -1
                }));
                // Create overflow stars for dreams beyond chapel
                for (let i = this.CHAPEL_STARS; i < this.dreams.length; i++) {
                    this.createOverflowStar(this.dreams[i]);
                }
                this.updateDreamCount();
                this.checkPhaseTransitions();
            } else if (data.type === 'new_dream') {
                this.addNewDream(data.dream);
            }
        };
        this.ws.onclose = () => setTimeout(() => this.connectWebSocket(), 3000);
    }

    addNewDream(dream) {
        dream.birthTime = performance.now();
        dream.isNew = true;
        dream.colorTemp = Math.random();
        const idx = this.dreams.length;
        dream.constellationIndex = idx < this.CHAPEL_STARS ? idx : -1;
        this.dreams.push(dream);

        if (idx < this.CHAPEL_STARS) {
            // Chapel star — birth animation to constellation point
            const target = this.chapelConstellation[idx];
            if (target) {
                this.birthAnimations.push({
                    startX: Math.random(), startY: -0.1,
                    endX: target.x, endY: target.y,
                    progress: 0, speed: 0.015, dream
                });
            }
        } else {
            // Overflow star — create floating star around chapel
            this.createOverflowStar(dream);
            // Birth animation to overflow position
            const os = this.overflowStars[this.overflowStars.length - 1];
            this.birthAnimations.push({
                startX: Math.random(), startY: -0.1,
                endX: os.x, endY: os.y,
                progress: 0, speed: 0.012, dream
            });
        }

        this.updateDreamCount();
        setTimeout(() => { dream.isNew = false; }, 4000);
        this.checkPhaseTransitions();
    }

    createOverflowStar(dream) {
        // ALL overflow stars go ABOVE the chapel only
        // With the zoomed out camera (0.55), the chapel sits in the lower half
        // Overflow stars fill the sky above it
        const overflowCount = this.overflowStars.length;
        const expansion = Math.min(overflowCount / 150, 1);

        // Spread across full width, only above the chapel
        const x = 0.05 + Math.random() * 0.9;
        // Chapel top is around y=0.05 in world coords, so go above that
        const y = -0.05 - Math.random() * (0.25 + expansion * 0.4);

        const angle = Math.random() * Math.PI * 2;
        const radius = 0;

        this.overflowStars.push({
            dream,
            x: x,
            y: y,
            z: (Math.random() - 0.5) * 1.5,
            baseX: x,
            baseY: y,
            orbitAngle: angle,
            orbitSpeed: (Math.random() - 0.5) * 0.0001,
            orbitRadius: radius,
            size: 2 + Math.random() * 2,
            colorTemp: dream.colorTemp || Math.random(),
            twinkleOffset: Math.random() * Math.PI * 2
        });
    }

    checkPhaseTransitions() {
        const total = this.dreams.length;

        if (total >= this.CHAPEL_STARS && this.animationPhase === 'building') {
            // Chapel complete!
            this.animationPhase = 'complete_flash';
            this.phaseStartTime = performance.now();
            this.showLines = true;
            this.milestoneFlashStart = performance.now();
            this.milestoneFlashCount = 0;
            this.lastMilestone = this.CHAPEL_STARS;
        }

        if (this.animationPhase === 'living') {
            // Check for milestone (every 50 after chapel completion)
            const nextMilestone = this.lastMilestone + this.MILESTONE_INTERVAL;
            if (total >= nextMilestone) {
                this.animationPhase = 'milestone_flash';
                this.phaseStartTime = performance.now();
                this.milestoneFlashStart = performance.now();
                this.milestoneFlashCount = 0;
                this.lastMilestone = nextMilestone;
            }
        }
    }

    updateDreamCount() {
        const el = document.getElementById('dream-count');
        if (el) el.textContent = this.dreams.length;
    }

    // ==================== 3D PROJECTION ====================

    project3D(x, y, z, parallaxFactor = 1) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        // Perspective: objects with positive z are "closer" (bigger), negative z "farther" (smaller)
        const perspective = 800;
        const scale = perspective / (perspective - z * 100);

        // Camera offset
        const px = (x - this.camera.x) * parallaxFactor;
        const py = (y - this.camera.y) * parallaxFactor;

        return {
            x: cx + px * w * this.camera.zoom * scale,
            y: cy + py * h * this.camera.zoom * scale,
            scale, // Use for sizing stars by depth
            depth: z
        };
    }

    // Apply 3D rotation to chapel points
    rotateChapelPoint(point, timestamp) {
        // Gentle Y-axis rotation around the chapel center
        const cx = 0.5, cy = 0.47;
        const dx = point.x - cx;
        const dz = (point.z || 0);

        const cosR = Math.cos(this.rotationY);
        const sinR = Math.sin(this.rotationY);

        // Rotate around Y axis
        const newDx = dx * cosR - dz * sinR;
        const newDz = dx * sinR + dz * cosR;

        // Apply X tilt
        const dy = point.y - cy;
        const cosT = Math.cos(this.tiltX);
        const sinT = Math.sin(this.tiltX);
        const newDy = dy * cosT - newDz * sinT;
        const finalDz = dy * sinT + newDz * cosT;

        return {
            x: cx + newDx,
            y: cy + newDy,
            z: finalDz
        };
    }

    // ==================== EASING ====================

    easeOutQuart(t) { return 1 - Math.pow(1-t,4); }
    easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10*t); }

    // ==================== RENDER ====================

    render(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // No mouse tracking needed

        // Gentle 3D oscillation (sway back and forth)
        this.rotationY = Math.sin(timestamp * 0.0001 * this.rotationSpeed) * this.maxRotation;

        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.fillStyle = '#111133';
        this.ctx.fillRect(0, 0, w, h);

        this.drawNebula(timestamp);
        this.updateDustParticles(dt);
        this.drawDustParticles();
        this.updateCamera(dt);
        this.drawBackgroundStars(timestamp);
        this.updateShootingStars(dt);
        this.drawShootingStars();
        this.updateBirthAnimations();
        this.drawBirthAnimations();

        if (this.showLines) this.drawConstellationLines(timestamp);
        this.drawChapelStars(timestamp);
        this.drawOverflowStars(timestamp);
        this.drawHoverParticles(timestamp);
        this.updateAnimationPhase(timestamp);

        // Flash overlay for milestones
        this.drawFlashOverlay(timestamp);

        // Vignette
        const vignette = this.ctx.createRadialGradient(w/2, h/2, w*0.2, w/2, h/2, w*0.85);
        vignette.addColorStop(0, 'transparent');
        vignette.addColorStop(1, 'rgba(3, 3, 12, 0.3)');
        this.ctx.fillStyle = vignette;
        this.ctx.fillRect(0, 0, w, h);

        requestAnimationFrame((t) => this.render(t));
    }

    drawNebula(timestamp) {
        const w = this.canvas.width, h = this.canvas.height;
        const t = timestamp * 0.0001;
        const nebulae = [
            { cx: 0.3+Math.sin(t*0.7)*0.05, cy: 0.35+Math.cos(t*0.5)*0.03, r: 0.4, color: [80,40,120] },
            { cx: 0.7+Math.cos(t*0.6)*0.04, cy: 0.6+Math.sin(t*0.8)*0.04, r: 0.35, color: [30,50,100] },
            { cx: 0.5+Math.sin(t*0.4)*0.06, cy: 0.2+Math.cos(t*0.3)*0.05, r: 0.3, color: [100,60,80] },
            { cx: 0.15+Math.cos(t*0.5)*0.03, cy: 0.7+Math.sin(t*0.6)*0.03, r: 0.25, color: [40,60,110] },
        ];
        for (const n of nebulae) {
            const grad = this.ctx.createRadialGradient(n.cx*w, n.cy*h, 0, n.cx*w, n.cy*h, n.r*w);
            const [r,g,b] = n.color;
            grad.addColorStop(0, `rgba(${r},${g},${b},0.15)`);
            grad.addColorStop(0.4, `rgba(${r},${g},${b},0.08)`);
            grad.addColorStop(1, 'transparent');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0, 0, w, h);
        }
    }

    updateDustParticles(dt) {
        for (const p of this.dustParticles) {
            p.x += p.speedX * dt; p.y += p.speedY * dt;
            if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
            if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
        }
    }

    drawDustParticles() {
        const w = this.canvas.width, h = this.canvas.height;
        for (const p of this.dustParticles) {
            const proj = this.project3D(p.x, p.y, p.z, 0.5);
            const grad = this.ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, p.size * 2 * proj.scale);
            grad.addColorStop(0, `hsla(${p.hue},60%,70%,${p.opacity * proj.scale})`);
            grad.addColorStop(1, 'transparent');
            this.ctx.beginPath();
            this.ctx.arc(proj.x, proj.y, p.size * 2 * proj.scale, 0, Math.PI * 2);
            this.ctx.fillStyle = grad;
            this.ctx.fill();
        }
    }

    updateCamera(dt) {
        // During zooming_in and zooming_out, use time-based easing for guaranteed arrival
        // Otherwise use lerp for smooth ambient movement
        if (this.showcaseState === 'zooming_in' || this.showcaseState === 'zooming_out') {
            const elapsed = performance.now() - this.showcaseStartTime;
            const duration = this.showcaseState === 'zooming_in'
                ? this.SHOWCASE_ZOOM_TIME
                : this.SHOWCASE_ZOOMOUT_TIME;
            const t = Math.min(elapsed / duration, 1);
            const eased = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2) / 2; // easeInOutQuad

            this.camera.x = this.camera.startX + (this.camera.targetX - this.camera.startX) * eased;
            this.camera.y = this.camera.startY + (this.camera.targetY - this.camera.startY) * eased;
            this.camera.zoom = this.camera.startZoom + (this.camera.targetZoom - this.camera.startZoom) * eased;
        } else {
            // Gentle lerp for holding/viewing
            const ls = 0.003 * dt;
            this.camera.x += (this.camera.targetX - this.camera.x) * ls;
            this.camera.y += (this.camera.targetY - this.camera.y) * ls;
            this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * ls;
        }
    }

    drawBackgroundStars(timestamp) {
        const w = this.canvas.width, h = this.canvas.height;

        // Background stars render in screen space — always fill the whole screen
        for (const star of this.backgroundStars) {
            const twinkle = Math.sin(timestamp * 0.001 * star.twinkleSpeed + star.twinkleOffset);
            const brightness = star.brightness + twinkle * 0.15;
            if (brightness <= 0) continue;

            const sx = star.x * w;
            const sy = star.y * h;
            const size = star.size;
            const {r,g,b} = star.color;

            if (size > 0.8) {
                const glow = this.ctx.createRadialGradient(sx, sy, 0, sx, sy, size * 4);
                glow.addColorStop(0, `rgba(${r},${g},${b},${brightness * 0.7})`);
                glow.addColorStop(1, 'transparent');
                this.ctx.beginPath();
                this.ctx.arc(sx, sy, size * 4, 0, Math.PI * 2);
                this.ctx.fillStyle = glow;
                this.ctx.fill();
            }

            this.ctx.beginPath();
            this.ctx.arc(sx, sy, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${r},${g},${b},${brightness})`;
            this.ctx.fill();
        }
    }

    updateShootingStars(dt) {
        for (let i = this.shootingStars.length - 1; i >= 0; i--) {
            const s = this.shootingStars[i];
            s.trail.unshift({x: s.x, y: s.y, life: 1});
            if (s.trail.length > s.maxTrail) s.trail.pop();
            for (const t of s.trail) t.life -= 0.04;
            s.x += s.vx * dt; s.y += s.vy * dt; s.life -= s.decay;
            if (s.life <= 0 || s.x > 1.5 || s.y > 1.5) this.shootingStars.splice(i, 1);
        }
    }

    drawShootingStars() {
        const w = this.canvas.width, h = this.canvas.height;
        for (const s of this.shootingStars) {
            for (let i = 0; i < s.trail.length - 1; i++) {
                const t = s.trail[i], next = s.trail[i+1];
                if (t.life <= 0) continue;
                const alpha = t.life * s.life * 0.6;
                this.ctx.beginPath();
                this.ctx.moveTo(t.x*w, t.y*h);
                this.ctx.lineTo(next.x*w, next.y*h);
                this.ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                this.ctx.lineWidth = (1 - i / s.trail.length) * s.size;
                this.ctx.stroke();
            }
            const sx = s.x*w, sy = s.y*h;
            const hg = this.ctx.createRadialGradient(sx, sy, 0, sx, sy, s.size*4);
            hg.addColorStop(0, `rgba(255,255,255,${s.life})`);
            hg.addColorStop(0.3, `rgba(200,220,255,${s.life*0.5})`);
            hg.addColorStop(1, 'transparent');
            this.ctx.beginPath();
            this.ctx.arc(sx, sy, s.size*4, 0, Math.PI*2);
            this.ctx.fillStyle = hg;
            this.ctx.fill();
        }
    }

    updateBirthAnimations() {
        for (let i = this.birthAnimations.length - 1; i >= 0; i--) {
            const b = this.birthAnimations[i];
            b.progress += b.speed;
            if (b.progress >= 1) {
                for (let j = 0; j < 10; j++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 0.0003 + Math.random() * 0.001;
                    this.hoverParticles.push({
                        x: b.endX, y: b.endY, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed,
                        life: 1, decay: 0.025 + Math.random()*0.015, size: 0.8+Math.random()*1.2, gold: true
                    });
                }
                this.birthAnimations.splice(i, 1);
            }
        }
    }

    drawBirthAnimations() {
        const w = this.canvas.width, h = this.canvas.height;
        for (const b of this.birthAnimations) {
            const t = this.easeOutExpo(b.progress);
            const x = (b.startX + (b.endX - b.startX) * t) * w;
            const y = (b.startY + (b.endY - b.startY) * t) * h;

            for (let i = 0; i < 15; i++) {
                const tt = Math.max(0, b.progress - i * 0.01);
                const et = this.easeOutExpo(tt);
                const tx = (b.startX + (b.endX - b.startX) * et) * w;
                const ty = (b.startY + (b.endY - b.startY) * et) * h;
                const alpha = (1 - i / 15) * 0.6;
                this.ctx.beginPath();
                this.ctx.arc(tx, ty, (1 - i / 15) * 3, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(212,175,55,${alpha})`;
                this.ctx.fill();
            }

            const hg = this.ctx.createRadialGradient(x, y, 0, x, y, 15);
            hg.addColorStop(0, 'rgba(255,248,230,1)');
            hg.addColorStop(0.3, 'rgba(212,175,55,0.8)');
            hg.addColorStop(1, 'transparent');
            this.ctx.beginPath();
            this.ctx.arc(x, y, 15, 0, Math.PI * 2);
            this.ctx.fillStyle = hg;
            this.ctx.fill();
        }
    }

    drawHoverParticles(timestamp) {
        for (let i = this.hoverParticles.length - 1; i >= 0; i--) {
            const p = this.hoverParticles[i];
            p.x += p.vx; p.y += p.vy; p.vy -= 0.00002; p.life -= p.decay;
            if (p.life <= 0) { this.hoverParticles.splice(i, 1); continue; }
            const px = p.x * this.canvas.width, py = p.y * this.canvas.height;
            if (p.gold) {
                const g = this.ctx.createRadialGradient(px, py, 0, px, py, p.size*3);
                g.addColorStop(0, `rgba(255,248,230,${p.life*0.8})`);
                g.addColorStop(0.5, `rgba(212,175,55,${p.life*0.4})`);
                g.addColorStop(1, 'transparent');
                this.ctx.beginPath();
                this.ctx.arc(px, py, p.size*3, 0, Math.PI*2);
                this.ctx.fillStyle = g;
                this.ctx.fill();
            }
        }
    }

    // ==================== CONSTELLATION DRAWING ====================

    drawConstellationLines(timestamp) {
        if (this.animationPhase === 'complete_flash' || this.animationPhase === 'living' || this.animationPhase === 'milestone_flash') {
            this.linesOpacity = Math.min(this.linesOpacity + 0.01, 1);
        }
        if (this.linesOpacity <= 0) return;

        const numStars = Math.min(this.dreams.length, this.CHAPEL_STARS);
        this.ctx.save();

        for (const [si, ei] of this.constellationLines) {
            if (si >= numStars || ei >= numStars) continue;
            if (si >= this.chapelConstellation.length || ei >= this.chapelConstellation.length) continue;

            const sp3d = this.rotateChapelPoint(this.chapelConstellation[si], timestamp);
            const ep3d = this.rotateChapelPoint(this.chapelConstellation[ei], timestamp);
            const s = this.project3D(sp3d.x, sp3d.y, sp3d.z, 1);
            const e = this.project3D(ep3d.x, ep3d.y, ep3d.z, 1);

            this.ctx.beginPath();
            this.ctx.moveTo(s.x, s.y);
            this.ctx.lineTo(e.x, e.y);
            this.ctx.strokeStyle = `rgba(212,175,55,${0.7 * this.linesOpacity})`;
            this.ctx.lineWidth = 2;
            this.ctx.shadowColor = `rgba(212,175,55,${0.8})`;
            this.ctx.shadowBlur = 15;
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    getStarColor(ct, alpha) {
        if (ct < 0.3) return `rgba(180,200,255,${alpha})`;
        if (ct < 0.6) return `rgba(255,248,240,${alpha})`;
        return `rgba(255,230,180,${alpha})`;
    }

    getStarCoreColor(ct) {
        if (ct < 0.3) return '#e0e8ff';
        if (ct < 0.6) return '#fff8e7';
        return '#ffe8c0';
    }

    drawStar(px, py, size, ct, timestamp) {
        // Outer glow
        const outerSize = size * 10;
        const og = this.ctx.createRadialGradient(px, py, 0, px, py, outerSize);
        og.addColorStop(0, 'rgba(212,175,55,0.15)');
        og.addColorStop(0.3, 'rgba(212,175,55,0.05)');
        og.addColorStop(1, 'transparent');
        this.ctx.beginPath();
        this.ctx.arc(px, py, outerSize, 0, Math.PI * 2);
        this.ctx.fillStyle = og;
        this.ctx.fill();

        // Inner glow
        const ig = this.ctx.createRadialGradient(px, py, 0, px, py, size * 4);
        ig.addColorStop(0, this.getStarColor(ct, 0.5));
        ig.addColorStop(0.4, 'rgba(212,175,55,0.2)');
        ig.addColorStop(1, 'transparent');
        this.ctx.beginPath();
        this.ctx.arc(px, py, size * 4, 0, Math.PI * 2);
        this.ctx.fillStyle = ig;
        this.ctx.fill();

        // Core
        const cg = this.ctx.createRadialGradient(px, py, 0, px, py, size);
        cg.addColorStop(0, this.getStarCoreColor(ct));
        cg.addColorStop(0.6, '#d4af37');
        cg.addColorStop(1, 'rgba(180,140,40,0.6)');
        this.ctx.beginPath();
        this.ctx.arc(px, py, size, 0, Math.PI * 2);
        this.ctx.fillStyle = cg;
        this.ctx.fill();

        // Diffraction spikes
        const flicker = Math.sin(timestamp * 0.002 + px * 0.1) * 0.2 + 0.8;
        this.ctx.save();
        this.ctx.globalAlpha = 0.35 * flicker;
        const spikeSize = size * 3.5;
        const hg = this.ctx.createLinearGradient(px - spikeSize, py, px + spikeSize, py);
        hg.addColorStop(0, 'transparent');
        hg.addColorStop(0.5, this.getStarColor(ct, 0.7));
        hg.addColorStop(1, 'transparent');
        this.ctx.fillStyle = hg;
        this.ctx.fillRect(px - spikeSize, py - 0.8, spikeSize * 2, 1.6);
        const vg = this.ctx.createLinearGradient(px, py - spikeSize, px, py + spikeSize);
        vg.addColorStop(0, 'transparent');
        vg.addColorStop(0.5, this.getStarColor(ct, 0.7));
        vg.addColorStop(1, 'transparent');
        this.ctx.fillStyle = vg;
        this.ctx.fillRect(px - 0.8, py - spikeSize, 1.6, spikeSize * 2);
        this.ctx.restore();
    }

    drawChapelStars(timestamp) {
        const numStars = Math.min(this.dreams.length, this.CHAPEL_STARS);

        for (let i = 0; i < numStars; i++) {
            const dream = this.dreams[i];
            const cp = this.chapelConstellation[i];
            if (!cp) continue;

            // Apply 3D rotation
            const rotated = this.rotateChapelPoint(cp, timestamp);
            const proj = this.project3D(rotated.x, rotated.y, rotated.z, 1);

            let size = 3.5 * this.camera.zoom * proj.scale;

            // Showcase scaling
            const isShowcased = this.currentShowcaseDream && dream.id === this.currentShowcaseDream.id;
            if (isShowcased && (this.showcaseState === 'showing' || this.showcaseState === 'zooming_in' || this.showcaseState === 'holding' || this.showcaseState === 'fading')) {
                const elapsed = timestamp - this.showcaseStartTime;
                let ss;
                if (this.showcaseState === 'zooming_in') {
                    ss = 1 + this.easeOutQuart(Math.min(elapsed / this.SHOWCASE_ZOOM_TIME, 1)) * 3;
                } else if (this.showcaseState === 'fading') {
                    ss = 4 - this.easeOutQuart(Math.min(elapsed / this.SHOWCASE_FADE_TIME, 1)) * 1;
                } else {
                    ss = 4; // Big and bright during showing
                }
                size *= ss;
                // Subtle particle emit from showcased star
                if (Math.random() < 0.05) {
                    const angle = Math.random() * Math.PI * 2;
                    this.hoverParticles.push({
                        x: rotated.x, y: rotated.y,
                        vx: Math.cos(angle)*0.0003, vy: Math.sin(angle)*0.0003,
                        life: 1, decay: 0.03, size: 0.5+Math.random()*0.5, gold: true
                    });
                }
            }

            // Birth animation
            if (dream.isNew && dream.birthTime) {
                size *= this.easeOutQuart(Math.min((timestamp - dream.birthTime) / 2000, 1));
            }

            // Depth-based brightness: dimmer if far, brighter if close
            const depthAlpha = 0.85 + rotated.z * 0.15;
            this.ctx.globalAlpha = Math.max(0.6, Math.min(1, depthAlpha));
            this.drawStar(proj.x, proj.y, size, dream.colorTemp || 0.5, timestamp);
            this.ctx.globalAlpha = 1;
        }
    }

    drawOverflowStars(timestamp) {
        for (const os of this.overflowStars) {
            // Gentle orbit drift
            os.orbitAngle += os.orbitSpeed * 16;
            os.x = os.baseX + Math.sin(os.orbitAngle) * 0.005;
            os.y = os.baseY + Math.cos(os.orbitAngle) * 0.003;

            const proj = this.project3D(os.x, os.y, os.z, 1);

            let size = os.size * proj.scale;
            const twinkle = Math.sin(timestamp * 0.001 + os.twinkleOffset) * 0.15 + 0.85;
            size *= twinkle;

            // Showcase for overflow dreams
            const dream = os.dream;
            const isShowcased = this.currentShowcaseDream && dream && dream.id === this.currentShowcaseDream.id;
            if (isShowcased && (this.showcaseState === 'showing' || this.showcaseState === 'zooming_in' || this.showcaseState === 'holding' || this.showcaseState === 'fading')) {
                const elapsed = timestamp - this.showcaseStartTime;
                let ss;
                if (this.showcaseState === 'zooming_in') {
                    ss = 1 + this.easeOutQuart(Math.min(elapsed / this.SHOWCASE_ZOOM_TIME, 1)) * 3;
                } else if (this.showcaseState === 'fading') {
                    ss = 4 - this.easeOutQuart(Math.min(elapsed / this.SHOWCASE_FADE_TIME, 1)) * 1;
                } else {
                    ss = 4;
                }
                size *= ss;
            }

            // Birth fade-in
            if (dream && dream.isNew && dream.birthTime) {
                const bp = Math.min((timestamp - dream.birthTime) / 2000, 1);
                this.ctx.globalAlpha = this.easeOutQuart(bp);
            }

            // Depth-based brightness
            const depthAlpha = 0.7 + (os.z + 0.75) * 0.3;
            this.ctx.globalAlpha *= Math.max(0.5, Math.min(1, depthAlpha));

            this.drawStar(proj.x, proj.y, size, os.colorTemp, timestamp);
            this.ctx.globalAlpha = 1;
        }
    }

    // ==================== FLASH OVERLAY ====================

    drawFlashOverlay(timestamp) {
        if (this.animationPhase !== 'complete_flash' && this.animationPhase !== 'milestone_flash') return;

        const elapsed = timestamp - this.milestoneFlashStart;
        const flashDuration = 400; // ms per flash
        const totalFlashes = 5;
        const flashPhase = elapsed / flashDuration;

        if (flashPhase < totalFlashes) {
            const intensity = Math.sin((flashPhase % 1) * Math.PI);
            const w = this.canvas.width, h = this.canvas.height;

            // White-gold flash
            const fg = this.ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w*0.6);
            fg.addColorStop(0, `rgba(255,248,230,${intensity * 0.6})`);
            fg.addColorStop(0.5, `rgba(212,175,55,${intensity * 0.35})`);
            fg.addColorStop(1, 'transparent');
            this.ctx.fillStyle = fg;
            this.ctx.fillRect(0, 0, w, h);
        }
    }

    // ==================== ANIMATION STATE MACHINE ====================

    getNextShowcaseDream() {
        if (this.dreams.length === 0) return null;
        if (this.showcasedDreams.length >= this.dreams.length) this.showcasedDreams = [];
        const available = this.dreams.filter(d => !this.showcasedDreams.includes(d.id));
        if (available.length === 0) return this.dreams[Math.floor(Math.random() * this.dreams.length)];
        const selected = available[Math.floor(Math.random() * available.length)];
        this.showcasedDreams.push(selected.id);
        return selected;
    }

    showDreamOverlay(dream) {
        const overlay = document.getElementById('dream-overlay');
        const textEl = document.getElementById('dream-text');
        const authorEl = document.getElementById('dream-author');
        if (overlay && textEl && authorEl && dream) {
            textEl.textContent = dream.dream;
            authorEl.textContent = dream.name;
            overlay.classList.add('visible');
            document.body.classList.add('showing-dream');
        }
    }

    hideDreamOverlay() {
        const overlay = document.getElementById('dream-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
            document.body.classList.remove('showing-dream');
        }
    }

    updateShowcase(timestamp) {
        if (this.dreams.length === 0) { this.hideDreamOverlay(); return; }
        const elapsed = timestamp - this.showcaseStartTime;

        // Base camera position depends on phase
        const isPost = this.animationPhase === 'living' || this.animationPhase === 'milestone_flash';
        const baseZoom = isPost ? 0.65 : 1;
        const baseY = isPost ? 0.4 : 0.5;

        switch (this.showcaseState) {
            case 'viewing':
                this.camera.targetX = 0.5; this.camera.targetY = baseY;
                this.camera.targetZoom = baseZoom;
                if (elapsed > this.SHOWCASE_VIEW_TIME) {
                    this.currentShowcaseDream = this.getNextShowcaseDream();
                    if (this.currentShowcaseDream) {
                        this.showcaseState = 'zooming_in';
                        this.showcaseStartTime = timestamp;
                        // Save camera start for eased animation
                        this.camera.startX = this.camera.x;
                        this.camera.startY = this.camera.y;
                        this.camera.startZoom = this.camera.zoom;
                    }
                }
                break;
            case 'zooming_in': {
                // 1. Move camera to the star
                if (this.currentShowcaseDream) {
                    const idx = this.currentShowcaseDream.constellationIndex;
                    let target;
                    if (idx >= 0 && idx < this.CHAPEL_STARS) {
                        target = this.chapelConstellation[idx];
                    } else {
                        const os = this.overflowStars.find(o => o.dream && o.dream.id === this.currentShowcaseDream.id);
                        if (os) target = { x: os.x, y: os.y };
                    }
                    if (target) {
                        this.camera.targetX = target.x;
                        this.camera.targetY = target.y;
                        this.camera.targetZoom = 2.2;
                    }
                }
                if (elapsed > this.SHOWCASE_ZOOM_TIME) {
                    // 2. Camera arrived — hold briefly before showing text
                    this.showcaseState = 'holding';
                    this.showcaseStartTime = timestamp;
                }
                break;
            }
            case 'holding':
                // 3. Brief pause at the star, then show text
                if (elapsed > this.SHOWCASE_HOLD_TIME) {
                    this.showcaseState = 'showing';
                    this.showcaseStartTime = timestamp;
                    this.showDreamOverlay(this.currentShowcaseDream);
                }
                break;
            case 'showing':
                // 4. Text visible for 4 seconds
                if (elapsed > this.SHOWCASE_SHOW_TIME) {
                    this.showcaseState = 'fading';
                    this.showcaseStartTime = timestamp;
                    this.hideDreamOverlay(); // triggers CSS fade out
                }
                break;
            case 'fading':
                // 5. Wait for text to fully fade, THEN zoom out
                if (elapsed > this.SHOWCASE_FADE_TIME) {
                    this.showcaseState = 'zooming_out';
                    this.showcaseStartTime = timestamp;
                    // Save camera start for eased animation back
                    this.camera.startX = this.camera.x;
                    this.camera.startY = this.camera.y;
                    this.camera.startZoom = this.camera.zoom;
                }
                break;
            case 'zooming_out':
                // 6. Zoom back to full view
                this.camera.targetX = 0.5; this.camera.targetY = baseY;
                this.camera.targetZoom = baseZoom;
                if (elapsed > this.SHOWCASE_ZOOMOUT_TIME) {
                    this.showcaseState = 'viewing';
                    this.showcaseStartTime = timestamp;
                    this.currentShowcaseDream = null;
                }
                break;
        }
    }

    updateAnimationPhase(timestamp) {
        const elapsed = timestamp - this.phaseStartTime;

        switch (this.animationPhase) {
            case 'building':
                this.updateShowcase(timestamp);
                break;

            case 'complete_flash':
                this.hideDreamOverlay();
                // Zoom way out and shift down so chapel is in lower portion, sky above
                this.camera.targetX = 0.5; this.camera.targetY = 0.4;
                this.camera.targetZoom = 0.65;
                if (elapsed > 2500) {
                    this.animationPhase = 'living';
                    this.phaseStartTime = timestamp;
                    this.showcaseState = 'viewing';
                    this.showcaseStartTime = timestamp;
                }
                break;

            case 'living':
                // Only set base camera when viewing (not during showcase zoom)
                this.updateShowcase(timestamp);
                break;

            case 'milestone_flash':
                this.hideDreamOverlay();
                this.camera.targetX = 0.5; this.camera.targetY = 0.35; this.camera.targetZoom = 0.55;
                // Spawn burst of shooting stars during milestone
                if (elapsed < 500 && Math.random() < 0.3) this.spawnShootingStar();
                if (elapsed > 2500) {
                    this.animationPhase = 'living';
                    this.phaseStartTime = timestamp;
                    this.showcaseState = 'viewing';
                    this.showcaseStartTime = timestamp;
                }
                break;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new Starfield(document.getElementById('starfield'));

    // Keep-alive ping every 4 minutes to prevent Render from sleeping
    setInterval(() => {
        fetch('/api/ping').catch(() => {});
    }, 4 * 60 * 1000);
});
