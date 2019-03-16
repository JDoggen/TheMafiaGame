import { Bot } from "../Application/Bot";
import * as Discord from 'discord.js';
import { GuildController } from "../Controllers/GuildController";

export class Delegator{
    
    constructor(
        private bot: Bot,
        private guildController : GuildController
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
        let guildid = message.guild.id;
        let content = message.content;
        let author = message.author;
        this.guildController.fetchGuildData(guildid)
        .then(guildData =>{
            let prefix = guildData.prefix;
            if(prefix){
                let messagePrefix = content.substr(0, prefix.length);

                if(messagePrefix === prefix){
                    content = content.substr(prefix.length); //Trim off prefix
                    content = content.trim();
                    content = content.replace(/\s\s+/g, ' '); //Replace all whitespace with 1 space
                    let argumentList = content.split(' ');
                    let command;
                    if(!argumentList) return;
                    if(argumentList [0]){
                        command = argumentList[0];
                    }
                    if(!command) return;
                    if(command.trim() === 'prefix' && argumentList[1]) {this.guildController.setPrefix(channel, guildid, argumentList[1])}
                }
            }
        })
        .catch(err =>{
            console.log(err);
        })
    }

    private incomingBotMessage(message: Discord.Message){

    }
}