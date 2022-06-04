import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class Survey{
    @ObjectIdColumn()
    _id: ObjectID;

    @Column()
    title: string;

    @Column()
    qid: string;

    @Column() 
    usesTemplate: boolean; 
}