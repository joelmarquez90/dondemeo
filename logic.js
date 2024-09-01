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
                this.message = 'Querés pispear?';
            } else {
                let optimalChoice = true;
                for (let i = 0; i < this.urinals.length; i++) {
                    if (this.urinals[i] === 'free' && 
                        (i === 0 || this.urinals[i-1] !== 'occupied') && 
                        (i === this.urinals.length - 1 || this.urinals[i+1] !== 'occupied')) {
                        if (i !== index) {
                            optimalChoice = false;
                            break;
                        }
                    }
                }
                if (optimalChoice) {
                    this.message = 'Elegiste el mejor lugar';
                } else {
                    this.message = 'Porías haber elegido mejor..';
                }
            }

            this.gameEnded = true;
        }
    }
}