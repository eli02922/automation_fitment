import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface FitmentAttributes {
  id: number;
  partNumber: string;
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
  trim: string | null;
  engine: string | null;
  driveType: string | null;
  bodyType: string | null;
  source: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type FitmentCreationAttributes = Optional<
  FitmentAttributes,
  'id' | 'trim' | 'engine' | 'driveType' | 'bodyType' | 'isActive' | 'createdAt' | 'updatedAt'
>;

export class Fitment extends Model<FitmentAttributes, FitmentCreationAttributes>
  implements FitmentAttributes {
  declare id: number;
  declare partNumber: string;
  declare make: string;
  declare model: string;
  declare yearStart: number;
  declare yearEnd: number;
  declare trim: string | null;
  declare engine: string | null;
  declare driveType: string | null;
  declare bodyType: string | null;
  declare source: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Fitment.init(
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    partNumber: { type: DataTypes.STRING(64), allowNull: false },
    make: { type: DataTypes.STRING(64), allowNull: false },
    model: { type: DataTypes.STRING(64), allowNull: false },
    yearStart: { type: DataTypes.SMALLINT, allowNull: false },
    yearEnd: { type: DataTypes.SMALLINT, allowNull: false },
    trim: { type: DataTypes.STRING(64), allowNull: true },
    engine: { type: DataTypes.STRING(64), allowNull: true },
    driveType: { type: DataTypes.STRING(16), allowNull: true },
    bodyType: { type: DataTypes.STRING(32), allowNull: true },
    source: { type: DataTypes.STRING(32), allowNull: false, defaultValue: 'internal' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    tableName: 'fitments',
    timestamps: true,
    indexes: [
      { fields: ['partNumber'] },
      { fields: ['make', 'model', 'yearStart', 'yearEnd'] },
      { fields: ['isActive'] },
    ],
  },
);
