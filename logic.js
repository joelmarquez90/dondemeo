function game() {
    return {
        urinals: [],
        message: '',
        gameStarted: false,
        gameEnded: false,
        tooltipIndex: null,
        showTooltips: false,
        isMobile: window.innerWidth < 640, // Assuming 640px as the breakpoint for mobile

        init() {
            this.startGame();
            window.addEventListener('resize', () => {
                this.isMobile = window.innerWidth < 640;
                if (this.gameStarted) this.resizeUrinals();
            });
        },

        startGame() {
            const numUrinals = this.isMobile ? 7 : Math.floor(Math.random() * 6) + 5;
            this.urinals = Array(numUrinals).fill('free');
            
            // Occupy some urinals randomly
            for (let i = 0; i < this.urinals.length; i++) {
                if (Math.random() < 0.25) { // 25% chance of being occupied
                    this.urinals[i] = 'occupied';
                }
            }
            
            this.message = 'Elegí dónde mear';
            this.gameStarted = true;
            this.gameEnded = false;
            this.tooltipIndex = null;

            if (this.isMobile) this.resizeUrinals();
        },

        resizeUrinals() {
            const bathroom = document.getElementById('bathroom');
            const availableWidth = bathroom.offsetWidth - 16; // Subtracting 16px for margins
            const urinalWidth = Math.floor(availableWidth / 8);
            const urinals = bathroom.getElementsByClassName('urinal');
            for (let urinal of urinals) {
                urinal.style.width = `${urinalWidth}px`;
                urinal.style.height = `${urinalWidth * 2}px`; // Maintaining 1:2 aspect ratio
            }
        },

        selectUrinal(index) {
            if (this.gameEnded || this.urinals[index] !== 'free') return;

            this.urinals[index] = 'selected';
            
            if (this.hasAdjacentOccupied(index)) {
                this.message = '¡Uy! Has elegido un mingitorio junto a alguien. Qué incómodo...';
                this.playSadAnimation();
            } else {
                let optimalChoice = this.isOptimalChoice(index);
                if (optimalChoice) {
                    this.message = '¡Excelente elección! Has maximizado la distancia con otros.';
                    this.playConfettiAnimation();
                } else {
                    this.message = 'Buena elección, pero había una opción con más privacidad.';
                }
            }

            this.gameEnded = true;
        },

        hasAdjacentOccupied(index) {
            return (index > 0 && this.urinals[index - 1] === 'occupied') ||
                   (index < this.urinals.length - 1 && this.urinals[index + 1] === 'occupied');
        },

        isOptimalChoice(index) {
            if (this.hasAdjacentOccupied(index)) return false;

            const occupiedCount = this.urinals.filter(u => u === 'occupied').length;

            // Si no hay mingitorios ocupados, los de las puntas son óptimos
            if (occupiedCount === 0) {
                return index === 0 || index === this.urinals.length - 1;
            }

            // Caso especial para los mingitorios en las esquinas
            if (index === 0 && this.urinals[1] === 'free') return true;
            if (index === this.urinals.length - 1 && this.urinals[this.urinals.length - 2] === 'free') return true;

            let maxDistance = this.getDistanceToOccupied(index);
            for (let i = 0; i < this.urinals.length; i++) {
                if (this.urinals[i] === 'free' && i !== index && !this.hasAdjacentOccupied(i)) {
                    let distance = this.getDistanceToOccupied(i);
                    if (distance > maxDistance) {
                        return false;
                    }
                }
            }
            return true;
        },

        getDistanceToOccupied(index) {
            let leftDistance = 0;
            let rightDistance = 0;
            
            for (let i = index - 1; i >= 0; i--) {
                if (this.urinals[i] === 'occupied') break;
                leftDistance++;
            }
            
            for (let i = index + 1; i < this.urinals.length; i++) {
                if (this.urinals[i] === 'occupied') break;
                rightDistance++;
            }
            
            return Math.min(leftDistance, rightDistance);
        },

        showOptimalTooltip(index) {
            if (this.showTooltips && this.urinals[index] === 'free' && !this.gameEnded && this.isOptimalChoice(index)) {
                this.tooltipIndex = index;
            }
        },

        hideTooltip() {
            this.tooltipIndex = null;
        },

        toggleTooltips() {
            this.showTooltips = !this.showTooltips;
        },

        playConfettiAnimation() {
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } else {
                console.error('Confetti function not found');
            }
        },

        playSadAnimation() {
            const urinals = document.querySelectorAll('.urinal');
            urinals.forEach(urinal => {
                urinal.classList.add('shake');
                setTimeout(() => {
                    urinal.classList.remove('shake');
                }, 500);
            });
        }
    }
}