document.addEventListener('DOMContentLoaded', () => {
    // Fade-in effect for sections
    const sections = document.querySelectorAll('.fade-in-section');
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Secure form handling with client-side validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Check honeypot field (anti-spam)
            const honeypot = contactForm.querySelector('input[name="website"]');
            if (honeypot && honeypot.value) {
                console.warn('Bot detected');
                return;
            }
            
            // Get form data
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const submitText = document.getElementById('submit-text');
            const submitLoading = document.getElementById('submit-loading');
            
            // Sanitize input data
            const name = formData.get('name').trim().substring(0, 100);
            const email = formData.get('email').trim().toLowerCase().substring(0, 254);
            const message = formData.get('message').trim().substring(0, 1000);
            
            // Additional validation
            const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
            const nameRegex = /^[A-Za-z\s]{2,100}$/;
            
            if (!nameRegex.test(name)) {
                alert('Please enter a valid name (letters and spaces only)');
                return;
            }
            
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            if (message.length < 10) {
                alert('Please enter a message with at least 10 characters');
                return;
            }
            
            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitText.classList.add('hidden');
            submitLoading.classList.remove('hidden');
            
            // Simulate form submission (replace with actual endpoint)
            try {
                // For demonstration - replace with actual API endpoint
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Success handling
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Sorry, there was an error sending your message. Please try again later.');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitText.classList.remove('hidden');
                submitLoading.classList.add('hidden');
            }
        });
    }

    // Active nav link highlighting on scroll
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('main section');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: "0px 0px -80% 0px" });
    contentSections.forEach(section => {
        navObserver.observe(section);
    });
    // Set the first link as active by default
    if(navLinks.length > 0) {
         navLinks[0].classList.add('active');
    }

    // Magnetic field button effect
    const buttonContainer = document.querySelector('.magnetic-field-button');
    if (buttonContainer) {
        buttonContainer.addEventListener('mouseenter', () => {
            createParticles(buttonContainer);
        });
        buttonContainer.addEventListener('mouseleave', () => {
            removeParticles(buttonContainer);
        });
    }
});

// Track if keyframe rules have been added
let keyframesAdded = new Set();

function createParticles(container) {
    removeParticles(container); // Clear existing particles
    const particleCount = 30;
    
    // Generate unique keyframe for this batch of particles
    const keyframeName = `float-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.dataset.keyframeName = keyframeName; // Store keyframe name for cleanup
        container.appendChild(particle);

        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        const angle = Math.random() * 360;
        const radius = (Math.random() * 40) + 40;
        const x = Math.cos(angle) * radius + (container.offsetWidth / 2);
        const y = Math.sin(angle) * radius + (container.offsetHeight / 2);
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        const floatDuration = Math.random() * 2 + 1;
        
        // Use individual transform for each particle instead of shared keyframe
        const translateX = Math.random() * 10 - 5;
        const translateY = Math.random() * 10 - 5;
        particle.style.setProperty('--translate-x', `${translateX}px`);
        particle.style.setProperty('--translate-y', `${translateY}px`);
        
        particle.style.animationDuration = `${floatDuration}s, 1.5s`;
        particle.style.animationName = `particle-float, pulsate`;
        particle.style.animationTimingFunction = `ease-in-out`;
        particle.style.animationIterationCount = `infinite`;
        particle.style.animationDirection = `alternate`;
    }
    
    // Add keyframe rule only once if not already added
    if (!keyframesAdded.has('particle-float')) {
        const styleSheet = document.styleSheets[0];
        const keyframes = `
            @keyframes particle-float {
                0% { transform: translate(0, 0); }
                100% { transform: translate(var(--translate-x, 0), var(--translate-y, 0)); }
            }`;
        try {
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
            keyframesAdded.add('particle-float');
        } catch(e) {
            console.warn("Could not insert keyframe rule:", e);
        }
    }
}

function removeParticles(container) {
    const particles = container.querySelectorAll('.particle');
    particles.forEach(p => p.remove());
}


// Script for animated background
window.onload = function() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background

    // Particle setup
    const particlesGeometry = new THREE.BufferGeometry;
    const particlesCount = 7000;
    const posArray = new Float32Array(particlesCount * 3); // x, y, z for each particle

    for (let i = 0; i < particlesCount; i++) {
        // Spread particles in a larger sphere
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 2.5; // Use cube root for more uniform distribution
        posArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i * 3 + 2] = r * Math.cos(phi);
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x818cf8, // indigo-400
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.7
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 1.5;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Animate particles
        particlesMesh.rotation.y = elapsedTime * 0.02;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        // Mouse move animation
        if (mouseX > 0) {
            const targetX = (mouseX / window.innerWidth - 0.5) * 0.5;
            const targetY = (mouseY / window.innerHeight - 0.5) * 0.5;
            camera.position.x += (targetX - camera.position.x) * 0.05;
            camera.position.y += (-targetY - camera.position.y) * 0.05;
        }

        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}
