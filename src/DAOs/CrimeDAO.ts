import { DAO } from "./mysql/DAO";
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

}