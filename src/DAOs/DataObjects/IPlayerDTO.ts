import { Crimes } from "../../Enums/Crimes";
import { Ranks } from "../../Enums/Ranks";

export interface IPlayerDTO{
    playerid: string,
    money: number,
    attack: number,
    defense: number,
    experience: number,
    rank: string,
    rankEnum: Ranks
}