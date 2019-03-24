import { Bot } from "../Application/Bot";
import * as Discord from 'discord.js';
import { GuildController } from "../Controllers/GuildController";
import { CrimeController } from "../Controllers/CrimeControllers";
import * as q from 'q';
import { ErrorHandler } from "../Support/ErrorHandler";
import { PlayerController } from "../Controllers/PlayerController";

export class Delegator{

    private readonly ACCESSCOMMANDS = ['commit'];
    
    constructor(
        private bot: Bot,
        private guildController: GuildController,
        private crimeController: CrimeController,
        private playerController: PlayerController
    ){

        
    }

    public incomingMessage(message : Discord.Message){
        if(message.author.bot){
            this.incomingBotMessage(message);
        }
        let type = message.channel.type;
        if(type === 'dm'){
            this.incomingPrivateMessage(message);
        }
        else if(type === 'text'){
            this.incomingTextMessage(message)
        }
    }

    private incomingPrivateMessage(message: Discord.Message){

    }

    private incomingTextMessage(message: Discord.Message): void{
        //Check message for prefix
        let channel = message.channel;
        let channelid = channel.id;
        let guildid = message.guild.id;
        let content = message.content;
        let author = message.author;
        let playerid = author.id;


        this.guildController.fetchGuildData(guildid)
        .then(guildData =>{
            let prefix = guildData.prefix;
            if(prefix){
                let messagePrefix = content.substr(0, prefix.length);

                if(messagePrefix === prefix){
                    content = content.substr(prefix.length); //Trim off prefix
                    content = content.trim();
                    content = content.replace(/\s\s+/g, ' '); //Replace all whitespace with 1 space
                    content = content.toLowerCase();
                    let argumentList = content.split(' ');
                    let command: string;
                    if(!argumentList) return;
                    for(let argument of argumentList){
                        argument = argument.trim();
                    }

                    if(argumentList [0]){
                        command = argumentList[0];
                    }
                    if(!command) return;
                    this.access(command, playerid, channelid)
                    .then(
                        access =>{
                            command = this.getVariation(command);
                            if(command === 'prefix' && argumentList[1]) {this.guildController.setPrefix(channel, guildid, argumentList[1])}
                            else if(command === 'start'){this.playerController.start(channelid, playerid)}
                            else if(command === 'commit' && argumentList[1] && access) {this.crimeController.commit(channelid, playerid, argumentList[1])}
                            else if(command === `crimes` && access){this.crimeController.crimes(channelid, playerid)}
                    })
                }
            }
        })
        .catch(err =>{
        })
    }

    private incomingBotMessage(message: Discord.Message){

    }

    private access(command: string, playerid: string, channelid: string): q.Promise<boolean>{
        let defer = q.defer<boolean>();
        if(this.ACCESSCOMMANDS.indexOf(command) === -1) defer.resolve(true);    //No access command. No account necessary
        else{
            this.playerController.playerExists(playerid)
            .then(result =>{
                defer.resolve(result);
            })
            .catch(err =>{
                ErrorHandler.instance().handle(err, channelid);
            })
        }
        return defer.promise;
    }

    private getVariation(command: string): string{
        switch(command){

            case 'prefix':{ command = 'prefix'; break;}
            case 'start': { command = 'start'; break; }
            case 'comit': {}
            case 'commit': { command = 'commit'; break; }
            case 'crime' : {}
            case 'crimes': { command = 'crimes'; break;}
        }
        return command;
    }
}