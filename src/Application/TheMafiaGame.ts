import { IConfig } from '../Models/IConfig';
import { Bot } from './Bot';
import {Delegator} from '../Delegator/Delegator';
import { PlayerDAO } from '../DAOs/PlayerDAO';
import { GuildDAO } from '../DAOs/GuildDAO';
import { GuildController } from '../Controllers/GuildController';
import { GuildService } from '../Services/GuildService';
import { PlayerService } from '../Services/PlayerService';
import { IConstants } from '../Models/IConstants';
const config = require('../../Config/config.json');
const constants = require('../../Config/constants.json');

export class TheMafiaGame{

    private config: IConfig;
    private constants: IConstants;
    private bot : Bot;

    private delegator : Delegator;

    private guildController : GuildController;

    private playerService : PlayerService;
    private guildService: GuildService;

    private playerDAO : PlayerDAO;
    private guildDAO: GuildDAO;

    constructor(){
        this.readConfig();
        this.readConstants();
        this.bot = new Bot(this.config.token);
        this.createDAOs();
        this.createServices();
        this.createControllers();
        this.createDelegator();
    }

    private readConfig() : IConfig{
        return this.config = config as IConfig;
    }

    private readConstants() : IConstants{
        return this.constants = constants as IConstants;
    }

    
    private createDAOs() : void{
        this.playerDAO = new PlayerDAO(this.constants);
        this.guildDAO = new GuildDAO(this.constants);
    }

    private createServices() : void{
        this.playerService = new PlayerService(this.playerDAO);
        this.guildService = new GuildService(this.guildDAO);
    }

    private createControllers() : void{
        this.guildController = new GuildController(this.bot, this.guildService);
    }

    private createDelegator() : void{
        this.delegator = new Delegator(this.bot, this.guildController);
        this.bot.setDelegator(this.delegator);
    }
}