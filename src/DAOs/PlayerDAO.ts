import { DAO } from "./mysql/DAO";
import * as q from 'q';
import { IConstants } from "../Models/IConstants";
import { resolve } from "path";

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

}