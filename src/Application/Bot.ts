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
        let channel: Discord.Channel = this.client.channels.get(channelid)
        if(channel && channel.type == 'text'){
            let TextChannel: Discord.TextChannel = channel as Discord.TextChannel;
            TextChannel.send(message);
        }
    }
}
