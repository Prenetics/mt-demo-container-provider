import { HeartHealthModel, ReportHeartHealthModel, HeartHealthDoctorModal, HeartHealthApproverModal } from '../../../service/api/report/type';
import { KitInterface } from '../../KitProvider/type/KitInterface';

export class HeartHealthReport implements ReportHeartHealthModel {
    basePath!: string;
    language!: string;
    viewTitle!: string;
    reportUrl!: string;
    reportName: 'snapshot-heart-health';
    id!: string;
    heartHealth: HeartHealthModel;
    kit!: KitInterface;
    doctorComment?: HeartHealthDoctorModal;
    approver?: HeartHealthApproverModal;

    constructor(kit: KitInterface, result: ReportHeartHealthModel) {
        this.basePath = result.basePath;
        this.language = result.language;
        this.viewTitle = result.viewTitle;
        this.reportUrl = result.reportUrl;
        this.reportName = 'snapshot-heart-health';
        this.id = result.id;
        this.heartHealth = result.heartHealth;
        this.kit = kit;
        this.doctorComment = result.doctorComment;
        this.approver = result.doctorComment?.approver;
    }
}
