import * as mysql from 'mysql';
import { IMySQLConfig } from '../Models/IMySQLconfig';
import * as q from 'q';

const mysqlConfig = require('../../../Config/mysql.json');

export class DAO{

    protected config : IMySQLConfig
    private connection : mysql.Connection;

    constructor(){
        this.config = mysqlConfig as IMySQLConfig;
        this.connection = this.createConnection();
        this.connection.connect(this.connected);
    }

    private createConnection() : mysql.Connection{
        return mysql.createConnection({
            host: this.config.host,
            user: this.config.user,
            password: this.config.password,
            port: this.config.port
        })
    }

    private connected(err: mysql.MysqlError){
        if(err){throw err}
    }

    public execute<T>(query: string, ...parameters: any[]) : q.Promise<T[]>{
        let defer = q.defer<T[]>();
        let queryOptions : mysql.QueryOptions = {
            sql : query,
            values: parameters            
        }
        this.connection.query(queryOptions, function(err, result){
            if(err){defer.reject(err)}
            else{defer.resolve(result as T[])}
        });

        return defer.promise;
    }




    
    
}