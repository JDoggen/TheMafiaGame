import * as q from 'q';
import { Crimes } from '../Enums/Crimes';
import { CrimeDAO } from '../DAOs/CrimeDAO';
import { ICrimeConfig } from '../Models/ICrimeConfig';
import { MoneyDAO } from '../DAOs/MoneyDAO';
import { ICrimeResult } from '../Models/ICrimeResult';
import { ICrime } from '../Models/ICrime';
import { JailDAO } from '../DAOs/JailDAO';
import { ICrimeDTO } from '../DAOs/DataObjects/ICrimeDTO';
import { Ranks } from '../Enums/Ranks';
import { RanksSupport } from '../Support/RanksSupport';
import { PlayerDAO } from '../DAOs/PlayerDAO';
const crimeConfig = require('../../Config/crimes.json')

export class CrimeService{

    private crimeConfig: ICrimeConfig;

    constructor(
        private playerDAO: PlayerDAO,
        private crimeDAO: CrimeDAO,
        private moneyDAO: MoneyDAO,
        private jailDAO: JailDAO
    ){
        this.readCrimeConfig();
    }

    public commit(crime: Crimes, playerid: string): q.Promise<ICrimeResult>{
        let defer = q.defer<ICrimeResult>();
        this.playerDAO.fetchPlayerInfo(playerid)
        .then(playerinfo =>{
            console.log('playerinfo');
            console.log(playerinfo);
            let crimeInfo = this.getCrime(crime);
            if(playerinfo.rankEnum >= crimeInfo.rankEnum){
                this.crimeDAO.fetchCrimePercentage(crime, playerid)
                .then(chance =>{
                    let ran = Math.floor((Math.random() * 100) + 1);
                    if(ran <= chance){
                        this.payOut(playerid, crime)
                        .then(result =>{
                            result.rankHighEnough = true;
                            defer.resolve(result);
                        })
                        .catch(err =>{
                            defer.reject(err);
                        })
                    }
                    else{
                        this.jail(playerid, crime)
                        .then(result =>{
                            result.rankHighEnough = true;
                            defer.resolve(result);
                        })
                        .catch(err =>{
                            defer.reject(err);
                        })
                    }
                })
                .catch(err =>{
                    defer.reject(err);
                })
            } else{
                let crimeResult = {} as ICrimeResult;
                crimeResult.rankHighEnough = false;
                crimeResult.jail = false;
                crimeResult.result = false;
                defer.resolve(crimeResult);
            }
        })
        .catch(err =>{
            defer.reject(err);
        })
        return defer.promise;
    }

    public getCrimePercentages(playerid: string): q.Promise<ICrimeDTO>{
        return this.crimeDAO.fetchCrimePercentages(playerid);
    }

    private payOut(playerid: string, crime: Crimes): q.Promise<ICrimeResult>{
        let defer = q.defer<ICrimeResult>();
        let crimeObject =  this.getCrime(crime);
        let payout = 0
        let minPayout = crimeObject.minPayout;
        let maxPayout = crimeObject.maxPayout;
        payout = Math.floor(Math.random() * (maxPayout - minPayout) + minPayout);
        this.moneyDAO.payOut(playerid, payout)
        .then(result=>{
            let crimeResult = {} as ICrimeResult;
            crimeResult.result = true;
            crimeResult.payout = payout;
            crimeResult.jail = false;
            crimeResult.jailtime = 0;
            defer.resolve(crimeResult);
        })
        .catch(err=>{
            defer.reject(err);
        })
        return defer.promise;
    }

    private jail(playerid: string, crime: Crimes): q.Promise<ICrimeResult>{
        let defer = q.defer<ICrimeResult>();
        let crimeObject = this.getCrime(crime);
        let jailChance = crimeObject.jailChance;
        let jailMinTime = crimeObject.minJailtime
        let jailMaxTime = crimeObject.maxJailtime;

        let crimeResult = {} as ICrimeResult;
        let jailResult = Math.floor((Math.random() * 100) + 1);

        crimeResult.jail = jailResult <= jailChance;
        crimeResult.jailtime = Math.floor(Math.random() * (jailMaxTime - jailMinTime)) + jailMinTime;
        crimeResult.payout = 0;
        crimeResult.result = false;
        this.jailDAO.jail(playerid, crimeResult.jailtime)
        .then(result =>{
            defer.resolve(crimeResult);
        })
        .catch(err=>{
            defer.reject(err);
        })
        return defer.promise;
    }


    private getCrime(crime: Crimes): ICrime{
        if(crime === Crimes.Pickpocket) return this.crimeConfig.pickpocket;
        if(crime === Crimes.Mug) return this.crimeConfig.mug;
        if(crime === Crimes.Store) return this.crimeConfig.store;
        if(crime === Crimes.Bank) return this.crimeConfig.bank;
    }

    private readCrimeConfig() : ICrimeConfig{
        let config = crimeConfig as ICrimeConfig;
        this.setEnums(config);
        return this.crimeConfig = config;
    }

    private setEnums(config: ICrimeConfig): ICrimeConfig{
        config.pickpocket.rankEnum = RanksSupport.instance().getRank(config.pickpocket.rank);
        config.mug.rankEnum = RanksSupport.instance().getRank(config.mug.rank);
        config.store.rankEnum = RanksSupport.instance().getRank(config.store.rank);
        config.bank.rankEnum = RanksSupport.instance().getRank(config.bank.rank);
        return config;
    }
}