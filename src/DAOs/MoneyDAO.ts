import { DAO } from "./DAO";
import * as q from 'q';
import { IConstants } from "../Models/IConstants";

export class MoneyDAO extends DAO{ 

    constructor(
        private constants: IConstants
    ){
        super();
    }

    public payOut(playerID: string, money: number) : q.Promise<boolean>{
        let defer = q.defer<boolean>();
        let sql = `UPDATE themafiagame.players `
                    + `SET money = money + ? `
                    + `WHERE playerid = ? `

        this.execute(sql, money.toString(), playerID)
        .then(
        result =>{defer.resolve(true)
        })
        .catch(
        err => {defer.reject(err)
        })

        return defer.promise;
    }
}