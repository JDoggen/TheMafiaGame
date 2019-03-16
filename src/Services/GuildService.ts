import * as q from 'q';
import { GuildDAO } from "../DAOs/GuildDAO";
import { IGuildDTO } from '../DAOs/DataObjects/GuildDTO';

export class GuildService{

    constructor(
        private guildDAO : GuildDAO
    ){}

    public fetchGuildData(guildid: string) : q.Promise<IGuildDTO>{
        let defer = q.defer<IGuildDTO>()
        this.guildDAO.guildExists(guildid)
        .then(guildExists =>{
            if(guildExists){
                this.guildDAO.fetchGuildData(guildid)
                .then(guildData=>{
                    defer.resolve(guildData);
                })
                .catch(err => {
                    defer.reject(err);
                })
            }else{
                this.guildDAO.createGuildData(guildid)
                .then(result =>{
                    this.guildDAO.fetchGuildData(guildid)
                    .then(guildData=>{
                        defer.resolve(guildData);
                    })
                    .catch(err =>{
                        defer.reject(err);
                    })
                })
                .catch(err =>{
                    defer.reject(err);
                })
            }
        })
        .catch(err =>{
            defer.reject(false);
        })
        return defer.promise;
    }

    public setPrefix(guildid: string, prefix: string): q.Promise<string>{
        let defer = q.defer<string>();
        if(!prefix) defer.reject('No prefix found');
        else if(!prefix.trim()) defer.reject('No valid prefix');
        prefix = prefix.trim();
        if(prefix.length > 10){
            defer.reject('Prefix cannot exceed 10 characters');
        } else if(!new RegExp('[\x20-\x7E]').test(prefix)){
            defer.reject('Invalid symbols found');
        } else{
            this.guildDAO.updatePrefix(guildid, prefix)
            .then(result=>{
                if(result){
                    defer.resolve(prefix);
                }
            })
            .catch(err =>{
                defer.reject('Unknown error occured while setting your prefix');
            })
        }

        return defer.promise;
    }
}