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
        },

        startGame() {
            const numUrinals = this.isMobile ? 6 : Math.floor(Math.random() * 6) + 7;
            this.urinals = Array(numUrinals).fill('free');
            
            for (let i = 0; i < this.urinals.length; i++) {
                if (Math.random() < 0.3) {
                    this.urinals[i] = 'occupied';
                }
            }
            
            this.message = '';
            this.gameStarted = true;
            this.gameEnded = false;
            this.tooltipIndex = null;
        },

        resetGame() {
            this.score = 0;
            this.startGame();
        },

        selectUrinal(index) {
            if (this.gameEnded || this.urinals[index] !== 'free') return;

            this.urinals[index] = 'selected';
            
            if (this.isOptimalChoice(index)) {
                this.message = 'Grande pibe 🥳';
                this.playConfettiAnimation();
                this.score += 2;
            } else if (!this.hasAdjacentOccupied(index)) {
                this.message = 'Buena 🙌';
                this.score += 1;
            } else if (!this.isWorstChoice(index)) {
                this.message = 'Querés pispear 👀?';
            } else {
                this.message = 'Perdiste 😔';
                this.gameEnded = true;
            }

            if (!this.gameEnded) {
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

        isWorstChoice(index) {
            if ((this.urinals[0] === 'free' && this.urinals[1] === 'free' && index !== 0 && index !== 1) ||
                (this.urinals[this.urinals.length - 1] === 'free' && this.urinals[this.urinals.length - 2] === 'free' && 
                    index !== this.urinals.length - 1 && index !== this.urinals.length - 2)) {
                return true;
            }

            if (index === 0 || index === this.urinals.length - 1) {
                return false;
            }

            if (this.urinals[0] === 'occupied' && this.urinals[this.urinals.length - 1] === 'occupied') {
                return false;
            }

            return true;
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

        shareScore() {
            const tweetText = encodeURIComponent(`¡He conseguido ${this.score} puntos en el juego "Dónde Meo"! ¿Puedes superarme? Juega ahora en `);
            const tweetUrl = encodeURIComponent('https://joelmarquez90.github.io/dondemeo/');
            window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, '_blank');
        },
    }
}