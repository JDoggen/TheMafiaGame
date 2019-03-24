import { Ranks } from "../Enums/Ranks";

export interface ICrime{
    name: string;
    minPayout: number;
    maxPayout: number;
    jailChance: number;
    minJailtime: number;
    maxJailtime: number;
    maxRate: number;
    rank: string;
    rankEnum: Ranks
}