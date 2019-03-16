import { DAO } from "./mysql/DAO";
import * as q from 'q';
import { IConstants } from "../Models/IConstants";

export class PlayerDAO extends DAO{ 

    constructor(
        private constants: IConstants
    ){
        super();
    }

    public playerExists(playerID: string) : q.Promise<boolean>{
        let defer = q.defer<boolean>();
        let sql = `SELECT TOP 1 * 
                    FROM players
                    WHERE playerid = ?`

        this.execute(sql, playerID)
        .then(
            result =>{console.log("RESULT IN PLAYEREXISTS"); console.log(result)}
        )
        .catch(
            err => {console.log("ERR IN PLAYEREXISTS"); console.log(err);}
        )
        return defer.promise;
    }

    public register(playerID: string) : q.Promise<any>{
        let defer = q.defer<any>();
        let sql = `INSERT INTO ? 
                    (id)`
        this.execute(sql, playerID)
        .then(
            result => {console.log("RESULT IN REGISTER"); console.log(result);}
        )
        .catch(
            err =>{console.log("ERROR IN REGISTER"); console.log(err);}
        )

        return defer.promise;
    }
    

}