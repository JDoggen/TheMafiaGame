import { DAO } from "./DAO";
import * as q from 'q';
import { IConstants } from "../Models/IConstants";
import { Crimes } from "../Enums/Crimes";
import { ICrimeDTO } from "./DataObjects/ICrimeDTO";
import { ICrimeConfig } from "../Models/ICrimeConfig";

export class CrimeDAO extends DAO{ 

    constructor(
        private constants: IConstants
    ){
        super();
    }

    public fetchCrimePercentage(crime: Crimes, playerid: string): q.Promise<number>{
        let defer = q.defer<number>();
        let crimeString;
        if(crime == Crimes.Pickpocket) crimeString = 'pickpocket';
        else if(crime == Crimes.Mug) crimeString = 'mug';
        else if(crime == Crimes.Store) crimeString = 'store';
        else if(crime == Crimes.Bank) crimeString = 'bank';

        let sql = `SELECT ? `
                   + `FROM themafiagame.crimes `
                   + `WHERE playerid = ?`

        this.execute(sql, crimeString, playerid)
        .then(result =>{
            if(result && result[0]){
                defer.resolve(result[0] as number);
            }
            else{
                defer.reject(`Could not find crime percentage for player [${playerid}] for crime[${crime}].`);
            }
        })
        .catch(
            err => {defer.reject(err);}
        )
        return defer.promise;
    }

    public fetchCrimePercentages(playerid: string): q.Promise<ICrimeDTO>{
        let defer = q.defer<ICrimeDTO>();
        let sql = `SELECT * `
                    + `FROM themafiagame.crimes `
                    + `WHERE playerid = ? `;

        this.execute(sql, playerid)
        .then(result =>{
            if(result && result[0]){
                defer.resolve(result[0] as ICrimeDTO);
            } else{
                defer.reject(`Could not find crime percentages for player [${playerid}].`);
            }
        }).catch(err =>{
            defer.reject(err);
        })
        return defer.promise;
    }

    public updateCrimeTimer(playerid: string): q.Promise<boolean>{
        let defer = q.defer<boolean>();
        let sql = `UPDATE themafiagame.crimes `
                    + `SET lastattempt = ? `
                    + `WHERE playerid = ? `;

        this.execute(sql, new Date(), playerid)
        .then(result =>{
            defer.resolve(true);
        })
        .catch(err =>{
            defer.reject(err);
        })
        return defer.promise;
    }

    public fetchCrimeTimer(playerid: string): q.Promise<number>{
        let defer = q.defer<number>();
        let sql = `SELECT TIME_TO_SEC(TIMEDIFF(NOW(), lastattempt)) AS timer `
                    + `FROM themafiagame.crimes `
                    + `WHERE playerid = ? `
        this.execute<any>(sql, playerid)
        .then(result =>{
            if(result && result[0]){
                defer.resolve(result[0].timer as number);
            } else{
                defer.reject(`Could not find crime timer for player[${playerid}]`)
            }
        })
        .catch(err =>{
            defer.reject(err);
        })
        return defer.promise;
    }
}