import { DAO } from "./mysql/DAO";
import { IConstants } from "../Models/IConstants";
import * as q from 'q';
import { IJailDTO } from "./DataObjects/IJailDTO";

export class JailDAO extends DAO{ 

    constructor(
        private constants: IConstants
    ){
        super();
    }

    public jail(playerid: string, time: number): q.Promise<boolean>{
        let defer = q.defer<boolean>();
        let now = new Date();
        let sql = `INSERT INTO themafiagame.jail `
                    + `(playerid, jailtime, jailtimestamp) `
                    + `VALUES `
                    + `(?, ?, ?)`

        this.execute(sql, playerid, time, now)
        .then(
        result =>{defer.resolve(true)
        })
        .catch(
        err => {defer.reject(err)
        })
        return defer.promise;
    }

    public jailInfo(playerid: string): q.Promise<IJailDTO>{
        let defer = q.defer<IJailDTO>();
        let sql = `SELECT *,  (jailtime - TIME_TO_SEC(TIMEDIFF(NOW(), jailtimestamp))) AS timeleft`
                    + ` FROM themafiagame.jail `
                    + ` WHERE playerid = ?`
        this.execute(sql, playerid)
        .then(result =>{
            let jailResult: IJailDTO = {} as IJailDTO;
            if(result && result.length > 0){
                jailResult = result[0] as IJailDTO;
                jailResult.isjailed = true;
            } else{
                jailResult.isjailed = false;
            }
            defer.resolve(jailResult);
        })
        .catch(err=>{
            defer.reject(err);
        })

        return defer.promise;
    }
}