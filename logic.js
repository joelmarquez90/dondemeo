function game() {
    return {
        urinals: [],
        message: '',
        gameStarted: false,
        gameEnded: false,

        startGame() {
            const numUrinals = Math.floor(Math.random() * 6) + 5; // Between 5 and 10 urinals
            this.urinals = Array(numUrinals).fill(false);
            
            // Occupy some urinals randomly
            for (let i = 0; i < this.urinals.length; i++) {
                if (Math.random() < 0.3) { // 30% chance of being occupied
                    this.urinals[i] = true;
                }
            }
            
            this.message = '';
            this.gameStarted = true;
            this.gameEnded = false;
        },

        selectUrinal(index) {
            if (this.gameEnded) return;

            if (this.urinals[index]) {
                this.message = 'That urinal is occupied! Choose another.';
                return;
            }
            
            let adjacentOccupied = false;
            if (index > 0 && this.urinals[index - 1]) adjacentOccupied = true;
            if (index < this.urinals.length - 1 && this.urinals[index + 1]) adjacentOccupied = true;
            
            if (adjacentOccupied) {
                this.message = 'You chose a urinal next to someone. How awkward!';
            } else {
                this.message = 'Good choice! Free urinal with no one next to you.';
            }

            this.urinals[index] = true;
            this.gameEnded = true;
        }
    }
}