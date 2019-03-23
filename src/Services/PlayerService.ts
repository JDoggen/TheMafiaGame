import { PlayerDAO } from "../DAOs/PlayerDAO";
import * as q from 'q';
import { ErrorHandler } from "../Support/ErrorHandler";

export class PlayerService{

    constructor(
        private playerDAO : PlayerDAO
    ){}

    public register(playerid: string): q.Promise<boolean>{
        let defer = q.defer<boolean>();
        this.playerDAO.playerExists(playerid)
        .then(exists => {
            if(exists){
                defer.resolve(false);
            }
            else {
                this.playerDAO.register(playerid)
                .then(result =>{
                    defer.resolve(true);
                })
                .catch(err =>{
                    defer.reject(err);
                })
            }
        })
        return defer.promise;
    }

    public playerExists(playerid: string): q.Promise<boolean>{
        return this.playerDAO.playerExists(playerid);
    }
}