import { Column } from "typeorm";
import { SurveyCharts, CustomChartSettings } from "./survey-charts.entity";
import { SurveyChoice } from "./survey-choices.entity";

export class SurveyQuestion{
    @Column(type => SurveyChoice)
    choices: SurveyChoice[];

    @Column(type => SurveyCharts)
    charts: SurveyCharts;

    @Column(type => CustomChartSettings)
    customChartSettings?: CustomChartSettings

    @Column()
    id: number;

    @Column()
    title: string;

    @Column()
    type: number;

    @Column()
    order: number;

    @Column()
    show_charts: boolean;

    @Column()
    image_video_active: boolean;

    @Column()
    image_or_video: number;

    @Column()
    image_path: string;

    @Column()
    video_url: string;

    @Column()
    image_name: string; 

    @Column()
    question_number_is_hidden: boolean;

    @Column()
    related_group: string;

    @Column()
    allow_multiple_select: boolean;
}