import React, {Component} from 'react';
import CanvasJSReact from '../../../assets/js/canvasjs.react';
import cookie from "react-cookies";
import {toast} from "react-toastify";
import {Dropdown, Header, Icon, Loader} from 'semantic-ui-react';
// import CostReporting from '../components/admin/report/CostReporting';
import CostReporting from './CostReporting';
import ProductOptionUsing from './ProductOptionUsing';
import {forEach} from "react-bootstrap/cjs/ElementChildren";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
const optionsSelects = [
    {
        key: 'room',
        text: 'Phòng',
        value: 'room',
        content: 'Doanh thu theo Phòng',
    }
]
const optionsSelectsMonth = [
    {
        key: '202409',
        text: '2024-09',
        value: '202409',
        content: '2024-09',
    }
]
class MainReportPage extends Component {
    constructor(props) {
        let curDate = new Date();
        super(props);
        this.state = {
            allData: [],
            optionList: {
                optionName: [],
                optionCountOf: [],
                optionTotal: []
            },
            optionLst: [
                {
                    label: "",
                    y: 0
                }
            ],
            revenueByRoom: [
                {
                    label: "",
                    y: 0
                }
            ],
            monthSelected: curDate.getFullYear().toString() + ('0' + (curDate.getMonth()+1)).slice(-2),
            isLoadingRpt1: true,
            totalRoomRevenue: 0
        };
        [
            'addSymbols',
            'toggleDataSeries',
            'getOptionListValue',
            'GetReportData',
            'GetReportDataSummaryByRoom',
            'getrevenueByRoomValue',
            'handleChangeMonthDropdown'
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    async GetReportData(yearMonth, reportName) {
        let encoded = "yearmonth=" + yearMonth +
            "&reportName=" + reportName +
            "&token=" + cookie.load('tokenTBh');
        let result = [];
        // debugger;
        await fetch('https://script.google.com/macros/s/AKfycbxb7Uowm3MLV6UcbBK1rZ73wy8SXq44F-ZJhFChgkZJEXM5EpSO_MUckOvrxZf9MAch/exec?func=ReportDetail', {
            method: 'POST',
            body: encoded,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(async function (response) {
            let msgerr = '';
            await response.json().then(function (data) {
                data['result'] == 'error' ? msgerr = (JSON.stringify(data["error"]["message"]) + JSON.stringify(data["error"])) : result = data['data'];
                result = data;
            });

            let stt = response.status;
            if (stt == 200) {
                if (!msgerr) {

                } else {
                    toast.error("Error:" + JSON.stringify(msgerr));
                }
            } else {
                toast.error("Something is wrong, please check log for detail!");
            }

        }).then(() => {
            if (result.length > 0) {
                // debugger;
                this.setState({
                    allData: result,
                    isLoadingRpt1: false
                });
                this.getOptionListValue();
            }
            this.setState({
                isLoadingRpt1: false
            });
        })
    }

    async GetReportDataSummaryByRoom(yearMonth, reportName) {
        let encoded = "yearmonth=" + yearMonth +
            "&reportName=" + reportName +
            "&token=" + cookie.load('tokenTBh');
        let result = [];

        await fetch('https://script.google.com/macros/s/AKfycbxb7Uowm3MLV6UcbBK1rZ73wy8SXq44F-ZJhFChgkZJEXM5EpSO_MUckOvrxZf9MAch/exec?func=ReportSummary', {
            method: 'POST',
            body: encoded,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(async function (response) {
            let msgerr = '';
            await response.json().then(function (data) {
                // debugger;
                data['result'] == 'error' ? msgerr = (JSON.stringify(data["error"]["message"]) + JSON.stringify(data["error"])) : result = data['data'];
                result = data;
            });

            let stt = response.status;
            if (stt == 200) {
                if (!msgerr) {

                } else {
                    toast.error("Error:" + JSON.stringify(msgerr));
                }
            } else {
                toast.error("Something is wrong, please check log for detail!");
            }

        }).then(() => {
            if (result.length > 0) {
                // debugger;
                // this.setState({
                //     revenueByRoom: result
                // });
                this.getrevenueByRoomValue(result);
            }
        })
    }

    getrevenueByRoomValue(result) {
        const allData = [...result];
        let resultReturn = [];
        let total = 0;
        for (let i = 0; i < allData.length; i++) {
            let item = JSON.parse(allData[i]);
            total = total + item.y;
            resultReturn.push(item);
        }
        this.setState({
            revenueByRoom: resultReturn,
            totalRoomRevenue: total
        });
        console.log(resultReturn);
    }

    getOptionListValue() {
        let optionList = {
            optionName: [],
            optionID: [],
            optionTotal: []
        }
        const allData = [...this.state.allData];
        let tmpoptionLst = [];

        for (let i = 0; i < allData.length; i++) {
            let item = JSON.parse(allData[i]);
            let options = JSON.parse(item.options == "" ? "[]" : item.options);
            for (let j = 0; j < options.length; j++) {
                let option = options[j];
                let optionName = option.description;
                let optionID = option.optionId;
                let optionTotal = option.total;

                let isHaving = false;
                for (let x = 0; x < optionList.optionID.length; x++) {
                    if (optionList.optionID[x] == optionID) {
                        optionList.optionTotal[x] = optionList.optionTotal[x] + optionTotal;
                        isHaving = true;
                        break;
                    }
                }
                if (!isHaving) {
                    optionList.optionTotal.push(optionTotal);
                    optionList.optionID.push(optionID);
                    optionList.optionName.push(optionName);
                }
            }
        }

        for (let i = 0; i < optionList.optionName.length; i++) {
            tmpoptionLst.push({"label": optionList.optionName[i], "y": optionList.optionTotal[i]})
        }
        this.setState({
            optionLst: tmpoptionLst
        });

        console.log(optionList);
    }

    addSymbols(e) {
        var suffixes = ["", "K", "M", "B"];
        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if (order > suffixes.length - 1)
            order = suffixes.length - 1;
        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    }

    toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        this.chart.render();
    }

    componentDidMount() {
        let yearmonth = this.state.monthSelected;
        this.GetReportDataSummaryByRoom(yearmonth, "test"); //Summary
        this.GetReportData(yearmonth, "test"); //Detail
    }

    handleChangeMonthDropdown(event, data) {
        this.setState({
            isLoadingRpt1: true
        });
        let yearmonth = data.value;
        this.GetReportDataSummaryByRoom(yearmonth, "test"); //Summary
        this.GetReportData(yearmonth, "test"); //Detail
    }

    render() {
        let year = new Date().getFullYear();

        const options = {
            animationEnabled: true,
            colorSet: "colorSet2",
            title: {
                text: "Total: " + formatNumber(this.state.totalRoomRevenue) + " VND"
            },
            axisX: {
                valueFormatString: "MMMM"
            },
            axisY: {
                prefix: "$",
                labelFormatter: this.addSymbols
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: this.toggleDataSeries,
                verticalAlign: "top"
            },
            data: [{
                type: "column",
                name: "Actual Sales",
                showInLegend: true,
                xValueFormatString: "MMMM YYYY",
                yValueFormatString: "VND#,##0",
                dataPoints: this.state.revenueByRoom.length > 0 ? this.state.revenueByRoom : [
                    {label: "101", y: 15000000},
                    {label: "102", y: 15000000},
                    {label: "103", y: 15000000},
                    {label: "104", y: 15000000},
                    {label: "201", y: 15000000},
                    {label: "202", y: 15000000},
                    {label: "203", y: 15000000},
                    {label: "204", y: 15000000}
                    // {x: new Date(year, 0), y: 27500},
                    // {x: new Date(year, 1), y: 29000},
                    // {x: new Date(year, 2), y: 22000},
                    // {x: new Date(year, 3), y: 26500},
                    // {x: new Date(year, 4), y: 33000},
                    // {x: new Date(year, 5), y: 37000},
                    // {x: new Date(year, 6), y: 32000},
                    // {x: new Date(year, 7), y: 27500},
                    // {x: new Date(year, 8), y: 29500},
                    // {x: new Date(year, 9), y: 43000},
                    // {x: new Date(year, 10), y: 55000, indexLabel: "High Renewals"},
                    // {x: new Date(year, 11), y: 39500}
                ]
            }, {
                type: "line",
                name: "Expected Sales",
                showInLegend: true,
                yValueFormatString: "VND#,##0",
                dataPoints: [
                    {label: "101", y: 30000000},
                    {label: "102", y: 30000000},
                    {label: "103", y: 30000000},
                    {label: "104", y: 30000000},
                    {label: "201", y: 30000000},
                    {label: "202", y: 30000000},
                    {label: "203", y: 30000000},
                    {label: "204", y: 30000000}
                    // {x: new Date(year, 0), y: 30000000},
                    // {x: new Date(year, 1), y: 30000000},
                    // {x: new Date(year, 2), y: 30000000},
                    // {x: new Date(year, 3), y: 30000000},
                    // {x: new Date(year, 4), y: 30000000},
                    // {x: new Date(year, 5), y: 30000000},
                    // {x: new Date(year, 6), y: 30000000},
                    // {x: new Date(year, 7), y: 30000000},
                    // {x: new Date(year, 8), y: 30000000},
                    // {x: new Date(year, 9), y: 30000000},
                    // {x: new Date(year, 10), y: 30000000},
                    // {x: new Date(year, 11), y: 30000000}
                ]
            }]
        }

        return (
            <div>
                <hr/>

                <Header as='h4'>
                    <Icon name='chart pie'/>
                    <Header.Content>
                        Báo cáo doanh số theo{' '}
                        <Dropdown
                            inline
                            header='Báo cáo theo:'
                            options={optionsSelects}
                            defaultValue={optionsSelects[0].value}
                        />
                        <Dropdown
                            options={optionsSelectsMonth}
                            //value={this.state.monthSelected}
                            defaultValue={optionsSelectsMonth[0].value}
                            placeholder="Chọn Tháng"
                            selection
                            onChange={this.handleChangeMonthDropdown}
                        />
                    </Header.Content>
                </Header>
                {this.state.isLoadingRpt1 ? <Loader active inline='centered'/> :
                    <div>
                        <CanvasJSChart options={options}
                                       onRef={ref => this.chart = ref}
                        />
                        <ProductOptionUsing optionLst={this.state.optionLst}/>
                    </div>
                }
                {/*<CostReporting/>*/}
            </div>
        );
    }
}

export default MainReportPage;