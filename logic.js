function game() {
    return {
        urinals: [],
        message: '',
        gameStarted: false,
        gameEnded: false,
        tooltipIndex: null,

        init() {
            this.startGame();
        },

        startGame() {
            const numUrinals = Math.floor(Math.random() * 6) + 5; // Entre 5 y 10 mingitorios
            this.urinals = Array(numUrinals).fill('free');
            
            // Ocupar algunos mingitorios aleatoriamente
            for (let i = 0; i < this.urinals.length; i++) {
                if (Math.random() < 0.3) { // 30% de probabilidad de que esté ocupado
                    this.urinals[i] = 'occupied';
                }
            }
            
            this.message = 'Elegí un mingitorio libre, mejor lejos de otros!';
            this.gameStarted = true;
            this.gameEnded = false;
            this.tooltipIndex = null;
        },

        selectUrinal(index) {
            if (this.gameEnded || this.urinals[index] !== 'free') return;

            this.urinals[index] = 'selected';
            
            if (this.hasAdjacentOccupied(index)) {
                this.message = '¡Uy! Has elegido un mingitorio junto a alguien. Qué incómodo...';
            } else {
                let optimalChoice = this.isOptimalChoice(index);
                if (optimalChoice) {
                    this.message = '¡Excelente elección! Has maximizado la distancia con otros.';
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
            if (this.urinals[index] === 'free' && !this.gameEnded && this.isOptimalChoice(index)) {
                this.tooltipIndex = index;
            }
        },

        hideTooltip() {
            this.tooltipIndex = null;
        }
    }
}