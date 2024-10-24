import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./Player";
@Entity()
export class Club{
    @PrimaryGeneratedColumn({name:'club_id'})
    clubId: number

    @Column({name:'club_name'})
    clubName: string

    @Column({name:'club_image'})
    clubImage: string

    @Column({name:'club_league_id'})
    clubLeagueId: number

    @Column({name:'club_nation_id'})
    clubNationId:number

    @OneToMany(() => Player, (player => player.playerClub))
    @JoinColumn({name:'club_players'})
    clubPlayers: Player[]
}