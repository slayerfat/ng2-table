import { EventEmitter } from '@angular/core';
export declare class NgTableComponent {
    rows: Array<any>;
    config: any;
    tableChanged: EventEmitter<any>;
    cellClicked: EventEmitter<any>;
    columns: Array<any>;
    configColumns: any;
    private _columns;
    onChangeTable(column: any): void;
    getData(row: any, propertyName: string): string;
    onCellClick(row: any, column: any, rowIndex: number, columnIndex: number): void;
}
export interface NgCellClickData {
    row: any;
    column: any;
    rowIndex: number;
    columnIndex: number;
}
