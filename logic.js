function game() {
    return {
        urinals: [],
        message: '',
        gameStarted: false,
        gameEnded: false,

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
        },

        selectUrinal(index) {
            if (this.gameEnded || this.urinals[index] !== 'free') return;

            let adjacentOccupied = false;
            if (index > 0 && this.urinals[index - 1] === 'occupied') adjacentOccupied = true;
            if (index < this.urinals.length - 1 && this.urinals[index + 1] === 'occupied') adjacentOccupied = true;
            
            this.urinals[index] = 'selected';
            
            if (adjacentOccupied) {
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

        isOptimalChoice(index) {
            let maxDistance = this.getDistanceToOccupied(index);
            for (let i = 0; i < this.urinals.length; i++) {
                if (this.urinals[i] === 'free' && i !== index) {
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
        }
    }
}