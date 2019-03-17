import { GuildService } from "../Services/GuildService";
import * as q from 'q';
import { IGuildDTO } from "../DAOs/DataObjects/GuildDTO";
import * as Discord from 'discord.js'
import { Bot } from "../Application/Bot";
import { StatAnalyser } from "../Support/StatAnalyser";
import { TheMafiaGame } from "../Application/TheMafiaGame";
import {Crimes} from "../Enums/Crimes";
import { CrimeService } from "../Services/CrimeService";

export class CrimeController {
    constructor(
        private bot: Bot,
        private crimeService: CrimeService
    ){
    }

    public commit(crime: string){
        if(!crime || !crime.trim()) return;
        crime = crime.trim();
        switch(crime){
            case '1': {}
            case 'Pickpocket':{
                this.crimeService.commit(Crimes.Pickpocket);
                break;
            }
            
        }
    }
}