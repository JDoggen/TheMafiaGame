import { GuildService } from "../Services/GuildService";
import * as q from 'q';
import { IGuildDTO } from "../DAOs/DataObjects/GuildDTO";
import * as Discord from 'discord.js'
import { Bot } from "../Application/Bot";

export class GuildController{
    constructor(
        private bot: Bot,
        private guildService: GuildService
    ){
    }

    public fetchGuildData(guildid: string) : q.Promise<IGuildDTO> {
        return this.guildService.fetchGuildData(guildid);
    }

    public setPrefix(channel: Discord.Channel, guildid: string, prefix: string) : void{
        this.guildService.setPrefix(guildid, prefix)
        .then(prefix =>{
            this.bot.sendMessage(channel.id, `Succesfully set your prefix to ${prefix}`);
        })
        .catch(err =>{
            this.bot.sendMessage(channel.id, err);
        })
    }
}