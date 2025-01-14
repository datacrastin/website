// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollTop = 0;
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Animated counter for stats
const stats = document.querySelectorAll('.stat-number');
const animateStats = () => {
    stats.forEach(stat => {
        const target = parseFloat(stat.textContent);
        const increment = target / 50;
        let current = 0;

        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = current.toFixed(current % 1 === 0 ? 0 : 1);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        };
        updateCount();
    });
};

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            if (entry.target.classList.contains('hero-stats')) {
                animateStats();
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Elements to observe
document.querySelectorAll('.feature-card, .hero-stats, .security-features li').forEach(el => {
    observer.observe(el);
});

// Interactive globe visualization
const createGlobe = () => {
    const globe = document.querySelector('.globe-visualization');
    if (!globe) return;

    const createNode = () => {
        const node = document.createElement('div');
        node.className = 'globe-node';
        node.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary);
            border-radius: 50%;
            transform: translate(-50%, -50%);
        `;
        return node;
    };

    const createConnection = (start, end) => {
        const connection = document.createElement('div');
        connection.className = 'globe-connection';
        connection.style.cssText = `
            position: absolute;
            background: linear-gradient(to right, var(--primary-transparent), var(--primary));
            height: 1px;
            transform-origin: left center;
            opacity: 0.5;
        `;
        return connection;
    };

    // Create nodes
    for (let i = 0; i < 15; i++) {
        const node = createNode();
        const angle = (Math.random() * Math.PI * 2);
        const radius = 150 + Math.random() * 100;
        const x = Math.cos(angle) * radius + globe.clientWidth / 2;
        const y = Math.sin(angle) * radius + globe.clientHeight / 2;
        
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        globe.appendChild(node);

        // Animate nodes
        gsap.to(node, {
            duration: 2 + Math.random() * 2,
            y: '+=20',
            x: '+=20',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
};

// Particle background effect
const createParticleBackground = () => {
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-background';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = 'rgba(252, 88, 104, 0.1)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const initParticles = () => {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    };

    initParticles();
    animate();
};

// Feature card hover effect
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createGlobe();
    createParticleBackground();
    
    // Add CSS for new interactive elements
    const style = document.createElement('style');
    style.textContent = `
        .feature-card {
            position: relative;
            overflow: hidden;
        }
        
        .feature-card::after {
            content: '';
            position: absolute;
            top: var(--mouse-y, 0);
            left: var(--mouse-x, 0);
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(252, 88, 104, 0.1) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .feature-card:hover::after {
            opacity: 1;
        }
        
        .particle-background {
            position: fixed;
            top: 0;
            left: 0;
            z-index: -1;
            pointer-events: none;
        }
        
        .scroll-down {
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out;
        }
        
        .scroll-up {
            transform: translateY(0);
            transition: transform 0.3s ease-in-out;
        }
        
        .animate {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}); 
