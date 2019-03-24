import { Bot } from "../Application/Bot";
import {Crimes} from "../Enums/Crimes";
import { CrimeService } from "../Services/CrimeService";
import { ErrorHandler } from "../Support/ErrorHandler";
import { JailService } from "../Services/JailService";

export class CrimeController {
    constructor(
        private bot: Bot,
        private crimeService: CrimeService,
        private jailService: JailService
    ){
    }

    public commit(channelid: string, playerid: string, crime: string){
        if(!crime || !crime.trim()) return;
        crime = crime.trim();
        this.jailService.jailInfo(playerid)
        .then(jailResult =>{
            if(!jailResult.isjailed){
                let crimeEnum = this.getCrimeEnum(crime);
                if(crimeEnum){
                    this.crimeService.commit(crimeEnum, playerid)
                    .then(crimeResult =>{
                        console.log('crime result');
                        console.log(crimeResult);
                        if(crimeResult.result){
                            this.bot.sendMessage(channelid, `You succesfully commited the crime! You gained ${crimeResult.payout}.`);
                        } else if(crimeResult.jail){
                            this.bot.sendMessage(channelid, `You were unsuccesfull! You got caught by the cops, you were jailed for ${crimeResult.jailtime} seconds.`);
                        } else if(!crimeResult.rankHighEnough){
                            this.bot.sendMessage(channelid, `You need to be a higher rank to attempt that crime!`);
                        } else {
                            this.bot.sendMessage(channelid, `You were unsuccesfull! Luckily you didn't get caught!`);
                        }
                    })
                    .catch(err =>{
                        ErrorHandler.instance().handle(err, channelid);
                    })
                } else{
                    this.bot.sendMessage(channelid, `That is not a valid crime!`);
                }
            } else{
                this.bot.sendMessage(channelid, `You're still in jail! You need to another wait ${jailResult.timeleft} seconds.`)
            }
        })
        .catch(err =>{
            ErrorHandler.instance().handle(err, channelid);
        })
    }

    public crimes(channelid: string, playerid: string){
        this.jailService.jailInfo(playerid)
        .then(jailResult =>{
            if(!jailResult.isjailed){
                this.crimeService.getCrimePercentages(playerid)
                .then(crimePercentages =>{
                    this.bot.sendEmbed(channelid, `Crimes`, 
                    `*1*. Pickpocket a pedestrian. ${crimePercentages.pickpocket}%\n`
                    + `*2*. Mug a pedestrian. ${crimePercentages.mug}%\n`
                    + `*3*. Rob a store. ${crimePercentages.store}%\n`
                    + `*4*. Rob a bank. ${crimePercentages.bank}%`
                    , 
                    `Use $commit x to attempt a crime.`)
                })
                .catch(err =>{
                    ErrorHandler.instance().handle(err, channelid);
                })
            }
            else {
                this.bot.sendMessage(channelid, `You're still in jail! You need to another wait ${jailResult.timeleft} seconds.`)
            }
        })
        .catch(err =>{
            ErrorHandler.instance().handle(err, channelid);
        })
    }

    private getCrimeEnum(crime:string): Crimes{
        let crimeEnum;
        switch(crime){
            case '1': {}
            case 'pickpocket':{
                crimeEnum = Crimes.Pickpocket;
                break;
            }
            case '2': {}
            case 'mug': {
                crimeEnum = Crimes.Mug;
                break;
            }
            case '3': {}
            case 'store':{
                crimeEnum = Crimes.Store;
                break;
            }
            case '4': {}
            case 'bank':{
                crimeEnum = Crimes.Bank;
                break;
            }            
        }
        return crimeEnum;
    }
}