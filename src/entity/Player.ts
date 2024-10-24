import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Club } from "./Club";

@Entity()
export class Player{
    @PrimaryGeneratedColumn({name:'player_id'})
    playerId: number

    @Column({name:'player_name'})
    playerName: string

    @Column({name:'player_position'})
    playerPosition: string

    @Column({type:'bigint',name:'player_market_value'})
    playerMarketValue: number

    @Column({name:'player_image'})
    playerImage: string

    @Column({name:'player_nation_image'})
    playerNationImage:string

    @Column({name:'player_nation_title'})
    playerNationTitle:string

    @Column({type:'date', name:'player_birth'})
    playerBirth: number

    @ManyToOne(() => Club, (club) => club.clubPlayers)
    @JoinColumn({name:'player_club'})
    playerClub: Club
}