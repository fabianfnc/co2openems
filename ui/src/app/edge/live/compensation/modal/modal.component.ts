import { Component, Input } from '@angular/core';
import { Edge, EdgeConfig, Service } from '../../../../shared/shared';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'compensation-modal',
    templateUrl: './modal.component.html'
})
export class CompensationModalComponent {

    // comp request variables
    public amount: number | null = null;
    public costs: number | null | string = null;
    public req: number | null = null;
    public get: number | null = null;
    public left: number | null = null;

    // comp certificate variables
    public userCertificate: string | null = null
    public compensated: number | null = null;
    public overcompensation: number | null = null;
    public certificateId: string | null = null;
    public compPlace: string | null = null;
    public plantPartner: string | null = null;
    public issueDate: string | null = null;
    public treeURL: string | null = null;


    @Input() public edge: Edge;
    @Input() public config: EdgeConfig;

    constructor(
        public service: Service,
        public modalCtrl: ModalController,
        private http: HttpClient
    ) { }


    public getPrice(): void {
        this.http.get("https://api.corrently.io/v2.0/co2/price?co2=" + this.amount.toString()).subscribe(response => {
            this.costs = response["priceEUR"];
            this.req = response["reqCO2"];
            this.get = response["getCO2"];
            this.left = response["remainCO2"];
        });
    };

    public payComp(): void {
        this.http.get("https://api.corrently.io/v2.0/co2/compensate?co2=" + this.amount.toString()).subscribe(response => {
            window.open(response.toString(), "_blank");
        });
    };

    public openCertificate(): void {
        window.open(this.treeURL.toString(), "_blank");
    }

    public getCertificate(): void {
        this.http.get("https://api.corrently.io/v2.0/co2/compensation?compensation=" + this.userCertificate).subscribe(response => {
            this.compensated = response["co2requested"];
            this.overcompensation = response["co2"] - response["co2requested"];
            this.certificateId = response["compensation"];
            this.compPlace = response["certificate"]["meta"];
            this.plantPartner = response["certificate"]["issuer"];
            this.issueDate = new Date(response["timeStamp"]).toLocaleString();
            this.treeURL = "https://corrently.de/download/" + response["tree"] + ".pdf";
        });
    };
}