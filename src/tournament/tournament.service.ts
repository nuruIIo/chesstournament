// src/tournament/tournament.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Tournament } from "./entities/tournament.entity";
import { CreateTournamentDto } from "./dto/create-tournament.dto";
import { UpdateTournamentDto } from "./dto/update-tournament.dto";

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(Tournament) private readonly tournamentRepo: typeof Tournament
  ) {}

  async create(createTournamentDto: CreateTournamentDto) {
    return this.tournamentRepo.create(createTournamentDto);
  }

  async findAll() {
    return this.tournamentRepo.findAll();
  }

  async findOne(id: number) {
    const tournament = await this.tournamentRepo.findByPk(id);
    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }
    return tournament;
  }

  async update(id: number, updateTournamentDto: UpdateTournamentDto) {
    const [rowsUpdated] = await this.tournamentRepo.update(
      updateTournamentDto,
      {
        where: { id },
      }
    );
    if (!rowsUpdated) {
      throw new NotFoundException("Tournament not found");
    }
    return { rowsUpdated };
  }

  async remove(id: number) {
    const rowsDeleted = await this.tournamentRepo.destroy({ where: { id } });
    if (!rowsDeleted) {
      throw new NotFoundException("Tournament not found");
    }
    return { rowsDeleted };
  }
}
