import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    email: string;
  
    @Column()
    password: string;

    @Column({default: null})
    apiToken: string;

    @Column()
    parentId: string;

    @Column({default: []})
    surveys: string[];
  }