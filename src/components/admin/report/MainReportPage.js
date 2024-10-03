import React, {Component} from 'react';
import CanvasJSReact from '../../../assets/js/canvasjs.react';
import cookie from "react-cookies";
import {toast} from "react-toastify";
import {Button, Dropdown, Header, Icon, Loader} from 'semantic-ui-react';
// import CostReporting from '../components/admin/report/CostReporting';
import CostReporting from './CostReporting';
import Profit from './Profit';
import ProductOptionUsing from './ProductOptionUsing';
import {forEach} from "react-bootstrap/cjs/ElementChildren";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

const saleExpedtedByRoom = 3000000;
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
            optionLstPie: [
                {
                    name: "nothing",
                    y: 100
                }
            ],
            revenueByRoom: [
                {
                    label: "",
                    y: 0
                }
            ],
            // monthSelected: curDate.getFullYear().toString() + ('0' + (curDate.getMonth() + 1)).slice(-2),
            monthSelected: "",
            isLoadingYearMonthListReport: true,
            isLoadingYearMonthReport: false,
            totalRoomRevenue: 0,
            optionsSelectsYearMonth: [],
            invoiceList: [],
            isInvoiceloading: false
        };
        [
            'addSymbols',
            'toggleDataSeries',
            'getOptionListValue',
            'GetReportData',
            'GetReportList',
            'getrevenueByRoomValue',
            'handleChangeMonthDropdown',
            'getMonthListOption',
            'getInvoiceListByMonth',
            'refreshReport'
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    async GetReportData(yearMonth, reportName) {
        let encoded = "yearmonth=" + yearMonth +
            "&reportName=" + reportName +
            "&token=" + cookie.load('tokenTBh');
        let result = [];
        // debugger;
        await fetch('https://script.google.com/macros/s/AKfycbxwdrVrY7_Vx56rtRuGJSaGP2mj_M1OhYlr_oe45JRmhLsj3P9NMly81nhMofWHefct/exec?func=ReportDetail', {
            method: 'POST',
            body: encoded,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(async function (response) {
            let msgerr = '';
            await response.json().then(function (data) {
                data['result'] == 'error' ? msgerr = (JSON.stringify(data["error"]["message"]) + JSON.stringify(data["error"])) : result = data['data'];
                // result = data;
                result = JSON.parse(result);
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
                    isLoadingYearMonthListReport: false,
                    isLoadingYearMonthReport: false
                });
                this.getOptionListValue();
            }
            this.setState({
                isLoadingYearMonthListReport: false,
                isLoadingYearMonthReport: false
            });
        })
    }

    getInvoiceListByMonth(yearMonth) {
        this.setState({
            isInvoiceloading: true,
            invoiceList: []
        });

        fetch("https://script.google.com/macros/s/AKfycbxwdrVrY7_Vx56rtRuGJSaGP2mj_M1OhYlr_oe45JRmhLsj3P9NMly81nhMofWHefct/exec?func=invoiceList&token=" + cookie.load('tokenTBh') + "&yearmonth=" + yearMonth)
            .then(res => res.json())
            .then(
                (result) => {
                    let isErr = false;
                    if (result.hasOwnProperty("result")) {
                        if (result["result"] == "error") {
                            toast.error(result["error"]);
                            isErr = true;
                        }
                    }

                    if (isErr) {
                        this.setState({
                            isInvoiceloading: false
                        });
                    } else {
                        let strs = [];
                        let tmp = [];
                        for (let i = 0; i < result.length; i++) {
                            tmp = JSON.parse(result[i])
                            strs.push(tmp);
                        }

                        let tmpInvoices = {};
                        for (let i = 0; i < strs.length; i++) {
                            let item = strs[i];
                            tmpInvoices[item['type']] = (tmpInvoices[item['type']] ?? 0) + item['amount'];
                        }

                        let dataInvoice = [];
                        for (const [key, value] of Object.entries(tmpInvoices)) {
                            dataInvoice.push({
                                "y": value,
                                "label": key + " " + formatNumber(value)
                            });
                        }

                        function compare(a, b) {
                            if (a.y > b.y) {
                                return -1;
                            }
                            if (a.y < b.y) {
                                return 1;
                            }
                            return 0;
                        }

                        dataInvoice.sort(compare);

                        this.setState({
                            isInvoiceloading: false,
                            invoiceList: dataInvoice
                        });
                    }
                }, (error) => {
                    console.log(error);
                    this.setState({});
                }
            ).then(() => {
            this.setState({
                isInvoiceloading: false
            });
        })
    }

    async GetReportList() {
        let encoded = "token=" + cookie.load('tokenTBh');
        let result = [];

        await fetch('https://script.google.com/macros/s/AKfycbxwdrVrY7_Vx56rtRuGJSaGP2mj_M1OhYlr_oe45JRmhLsj3P9NMly81nhMofWHefct/exec?func=ReportList', {
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
                // result = JSON.parse(data);
                // result = [...data];
                result = JSON.parse(result);
            });
            // debugger;
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
            this.getMonthListOption(result);
            // this.getrevenueByRoomValue(result);
        }).then(() => {

        })
    }

    getMonthListOption(result) {
        result = [...result];
        let listYearMonth = [];
        for (let i = 0; i < result.length; i++) {
            let item = JSON.parse(result[i]);
            if (item.hasOwnProperty("yearMonth")) {
                listYearMonth.push(
                    {
                        key: item["yearMonth"],
                        text: item["yearMonth"],
                        value: item["yearMonth"],
                        content: item["yearMonth"]
                    }
                )
            }
        }
        if (listYearMonth.length > 0) {
            this.setState({
                optionsSelectsYearMonth: listYearMonth,
                isLoadingYearMonthListReport: false,
                isLoadingYearMonthReport: false
            });
        }
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
        let optionLstPieTmp = [];
        let totalPriceByRoom = [];
        let totalPriceByRoomTmp = {};

        for (let i = 0; i < allData.length; i++) {
            let item = JSON.parse(allData[i]);
            let roomId = item["roomid"];
            totalPriceByRoomTmp[roomId.toString()] = totalPriceByRoomTmp[roomId.toString()] ? totalPriceByRoomTmp[roomId.toString()] + item["totalPrice"] : item["totalPrice"];
            // totalPriceByRoom.push({label: roomId, y: item["totalPrice"]});

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

        let totalRoomRevenue = 0;
        Object.keys(totalPriceByRoomTmp).forEach(key => {
            const value = totalPriceByRoomTmp[key];
            // console.log(`Key: ${key}, Value: ${value}`);
            totalPriceByRoom.push({label: key, y: value});
            totalRoomRevenue = totalRoomRevenue + value;
        });

        let totalProductRevenue = 0;
        for (let i = 0; i < optionList.optionName.length; i++) {
            tmpoptionLst.push({"label": optionList.optionName[i], "y": optionList.optionTotal[i]})
            totalProductRevenue = totalProductRevenue + optionList.optionTotal[i];
        }

        for (let i = 0; i < optionList.optionName.length; i++) {
            optionLstPieTmp.push({
                "name": optionList.optionName[i],
                "y": Math.round((optionList.optionTotal[i] / totalProductRevenue * 100), 2)
            })
        }

        this.setState({
            optionLst: tmpoptionLst,
            optionLstPie: optionLstPieTmp,
            revenueByRoom: totalPriceByRoom,
            totalRoomRevenue: totalRoomRevenue
        });

        console.log(optionList);
        console.log(totalPriceByRoom);
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
        // this.GetReportDataSummaryByRoom(yearmonth, "test"); //Summary
        this.GetReportList();
        // this.GetReportData(yearmonth, "test"); //Detail
    }

    refreshReport() {
        this.setState({
            isLoadingYearMonthReport: true
        });
        this.GetReportData(this.state.monthSelected, "test"); //Detail
        this.getInvoiceListByMonth(this.state.monthSelected);
    }

    handleChangeMonthDropdown(event, data) {
        this.setState({
            isLoadingYearMonthReport: true,
            monthSelected: data.value
        });
        let yearmonth = data.value;
        // this.GetReportDataSummaryByRoom(yearmonth, "test"); //Summary
        this.GetReportData(yearmonth, "test"); //Detail
        this.getInvoiceListByMonth(yearmonth);
    }

    render() {
        let year = new Date().getFullYear();

        let options = {
            animationEnabled: true,
            colorSet: "colorSet2",
            title: {
                text: this.state.monthSelected == "" ? "Tổng Doanh thu: 0 VND" : "Doanh Thu Tháng " + this.state.monthSelected + "  -  " + formatNumber(this.state.totalRoomRevenue) + " VND"
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
                name: "Thực tế",
                showInLegend: true,
                xValueFormatString: "MMMM YYYY",
                yValueFormatString: "VND#,##0",
                dataPoints: this.state.revenueByRoom.length > 0 ? this.state.revenueByRoom : [
                    {label: "101", y: saleExpedtedByRoom},
                    {label: "102", y: saleExpedtedByRoom},
                    {label: "103", y: saleExpedtedByRoom},
                    {label: "104", y: saleExpedtedByRoom},
                    {label: "201", y: saleExpedtedByRoom},
                    {label: "202", y: saleExpedtedByRoom},
                    {label: "203", y: saleExpedtedByRoom},
                    {label: "204", y: saleExpedtedByRoom}
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
                name: "Mong muốn",
                showInLegend: true,
                yValueFormatString: "VND#,##0",
                dataPoints: [
                    {label: "101", y: saleExpedtedByRoom},
                    {label: "102", y: saleExpedtedByRoom},
                    {label: "103", y: saleExpedtedByRoom},
                    {label: "104", y: saleExpedtedByRoom},
                    {label: "201", y: saleExpedtedByRoom},
                    {label: "202", y: saleExpedtedByRoom},
                    {label: "203", y: saleExpedtedByRoom},
                    {label: "204", y: saleExpedtedByRoom},
                    {label: "304", y: saleExpedtedByRoom}
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
                            disabled={this.state.isLoadingYearMonthReport}
                            loading={this.state.isLoadingYearMonthListReport}
                            options={this.state.optionsSelectsYearMonth}
                            //value={this.state.monthSelected}
                            // defaultValue={optionsSelectsMonth[0].value}
                            placeholder="Chọn Tháng"
                            selection
                            onChange={this.handleChangeMonthDropdown}
                        />
                        <Button disabled={this.state.isLoadingYearMonthReport || this.state.monthSelected == ""} positive color='teal' style={{marginLeft: '10px'}}
                                onClick={this.refreshReport}>
                            Refresh
                        </Button>
                    </Header.Content>
                </Header>
                {this.state.monthSelected != "" &&
                <div>
                    {this.state.isLoadingYearMonthReport ? <Loader active inline='centered'/> :
                        <div>
                            <CanvasJSChart options={options}
                                           onRef={ref => this.chart = ref}
                            />
                            <ProductOptionUsing optionLst={this.state.optionLst}
                                                optionLstPie={this.state.optionLstPie}/>
                            <Profit optionLst={this.state.invoiceList} yearmonth={this.state.monthSelected.toString()}/>
                        </div>
                    }
                </div>
                }
            </div>
        );
    }
}

export default MainReportPage;