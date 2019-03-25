import { DAO } from "./DAO";
import * as q from 'q';
import { IConstants } from "../Models/IConstants";
import { resolve } from "path";
import { IPlayerDTO } from "./DataObjects/IPlayerDTO";
import { RanksSupport } from "../Support/RanksSupport";

export class PlayerDAO extends DAO{ 

    constructor(
        private constants: IConstants
    ){
        super();
    }

    public playerExists(playerID: string) : q.Promise<boolean>{
        let defer = q.defer<boolean>();
        let sql = `SELECT * `
                    +`FROM themafiagame.players `
                    +`WHERE playerid = ?`

        this.execute(sql, playerID)
        .then(
            result =>{
                if(result && result.length > 0) defer.resolve(true);
                else defer.resolve(false);
            })
        .catch(
            err => {
                defer.resolve(false);
            })
        return defer.promise;
    }

    public register(playerID: string) : q.Promise<boolean>{
        let defer = q.defer<boolean>();
        let sql = `INSERT INTO themafiagame.players `
                    + `(playerid) `
                    + `VALUES `
                    + `(?)`
        this.execute(sql, playerID)
        .then(
            result => {
                defer.resolve(true);
        })
        .catch(err =>{
                defer.reject(err)
        })
        return defer.promise;
    }   

    public fetchPlayerInfo(playerID: string): q.Promise<IPlayerDTO>{
        let defer = q.defer<IPlayerDTO>();
        let sql = `SELECT * FROM themafiagame.players `
                    + `WHERE playerid = ? `;
        this.execute(sql, playerID)
        .then(result =>{
            if(result && result[0]){
                let playerinfo = result[0] as IPlayerDTO;
                playerinfo.rankEnum = RanksSupport.instance().getRank(playerinfo.rank);
                defer.resolve(result[0] as IPlayerDTO);
            } else{
                defer.reject(`Could not find player info for player [${playerID}]`);
            }
        })
        .catch(err =>{
            defer.reject(err);
        });
        return defer.promise;
    }

    public grantExperience(playerID: string, experience: number): q.Promise<boolean>{
        let defer = q.defer<boolean>();
        let sql = `UPDATE themafiagame.players `
                    + `SET experience = experience + ? `
                    + `WHERE playerid = ?`;
        this.execute(sql, experience, playerID)
        .then(result =>{
            defer.resolve(true);
        })
        .catch(err =>{
            defer.reject(err);
        })
        return defer.promise;
    }

}