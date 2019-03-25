import { PlayerService } from "../Services/PlayerService";
import * as q from 'q';
import { Bot } from "../Application/Bot";
import { ErrorHandler } from "../Support/ErrorHandler";

export class PlayerController{

    constructor(
        private bot: Bot,
        private playerService: PlayerService
    ){}

    public playerExists(playerid: string): q.Promise<boolean>{
        return this.playerService.playerExists(playerid);
    }

    public start(channelid: string, playerid: string): void{
        this.playerService.register(playerid)
        .then(result =>{
            if(!result){
                this.bot.sendMessage(channelid, `It seems you're already registered!`);
            } 
            else{
                this.bot.sendMessage(channelid, `Welcome! To help you get started, we sent you some helpful commands!`);
            }
        }) 
        .catch(err  =>{
            ErrorHandler.instance().handle(err, channelid);
        })
    }
}