// src/tournament/entities/tournament.entity.ts
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export class Tournament extends Model<Tournament> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate: Date;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  participants: number[]; // Array of player IDs
}
