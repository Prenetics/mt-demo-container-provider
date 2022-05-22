import { SectionViewModel, ReportOverviewModel } from '../../../service/api/report/type';
import { KitInterface } from '../../KitProvider/type/KitInterface';

export class DNAReport implements ReportOverviewModel {
    basePath!: string;
    language!: string;
    viewTitle!: string;
    reportUrl!: string;
    reportName: 'home';
    id!: string;
    sections: SectionViewModel[];
    maximal: boolean;
    kit!: KitInterface;

    constructor(kit: KitInterface, result: ReportOverviewModel) {
        this.basePath = result.basePath;
        this.language = result.language;
        this.viewTitle = result.viewTitle;
        this.reportUrl = result.reportUrl;
        this.reportName = result.reportName;
        this.id = result.id;
        this.sections = result.sections;
        this.maximal = result.maximal;
        this.kit = kit;
    }
}
