import { AntibodyViewModel, ReportAntibodyModel } from '../../../service/api/report/type';
import { KitInterface } from '../../KitProvider/type/KitInterface';

export class AntibodyReport implements ReportAntibodyModel {
    basePath!: string;
    language!: string;
    viewTitle!: string;
    reportUrl!: string;
    reportName: 'snapshot-antibody';
    id!: string;
    antibody: AntibodyViewModel;
    kit!: KitInterface;

    constructor(kit: KitInterface, result: ReportAntibodyModel) {
        this.basePath = result.basePath;
        this.language = result.language;
        this.viewTitle = result.viewTitle;
        this.reportUrl = result.reportUrl;
        this.reportName = 'snapshot-antibody';
        this.id = result.id;
        this.antibody = result.antibody;
        this.kit = kit;
    }
}
