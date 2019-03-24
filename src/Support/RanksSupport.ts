import { Ranks } from "../Enums/Ranks";

export class RanksSupport{

    private static _instance : RanksSupport = new RanksSupport();
    private constructor(){}

    static instance(): RanksSupport{
        return this._instance;
    }

    public getRank(rank: string): Ranks{
        rank = rank.toLowerCase();
        if(rank === 'thug') return Ranks.Thug;
        if(rank === 'shoplifter') return Ranks.Shoplifter;
        if(rank === 'gangster') return Ranks.Gangster;
        if(rank === 'mobster') return Ranks.Mobster;
        if(rank === 'hitman') return Ranks.Hitman;
        if(rank === 'assassin') return Ranks.Assassin;
        if(rank === 'boss') return Ranks.Boss;
        if(rank === 'godfather') return Ranks.Godfather;
        if(rank === 'don') return Ranks.Don;
        throw `Invalid rank defined for ${rank}`
    }
}