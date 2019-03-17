import { DAO } from "./mysql/DAO";
import * as q from 'q';
import { IConstants } from "../Models/IConstants";
import { Crimes } from "../Enums/Crimes";

export class CrimeDAO extends DAO{ 

    constructor(
        private constants: IConstants
    ){
        super();
    }

    public fetchCrimePercentage(crime: Crimes, playerid: string): q.IPromise<number>{
        let defer = q.defer<number>();
        let crimeString;
        if(crime == Crimes.Pickpocket) crimeString = 'pickpocket';
        else if(crime == Crimes.Mug) crimeString = 'mug';
        else if(crime == Crimes.Store) crimeString = 'store';
        else if(crime == Crimes.Bank) crimeString = 'bank';

        let sql = `SELECT ? '
                   + 'FROM crimes '
                   + 'WHERE playerid = ?`

        this.execute(sql, crimeString, playerid)
        .then(
            result =>{defer.resolve(result[0] as number)}
        )
        .catch(
            err => {defer.reject(err);}
        )
        return defer.promise;
    }

}