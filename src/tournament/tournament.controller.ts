// src/tournament/tournament.controller.ts
import { TournamentService } from "./tournament.service";
import { CreateTournamentDto } from "./dto/create-tournament.dto";
import { UpdateTournamentDto } from "./dto/update-tournament.dto";
import { Controller } from "@nestjs/common";
import {
  Delete,
  Get,
  Post,
  Put,
} from "@nestjs/common/decorators/http/request-mapping.decorator";
import {
  Body,
  Param,
} from "@nestjs/common/decorators/http/route-params.decorator";

@Controller("tournaments")
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post()
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentService.create(createTournamentDto);
  }

  @Get()
  findAll() {
    return this.tournamentService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.tournamentService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id") id: number,
    @Body() updateTournamentDto: UpdateTournamentDto
  ) {
    return this.tournamentService.update(id, updateTournamentDto);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.tournamentService.remove(id);
  }
}
