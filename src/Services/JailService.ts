import * as q from 'q';
import { JailDAO } from '../DAOs/JailDAO';
import { IJailDTO } from '../DAOs/DataObjects/IJailDTO';

export class JailService{

    constructor(
        private jailDAO : JailDAO
    ){

    }

    public jailInfo(playerid:string): q.Promise<IJailDTO>{
        let defer = q.defer<IJailDTO>();
        this.jailDAO.jailInfo(playerid)
        .then(result =>{
            defer.resolve(result);
        })
        .catch(err=>{
            defer.reject(err);
        })
        return defer.promise;
    }
}