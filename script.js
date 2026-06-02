document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements Architecture Mapping
    const audio = document.getElementById("bg-music");
    const musicBtn = document.getElementById("music-control");
    const canvas = document.getElementById("ambient-canvas");
    const ctx = canvas.getContext("2d");

    // Initialize Global App Audio Preferences 
    audio.volume = 0.25; // Sincere low volume by default
    let isMusicPlaying = false;

    /* ==========================================================================
       1. CANVAS PARTICLE SYSTEM ENGINE (Floating Yellow Petals & Sparks)
       ========================================================================== */
    let particlesArray = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(type) {
            this.type = type; // 'petal' or 'glow'
            this.x = Math.random() * canvas.width;
            this.y = type === 'petal' ? -20 : Math.random() * canvas.height + canvas.height;
            this.size = type === 'petal' ? Math.random() * 12 + 6 : Math.random() * 3 + 1;
            this.speedX = Math.random() * 1.5 - 0.5;
            this.speedY = type === 'petal' ? Math.random() * 1 + 0.5 : -(Math.random() * 0.8 + 0.2);
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.type === 'petal') {
                this.rotation += this.rotationSpeed;
                // Sway drift math simulation
                this.speedX += Math.sin(this.y / 30) * 0.02;
            }

            // Boundary wrap limits loop setup
            if (this.y > canvas.height + 20 && this.type === 'petal') {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
            if (this.y < -20 && this.type === 'glow') {
                this.y = canvas.height + 20;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);

            if (this.type === 'petal') {
                ctx.rotate((this.rotation * Math.PI) / 180);
                // Draw realistic organic yellow petal paths
                ctx.fillStyle = "linear-gradient(to right, #fffae6, #f7e7ad)";
                ctx.shadowColor = "#fcf3cf";
                ctx.shadowBlur = 4;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(this.size, -this.size, this.size * 2, 0);
                ctx.quadraticCurveTo(this.size, this.size, 0, 0);
                ctx.closePath();
                ctx.fillStyle = "#fcecb6";
                ctx.fill();
            } else {
                // Soft golden radiant energy points
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fillStyle = "#ebd073";
                ctx.shadowColor = "#f5df93";
                ctx.shadowBlur = 8;
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function initParticles() {
        particlesArray = [];
        // Balanced counts for uninterrupted 60fps performance across mobile viewports
        const petalCount = window.innerWidth < 768 ? 15 : 35;
        const glowCount = window.innerWidth < 768 ? 20 : 45;

        for (let i = 0; i < petalCount; i++) particlesArray.push(new Particle('petal'));
        for (let i = 0; i < glowCount; i++) particlesArray.push(new Particle('glow'));
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    /* ==========================================================================
       2. INTERACTION & SYSTEM MUSIC CONTROLLER
       ========================================================================== */
    function toggleAudio() {
        if (isMusicPlaying) {
            audio.pause();
            musicBtn.querySelector(".music-text").textContent = "Play Music";
            isMusicPlaying = false;
        } else {
            audio.play().catch(e => console.log("Audio waiting for core gesture context."));
            musicBtn.querySelector(".music-text").textContent = "Pause Music";
            isMusicPlaying = true;
        }
    }

    musicBtn.addEventListener("click", toggleAudio);

    /* ==========================================================================
       3. TIMED HANDWRITTEN TYPEWRITER ENGINE
       ========================================================================= */
    const textTarget = document.getElementById("typewriter-target");
    const sourceString = document.getElementById("letter-source-text").innerHTML.trim();
    const continueBtn = document.getElementById("letter-continue-btn");
    let charIndex = 0;

    function runTypewriter() {
        if (charIndex < sourceString.length) {
            textTarget.textContent += sourceString.charAt(charIndex);
            charIndex++;
            // Dynamic pacing simulation based on punctuation markers
            let speed = 25;
            const lastChar = sourceString.charAt(charIndex - 1);
            if (lastChar === '.' || lastChar === ',') speed = 450;
            
            setTimeout(runTypewriter, speed);
        } else {
            textTarget.classList.add("typing-complete");
            continueBtn.classList.add("visible");
        }
    }

    /* ==========================================================================
       4. SCREEN TRACK NAVIGATION ROUTING SYSTEM (SPA)
       ========================================================================== */
    const screens = document.querySelectorAll(".app-screen");
    const navButtons = document.querySelectorAll(".nav-btn");

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetScreenId = btn.getAttribute("data-next");
            
            // Audio Core Trigger fallback upon initial interface click sequence interaction
            if (!isMusicPlaying && btn.id === "start-journey-btn") {
                toggleAudio();
            }

            // Route execution phase
            screens.forEach(screen => {
                screen.classList.remove("active");
                if (screen.id === targetScreenId) {
                    screen.classList.add("active");
                    handleScreenActivationHooks(targetScreenId);
                }
            });
        });
    });

    function handleScreenActivationHooks(screenId) {
        if (screenId === "page-apology" && charIndex === 0) {
            // Initiate typing effect delay cycle safely after smooth transition handles pass
            setTimeout(runTypewriter, 1200);
        }

        if (screenId === "page-bouquet") {
            const bouquetContainer = document.querySelector(".drawing-bouquet-container");
            const bouquetBtn = document.getElementById("bouquet-continue-btn");
            
            // Reset and trigger vector line drawing animations
            bouquetContainer.classList.remove("start-drawing");
            bouquetBtn.classList.remove("visible");
            
            void bouquetContainer.offsetWidth; // Force CSS layout update
            bouquetContainer.classList.add("start-drawing");

            // Display navigation route option seamlessly after 5 seconds of drawing
            setTimeout(() => {
                bouquetBtn.classList.add("visible");
            }, 5000);
        }
        
        if (screenId === "page-memories") {
            document.getElementById("page-memories").classList.add("page-memories-active");
            // Add custom animation execution handlers for photo element triggers
            const memoryCards = document.querySelectorAll(".timeline-item");
            memoryCards.forEach(card => card.classList.add("animate-in"));
        }

        if (screenId === "page-forever") {
            executeFinalSequence();
        }
    }

    /* ==========================================================================
       5. PAGE 5: EMOTIONAL SEQUENCE FINALE ARCHITECTURE
       ========================================================================== */
    function executeFinalSequence() {
        const lines = document.querySelectorAll(".seq-line");
        const giantLily = document.getElementById("giant-lily-container");
        const finalDeclaration = document.getElementById("final-declaration-msg");

        lines.forEach(line => {
            const delay = parseInt(line.getAttribute("data-delay"), 10);
            
            // Reveal text phases incrementally
            setTimeout(() => {
                line.classList.add("show");
            }, delay);

            // Shift outward towards the next expression step
            if (delay < 9500) {
                setTimeout(() => {
                    line.classList.remove("show");
                    line.classList.add("fade-out");
                }, delay + 1800);
            }
        });

        // Trigger master grand bloom and signature glowing announcement layout elements
        setTimeout(() => {
            giantLily.classList.add("bloom");
        }, 11500);

        setTimeout(() => {
            finalDeclaration.classList.add("display-final");
            
            // Spawn extra intense particle bursts around the final title declaration area
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    particlesArray.push(new Particle('glow'));
                }, i * 100);
            }
        }, 13000);
    }
});