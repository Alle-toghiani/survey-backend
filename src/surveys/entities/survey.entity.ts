import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { SurveyQuestion } from "./survey-question.entity";
@Entity()
export class Survey{
    @ObjectIdColumn()
    _id: ObjectID;

    @Column()
    id: number;

    @Column()
    data: {[key:string|number] : SurveyQuestion};

    @Column()
    name: string

    @Column()
    language: number

    @Column()
    active: boolean;

    @Column()
    can_active: boolean;

    @Column()
    massage_text?: string;

    @Column()
    views: number;

    @Column()
    submitted_responses: number;

    @Column()
    closed: boolean;

    @Column()
    is_stopped: boolean;

    @Column()
    is_not_started: boolean;

    @Column()
    deleted: boolean;

    @Column()
    preview_code: string;

    @Column()
    report_code: string;

    @Column()
    score_charts_active: boolean;

    @Column()
    theme: number;

    @Column()
    background_image_config?: string;
    
    @Column()
    created_date: string;

    @Column()
    parent?: string;

    @Column()
    folder: {
        id: number,
        order: number,
        name: string
    }
}