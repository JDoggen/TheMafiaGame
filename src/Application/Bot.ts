import * as Discord from 'discord.js';
import { Delegator } from '../Delegator/Delegator';

export class Bot{
    private client : Discord.Client;
    private delegator : Delegator;

    constructor(token: string){
        this.client = new Discord.Client();
        this.client.login(token);
    }

    public setDelegator(delegator: Delegator){
        this.delegator = delegator;
        this.client.on('message', (message)=>{
            delegator.incomingMessage(message)
        } );
    }

    public sendMessage(channelid: string, message: string) : void{
        if(!channelid || !message) return;
        let channel: Discord.Channel = this.client.channels.get(channelid);
        if(channel && channel.type == 'text'){
            let textChannel: Discord.TextChannel = channel as Discord.TextChannel;
            textChannel.send(message);
        }
    }

    public sendEmbed(channelid: string, title: string, description: string, footer: string): void{
        if(!channelid) return;
        let channel: Discord.Channel = this.client.channels.get(channelid);
        if(channel && channel.type == 'text'){
            let textChannel: Discord.TextChannel = channel as Discord.TextChannel;
            let embed: Discord.RichEmbed = new Discord.RichEmbed();
            embed
            .setTitle(title)
            .setDescription(description)
            .setFooter(footer);
            textChannel.send(embed);   
        }
    }
}
