import { Column } from "typeorm";

export class SurveyCharts{
    @Column()
    id: number;

    @Column()
    title: string;

    @Column()
    type: number | string;

    @Column()
    order: number;

    @Column()
    caption: string;
}

export class CustomChartSettings{
    @Column()
    type: string;
}