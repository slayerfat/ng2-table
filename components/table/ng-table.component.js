"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var ng_table_sorting_directive_1 = require('./ng-table-sorting.directive');
function compileToComponent(template, directives, row, column, rowIndex, columnIndex) {
    var FakeComponent = (function () {
        function FakeComponent() {
        }
        Object.defineProperty(FakeComponent.prototype, "row", {
            get: function () {
                return row;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FakeComponent.prototype, "column", {
            get: function () {
                return column;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FakeComponent.prototype, "rowIndex", {
            get: function () {
                return rowIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FakeComponent.prototype, "columnIndex", {
            get: function () {
                return columnIndex;
            },
            enumerable: true,
            configurable: true
        });
        FakeComponent = __decorate([
            core_1.Component({
                selector: 'fake',
                template: template, directives: directives
            }), 
            __metadata('design:paramtypes', [])
        ], FakeComponent);
        return FakeComponent;
    }());
    ;
    return FakeComponent;
}
var NgTableComponent = (function () {
    function NgTableComponent(appRef, compiler, elementRef, injector) {
        this.rows = [];
        this.config = {};
        this.tableChanged = new core_1.EventEmitter();
        this._columns = [];
        this.appRef = appRef;
        this.compiler = compiler;
        this.elementRef = elementRef;
        this.injector = injector;
    }
    Object.defineProperty(NgTableComponent.prototype, "columns", {
        get: function () {
            return this._columns;
        },
        set: function (values) {
            var _this = this;
            values.forEach(function (value) {
                var column = _this._columns.find(function (col) { return col.name === value.name; });
                if (column) {
                    Object.assign(column, value);
                }
                if (!column) {
                    _this._columns.push(value);
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    NgTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        var nativeElement = this.elementRef.nativeElement;
        this.classMap = nativeElement.getAttribute('class') || { 'table': true, 'table-striped': true, 'table-bordered': true, 'dataTable': true };
        nativeElement.removeAttribute('class');
        for (var i = 0; i < this.rows.length; i++) {
            for (var j = 0; j < this.columns.length; j++) {
                if (this.columns[j].template) {
                    this.compiler.resolveComponent(compileToComponent(this.columns[j].template, this.columns[j].directives || [], this.rows[i], this.columns[j], i, j)).then(function (factory) {
                        var rowIndex = factory.componentType.prototype.rowIndex;
                        var columnIndex = factory.componentType.prototype.columnIndex;
                        var cmpRef = factory.create(_this.injector, null, ".row-" + rowIndex + "-col-" + columnIndex);
                        _this.appRef._loadComponent(cmpRef);
                    });
                }
            }
        }
    };
    Object.defineProperty(NgTableComponent.prototype, "configColumns", {
        get: function () {
            var sortColumns = [];
            this.columns.forEach(function (column) {
                if (column.sort) {
                    sortColumns.push(column);
                }
            });
            return { columns: sortColumns };
        },
        enumerable: true,
        configurable: true
    });
    NgTableComponent.prototype.onChangeTable = function (column) {
        this._columns.forEach(function (col) {
            if (col.name !== column.name) {
                col.sort = '';
            }
        });
        this.tableChanged.emit({ sorting: this.configColumns });
    };
    NgTableComponent.prototype.getData = function (row, propertyName) {
        return propertyName.split('.').reduce(function (prev, curr) { return prev[curr]; }, row);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], NgTableComponent.prototype, "rows", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], NgTableComponent.prototype, "config", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgTableComponent.prototype, "tableChanged", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array), 
        __metadata('design:paramtypes', [Array])
    ], NgTableComponent.prototype, "columns", null);
    NgTableComponent = __decorate([
        core_1.Component({
            selector: 'ng-table',
            template: "\n    <table [ngClass]=\"classMap\"\n           role=\"grid\" style=\"width: 100%;\">\n      <thead>\n      <tr role=\"row\">\n        <th *ngFor=\"let column of columns\" [ngTableSorting]=\"config\" [column]=\"column\" (sortChanged)=\"onChangeTable($event)\">\n          {{column.title}}\n          <i *ngIf=\"config && column.sort\" class=\"pull-right fa\"\n            [ngClass]=\"{'fa-chevron-down': column.sort === 'desc', 'fa-chevron-up': column.sort === 'asc'}\"></i>\n        </th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr *ngFor=\"let row of rows; let i = index\">\n        <td *ngFor=\"let column of columns; let j = index\">\n          <span *ngIf=\"column.template==null\">\n            {{getData(row, column.name)}}\n          </span>\n          <span *ngIf=\"column.template\" class=\"row-{{i}}-col-{{j}}\"></span>\n        </td>\n      </tr>\n      </tbody>\n    </table>\n",
            directives: [ng_table_sorting_directive_1.NgTableSortingDirective, common_1.NgClass, common_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [core_1.ApplicationRef, core_1.ComponentResolver, core_1.ElementRef, core_1.Injector])
    ], NgTableComponent);
    return NgTableComponent;
}());
exports.NgTableComponent = NgTableComponent;