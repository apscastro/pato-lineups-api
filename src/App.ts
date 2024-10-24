import express from 'express';
import cors from 'cors';
import { Like, Raw, Repository } from 'typeorm';
import { Player } from './entity/Player';
import AppDataSource from './data-source';
import { Club } from './entity/Club';

const App = () =>{
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get('/api/players/:page', async (req, res) => {
        try {
            const page = parseInt(req.params.page, 10);
            const limit = 10;
            const offset = (page - 1) * limit;
        
            const playerRepository: Repository<Player> = AppDataSource.getRepository(Player);
            const totalPlayers = await playerRepository.count();

            const players = await playerRepository.find({
                take: limit,
                skip: offset,
                order: {
                    playerMarketValue: 'DESC', 
                },
                relations: ['playerClub'],
            });
            const response = players.map(player => ({
                ...player,
                clubId: player.playerClub ? player.playerClub.clubId : null,
            }));
    
            const totalPages = Math.ceil(totalPlayers / limit);
    
            // Return the structured response
            res.json({
                players: response,
                totalPlayers,
                totalPages,
                currentPage: page,
            });
        } catch (error) {
            console.error('Error fetching players:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.get('/api/clubs', async (req, res) => {
        try {
            const clubs: Repository<Club> = AppDataSource.getRepository(Club);
            const result = await clubs.find(); 
            res.json(result);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.get('/api/players-from-club/:club_id', async(req,res) =>{
        try{
            const clubId: number = parseInt(req.params.club_id, 10);
            const playerRepository : Repository<Player> = AppDataSource.getRepository(Player)
            const players = await playerRepository.find({
                where: {
                    playerClub: { clubId: clubId },
                },
                relations: ['playerClub'],
            });
            const response = players.map(player => ({
                ...player,
                clubId: player.playerClub ? player.playerClub.clubId : null,
            }));
            // Return the structured response
            res.json({
                players: response,
            });
        }catch (error) {
            console.error('Error fetching players from club:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })

    app.get('/api/players/:club_id/:page', async (req, res) => {
        try {
            const clubId = parseInt(req.params.club_id, 10);
            const page = parseInt(req.params.page, 10);
            const limit = 10; 
            const offset = (page - 1) * limit;
    
            const sort = req.query.sort === 'asc' ? 'ASC' : 'DESC'; 
            
            const playerRepository: Repository<Player> = AppDataSource.getRepository(Player);
            
            const totalPlayers = await playerRepository.count({
                where: {
                    playerClub: { clubId: clubId },
                },
            });
    
            const players = await playerRepository.find({
                where: {
                    playerClub: { clubId: clubId }, 
                },
                take: limit,
                skip: offset,
                order: {
                    playerMarketValue: sort, 
                },
                relations: ['playerClub'],
            });
    
            const response = players.map(player => ({
                ...player,
                clubId: player.playerClub ? player.playerClub.clubId : null,
            }));
    
            const totalPages = Math.ceil(totalPlayers / limit);
    
            // Return the structured response
            res.json({
                players: response,
                totalPlayers,
                totalPages,
                currentPage: page,
            });
        } catch (error) {
            console.error('Error fetching players:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.get('/api/players-from-league/:league_id/:page', async (req, res) => {
        try {
            const leagueId = parseInt(req.params.league_id, 10);
            const page = parseInt(req.params.page, 10);
            const limit = 10; 
            const offset = (page - 1) * limit;
    
            const sort = req.query.sort === 'asc' ? 'ASC' : 'DESC'; 
            
            const playerRepository: Repository<Player> = AppDataSource.getRepository(Player);
            
            const totalPlayers = await playerRepository.count({
                where: {
                    playerClub: { clubLeagueId:leagueId},
                },
            });
    
            const players = await playerRepository.find({
                where: {
                    playerClub: { clubLeagueId:leagueId }, 
                },
                take: limit,
                skip: offset,
                order: {
                    playerMarketValue: sort, 
                },
                relations: ['playerClub'],
            });
    
            const response = players.map(player => ({
                ...player,
                clubId: player.playerClub ? player.playerClub.clubId : null,
            }));
    
            const totalPages = Math.ceil(totalPlayers / limit);

            res.json({
                players: response,
                totalPlayers,
                totalPages,
                currentPage: page,
            });
        } catch (error) {
            console.error('Error fetching players:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    app.get('/api/player-by-name/:name',async (req,res) => {
        try{
            const playerName = req.params.name;
    
            const sort = req.query.sort === 'asc' ? 'ASC' : 'DESC'; 
            
            const playerRepository: Repository<Player> = AppDataSource.getRepository(Player);

            const players = await playerRepository.find({
                where: {
                    playerName: Raw(alias => `UNACCENT(LOWER(${alias})) LIKE UNACCENT(LOWER(:name))`, { name: `%${playerName}%` }), 
                },
                order: {
                    playerMarketValue: sort, 
                },
                relations: ['playerClub'],
            });
    
            const response = players.map(player => ({
                ...player,
                clubId: player.playerClub ? player.playerClub.clubId : null,
            }));
    

            res.json({
                players: response,
            });

        }
        catch(error){
            console.error('Error fetching players:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })

    return app;
}

export default App;