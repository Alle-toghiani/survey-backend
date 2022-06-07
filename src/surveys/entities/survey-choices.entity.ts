import { Column } from "typeorm";

export class SurveyChoice{
    @Column()
    id: number;

    @Column()
    title: string;

    @Column()
    frequency: number;

}