export class StatAnalyser{
 
    private constructor(){}

    /**
     * 
     * @param exp0
     * Sigmoid midpoint experience
     * 
     * @param k 
     * logistics growth rate
     * 
     * @param exp
     * Current experience
     * 
     * @param L 
     * Maximum value (default is 100)
     * 
     * @param ran
     * Random range (1 - not random, 0.9 - 10% randomness etc.) Default is 1
     */
    static calculateChance(exp0: number,  k: number, exp: number, L?: number, ran?: number) : number{
        if(!exp0 || !k || !exp) return 0;
        if(!L || L > 100) L = 100;
        if(!ran) ran = 1; 
        let minRan = ran;
        let maxRan = (1-ran)  + 1;
        let ranX = Math.floor(Math.random() * (maxRan - minRan)) + minRan;
        let x = ranX * exp;
        return L / (1 + Math.E ^ (-1 * k * ( x - exp0)));
    }

}