import { DAO } from "./mysql/DAO";
import * as q from 'q';
import { IMySQLConfig } from "../Models/IMySQLconfig";
import { IGuildDTO } from "./DataObjects/GuildDTO";
import { IConstants } from "../Models/IConstants";

export class GuildDAO extends DAO{ 

    protected config: IMySQLConfig;

    constructor(
        private constants: IConstants
    ){
        super();
    }

    
    public guildExists(guildid: string) : q.Promise<boolean>{
        let defer = q.defer<boolean>();
        let sql = `SELECT * `
                    +`FROM ${this.config.database}.guilds `
                    +`WHERE guildid = ? `

        this.execute<IGuildDTO>(sql, guildid)
        .then(result =>{
            if(result.length === 0){
                defer.resolve(false);
            } else{
                defer.resolve(true);
            }
        })
        .catch(err => {
            defer.reject(false);
        })
        
        return defer.promise;
    }

    public fetchGuildData(guildid: string) : q.Promise<IGuildDTO>{
        let defer = q.defer<IGuildDTO>();
        let sql = `SELECT * `
                    +` FROM ${this.config.database}.guilds `
                    +`WHERE guildid = ?`
        this.execute<IGuildDTO>(sql, guildid)
        .then(result =>{
            if(result[0]){
                defer.resolve(result[0]);
            }else{
                defer.resolve({} as IGuildDTO)
            }
        })
        .catch(err =>{
        })


        return defer.promise;
    }

    public createGuildData(guildid: string) : q.Promise<boolean>{
        let defer = q.defer<boolean>();
        let sql = `INSERT INTO ${this.config.database}.guilds
                    (guildid, prefix)
                    VALUES (?, ?)`;
        let prefix = this.constants.prefix;
        this.execute(sql, guildid, prefix)
        .then(result =>{
            defer.resolve(true);
        })
        .catch(err => {
            defer.reject(err);
        })
        return defer.promise;
    }

    public updatePrefix(guildid: string, prefix: string) : q.Promise<boolean>{
        let defer = q.defer<boolean>();
        let sql = `UPDATE ${this.config.database}.guilds `
                    +`SET prefix = ?`
                    +`WHERE guildid = ? `;
        this.execute(sql, prefix, guildid )
        .then(result =>{
            defer.resolve(true)
        })
        .catch(err =>{
            defer.reject(err);
        })
        return defer.promise;
    }
}

