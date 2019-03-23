import { IConfig } from '../Models/IConfig';
import { Bot } from './Bot';
import {Delegator} from '../Delegator/Delegator';
import { PlayerDAO } from '../DAOs/PlayerDAO';
import { GuildDAO } from '../DAOs/GuildDAO';
import { GuildController } from '../Controllers/GuildController';
import { GuildService } from '../Services/GuildService';
import { PlayerService } from '../Services/PlayerService';
import { IConstants } from '../Models/IConstants';
import { CrimeController } from '../Controllers/CrimeControllers';
import { CrimeService } from '../Services/CrimeService';
import { CrimeDAO } from '../DAOs/CrimeDAO';
import { MoneyDAO } from '../DAOs/MoneyDAO';
import { ErrorHandler } from '../Support/ErrorHandler';
import { PlayerController } from '../Controllers/PlayerController';
import { JailDAO } from '../DAOs/JailDAO';
import { JailService } from '../Services/JailService';
const config = require('../../Config/config.json');
const constants = require('../../Config/constants.json');

export class TheMafiaGame{

    private config: IConfig;
    private constants: IConstants;
    private bot : Bot;

    private delegator : Delegator;

    private guildController : GuildController;
    private crimeController : CrimeController;
    private playerController: PlayerController;

    private playerService : PlayerService;
    private guildService: GuildService;
    private crimeService: CrimeService;
    private jailService: JailService;

    private playerDAO : PlayerDAO;
    private guildDAO: GuildDAO;
    private crimeDAO: CrimeDAO;
    private moneyDAO: MoneyDAO;
    private jailDAO: JailDAO;

    constructor(){
        this.readConfig();
        this.readConstants();
        this.bot = new Bot(this.config.token);
        this.createDAOs();
        this.createServices();
        this.createControllers();
        this.createDelegator();
        this.createSupports();
    }

    private readConfig() : IConfig{
        console.log('Reading Config...');
        return this.config = config as IConfig;
    }

    private readConstants() : IConstants{
        console.log('Reading Constants...');
        return this.constants = constants as IConstants;
    }

    
    private createDAOs() : void{
        console.log('Creating DAOs...');
        this.playerDAO = new PlayerDAO(this.constants);
        this.guildDAO = new GuildDAO(this.constants);
        this.crimeDAO = new CrimeDAO(this.constants);
        this.moneyDAO = new MoneyDAO(this.constants);
        this.jailDAO = new JailDAO(this.constants);
    }

    private createServices() : void{
        console.log('Creating Services...');
        this.playerService = new PlayerService(this.playerDAO);
        this.guildService = new GuildService(this.guildDAO);
        this.crimeService = new CrimeService(this.crimeDAO, this.moneyDAO, this.jailDAO);
        this.jailService = new JailService(this.jailDAO);
    }

    private createControllers() : void{
        console.log('Creating Controllers...');
        this.guildController = new GuildController(this.bot, this.guildService);
        this.crimeController = new CrimeController(this.bot, this.crimeService, this.jailService);
        this.playerController = new PlayerController(this.bot, this.playerService);
    }

    private createDelegator() : void{
        console.log('Creating Delegator...');
        this.delegator = new Delegator(this.bot, this.guildController, this.crimeController, this.playerController);
        this.bot.setDelegator(this.delegator);
    }

    private createSupports(): void{
        console.log('Creating Support classes...');
        ErrorHandler.instance().setBot(this.bot);
    }
}