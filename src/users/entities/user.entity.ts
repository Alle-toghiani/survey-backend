import {
    Entity,
    Column,
    ObjectIdColumn,
  } from 'typeorm';
  
  @Entity()
  export class User {
    @ObjectIdColumn()
    id: number;

    @Column()
    username: string;
  
    @Column()
    email: string;
  
    @Column()
    password: string;

    @Column({default: null})
    apiToken: string;

    @Column({default: null})
    parentId: string;

    @Column({default: []})
    surveys: string[];
  }