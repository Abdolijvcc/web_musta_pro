/**
 * TRAINER PRO - Neurons Effect
 * Cursor-following neural network animation
 */

class NeuronSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.neurons = [];
        this.mouse = { x: 0, y: 0 };
        this.isActive = false;

        // Configuration
        this.config = {
            neuronCount: 80,
            maxDistance: 150,
            cursorRadius: 200,
            cursorAttraction: 0.03,
            neuronSpeed: 0.5,
            connectionOpacity: 0.15,
            neuronSize: 3,
            glowSize: 8
        };

        this.init();
    }

    init() {
        // Only activate on desktop
        if (window.innerWidth < 768) {
            this.canvas.style.display = 'none';
            return;
        }

        this.isActive = true;
        this.resize();
        this.createNeurons();
        this.setupEventListeners();
        this.animate();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createNeurons() {
        this.neurons = [];
        for (let i = 0; i < this.config.neuronCount; i++) {
            this.neurons.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.neuronSpeed,
                vy: (Math.random() - 0.5) * this.config.neuronSpeed,
                radius: this.config.neuronSize,
                originalVx: (Math.random() - 0.5) * this.config.neuronSpeed,
                originalVy: (Math.random() - 0.5) * this.config.neuronSpeed
            });
        }
    }

    setupEventListeners() {
        const updateMouse = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        };

        this.canvas.addEventListener('mousemove', updateMouse);
        this.canvas.addEventListener('mouseenter', () => {
            this.mouse.active = true;
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.active = false;
        });

        window.addEventListener('resize', () => {
            this.resize();
            if (window.innerWidth < 768) {
                this.isActive = false;
                this.canvas.style.display = 'none';
            } else {
                this.isActive = true;
                this.canvas.style.display = 'block';
            }
        });
    }

    updateNeurons() {
        this.neurons.forEach(neuron => {
            // Calculate distance to mouse
            const dx = this.mouse.x - neuron.x;
            const dy = this.mouse.y - neuron.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Cursor attraction
            if (this.mouse.active && distance < this.config.cursorRadius) {
                const force = (1 - distance / this.config.cursorRadius) * this.config.cursorAttraction;
                neuron.vx += dx * force;
                neuron.vy += dy * force;
            } else {
                // Return to original velocity
                neuron.vx += (neuron.originalVx - neuron.vx) * 0.01;
                neuron.vy += (neuron.originalVy - neuron.vy) * 0.01;
            }

            // Apply velocity
            neuron.x += neuron.vx;
            neuron.y += neuron.vy;

            // Bounce off edges
            if (neuron.x < 0 || neuron.x > this.canvas.width) {
                neuron.vx *= -1;
                neuron.originalVx *= -1;
                neuron.x = Math.max(0, Math.min(this.canvas.width, neuron.x));
            }
            if (neuron.y < 0 || neuron.y > this.canvas.height) {
                neuron.vy *= -1;
                neuron.originalVy *= -1;
                neuron.y = Math.max(0, Math.min(this.canvas.height, neuron.y));
            }

            // Damping
            neuron.vx *= 0.99;
            neuron.vy *= 0.99;
        });
    }

    drawConnections() {
        for (let i = 0; i < this.neurons.length; i++) {
            for (let j = i + 1; j < this.neurons.length; j++) {
                const n1 = this.neurons[i];
                const n2 = this.neurons[j];

                const dx = n2.x - n1.x;
                const dy = n2.y - n1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.maxDistance) {
                    const opacity = (1 - distance / this.config.maxDistance) * this.config.connectionOpacity;

                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(n1.x, n1.y);
                    this.ctx.lineTo(n2.x, n2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawNeurons() {
        this.neurons.forEach(neuron => {
            // Glow effect
            const gradient = this.ctx.createRadialGradient(
                neuron.x, neuron.y, 0,
                neuron.x, neuron.y, this.config.glowSize
            );
            gradient.addColorStop(0, 'rgba(0, 217, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(0, 217, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 217, 255, 0)');

            this.ctx.beginPath();
            this.ctx.fillStyle = gradient;
            this.ctx.arc(neuron.x, neuron.y, this.config.glowSize, 0, Math.PI * 2);
            this.ctx.fill();

            // Core
            this.ctx.beginPath();
            this.ctx.fillStyle = '#00D9FF';
            this.ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        if (!this.isActive) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw
        this.updateNeurons();
        this.drawConnections();
        this.drawNeurons();

        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize neurons effect
document.addEventListener('DOMContentLoaded', () => {
    const neuronsCanvas = document.getElementById('neurons-canvas');
    if (neuronsCanvas) {
        new NeuronSystem(neuronsCanvas);
        console.log('✅ Neurons effect initialized');
    }
});
