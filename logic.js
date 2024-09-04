function game() {
    return {
        urinals: [],
        message: '',
        gameStarted: false,
        gameEnded: false,
        tooltipIndex: null,
        showTooltips: false,
        isMobile: window.innerWidth < 640,
        score: 0,

        init() {
            this.startGame();
            window.addEventListener('resize', () => {
                this.isMobile = window.innerWidth < 640;
                if (this.gameStarted) this.resizeUrinals();
            });
        },

        startGame() {
            const numUrinals = this.isMobile ? 8 : Math.floor(Math.random() * 6) + 5;
            this.urinals = Array(numUrinals).fill('free');
            
            for (let i = 0; i < this.urinals.length; i++) {
                if (Math.random() < 0.3) {
                    this.urinals[i] = 'occupied';
                }
            }
            
            this.message = 'Elegí dónde mear';
            this.gameStarted = true;
            this.gameEnded = false;
            this.tooltipIndex = null;

            if (this.isMobile) this.resizeUrinals();
        },

        selectUrinal(index) {
            if (this.gameEnded || this.urinals[index] !== 'free') return;

            this.urinals[index] = 'selected';
            
            if (this.hasAdjacentOccupied(index)) {
                this.message = 'Querés pispear?';
                this.playSadAnimation();
                this.gameEnded = true;  // Make sure this line is here
            } else {
                let optimalChoice = this.isOptimalChoice(index);
                if (optimalChoice) {
                    this.message = 'Grande pibe!';
                    this.playConfettiAnimation();
                    this.score += 2;
                } else {
                    this.message = 'Buena!';
                    this.score += 1;
                }
                setTimeout(() => this.startGame(), 1000); // Start a new round after a short delay
            }
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
        },

        shareScore() {
            const tweetText = encodeURIComponent(`¡He conseguido ${this.score} puntos en el juego "Dónde Meo"! ¿Puedes superarme? Juega ahora en `);
            const tweetUrl = encodeURIComponent('https://joelmarquez90.github.io/dondemeo/');
            window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, '_blank');
        },

        closePopup() {
            this.gameEnded = false;
            this.startGame();
        }
    }
}