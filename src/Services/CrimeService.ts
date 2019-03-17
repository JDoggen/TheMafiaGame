import * as q from 'q';
import { Crimes } from '../Enums/Crimes';
import { CrimeDAO } from '../DAOs/CrimeDAO';

export class CrimeService{

    constructor(
        private crimeDAO: CrimeDAO
    ){}

    public commit(crime: Crimes, playerid: string): q.IPromise<number>{
        let defer = q.defer<number>();
        this.crimeDAO.fetchCrimePercentage(crime, playerid)
        .then(chance =>{
            let ran = Math.floor((Math.random() * 10) + 1);
            let status: boolean;
            if(ran <= chance){status = true;}
            else{ status = false;}
            let payout = 0;
            if(status){
                switch(crime){
                    case Crimes.Store: {
                        
                    }
                }
            }
        })

        return defer.promise;
    }
}