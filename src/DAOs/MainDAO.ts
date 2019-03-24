import { DAO } from "./mysql/DAO";
import * as q from 'q';
import { IConstants } from "../Models/IConstants";

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
            console.log('Turned on event scheduler');
        })
        .catch(err=>{
            console.log('Error while turning on event scheduler.');
            console.log(err);
            throw err;
        })

    }
}