import React, {Component} from 'react';
import CanvasJSReact from '../../../assets/js/canvasjs.react';
import PropTypes from "prop-types";
import {ListRoomRows} from "../../ListRoomRows";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function explodePie(e) {
    if (typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
    } else {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
    }
    e.chart.render();

}

class ProductOptionUsing extends Component {
    addSymbols(e) {
        var suffixes = ["", "K", "M", "B"];
        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if (order > suffixes.length - 1)
            order = suffixes.length - 1;
        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    }

    render() {
        let total = 0;
        for (let i = 0; i < this.props.optionLst.length; i++) {
            total = total + this.props.optionLst[i].y;
        }

        let chart = {
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Tỷ lệ %",
            },
            legend: {
                cursor: "pointer",
                itemclick: explodePie
            },
            data: [{
                type: "pie",
                showInLegend: true,
                toolTipContent: "{name}: <strong>{y}%</strong>",
                indexLabel: "{name} - {y}%",
                dataPoints: this.props.optionLstPie.length > 0 ? this.props.optionLstPie : [
                    {y: 100, name: "nothing", exploded: true}
                ]
            }]
        };

        // debugger;
        const options = {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Tổng: " + formatNumber(total) + " vnd"
            },
            // axisX: {
            //     title: "Total: " + formatNumber(total) + " vnd",
            //     reversed: true,
            // },
            axisY: {
                title: "VND",
                labelFormatter: this.addSymbols
            },
            data: [{
                type: "bar",
                dataPoints: this.props.optionLst.length > 0 ? this.props.optionLst : [
                    {y: 1000000, label: "Nothing"},
                    {y: 1000000, label: "Nothing"},
                    {y: 1000000, label: "Nothing"},
                    {y: 1000000, label: "Nothing"},
                    {y: 1000000, label: "Nothing"},
                    {y: 1000000, label: "Nothing"},
                    {y: 1000000, label: "Nothing"}
                ]
            }]
        }

        return (
            <div>
                <br/>
                <hr/>
                <h1>Doanh thu theo sản phẩm</h1>
                <table>
                    <tr>
                        <td>
                            <CanvasJSChart options={options}
                                /* onRef={ref => this.chart = ref} */
                            />
                        </td>
                        <td>
                            <CanvasJSChart options={chart}
                                /* onRef={ref => this.chart = ref} */
                            />
                        </td>
                    </tr>
                </table>

                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
        );
    }

}

ProductOptionUsing.propTypes = {
    optionLst: PropTypes.array,
    optionLstPie: PropTypes.array
}

export default ProductOptionUsing;