import { Bot } from "../Application/Bot";
import { Logger } from "./Logger";

export class ErrorHandler{

    private static _instance : ErrorHandler = new ErrorHandler();
    private bot: Bot;
    
    private constructor(){}

    static instance(): ErrorHandler{
        return this._instance;
    }

    public setBot(bot: Bot): void{
        this.bot = bot;
    }

    public handle(err: string, channelid: string){
        Logger.instance().error(err);
        this.bot.sendMessage(channelid, 'Something went wrong trying to run the command!');
    }


}

