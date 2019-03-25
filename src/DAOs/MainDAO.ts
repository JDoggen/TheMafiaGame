import { DAO } from "./DAO";
import * as q from 'q';
import { IConstants } from "../Models/IConstants";
import { Logger } from "../Support/Logger";

export class MainDAO extends DAO{ 

    constructor(
        private constants: IConstants
    ){
        super();
        this.turnOnScheduler();
    }

    private turnOnScheduler(){
        let sql = `SET GLOBAL event_scheduler := 1`;
        this.execute(sql)
        .then(result =>{
            Logger.instance().ok('Turned on event scheduler');
        })
        .catch(err=>{
            Logger.instance().error('Error while turning on event scheduler.');
            Logger.instance().error(err);
            throw err;
        })

    }
}