import { PlayerDAO } from "../DAOs/PlayerDAO";

export class PlayerService{

    constructor(
        private playerDAO : PlayerDAO
    ){}

    public register(playerid: string){
        this.playerDAO.playerExists(playerid)
        .then(result => {console.log("PLAYER EXISTS: " + result)})
    }
}