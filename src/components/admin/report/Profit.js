import React, {Component} from 'react';
import CanvasJSReact from '../../../assets/js/canvasjs.react';
import PropTypes from "prop-types";
import ProductOptionUsing from "./ProductOptionUsing";

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Profit extends Component {


    render() {
        let total = 0;
        for (let i = 0; i < this.props.optionLst.length; i++) {
            let item = this.props.optionLst[i];
            total = total + item['y'];
        }
        let options = {
            animationEnabled: true,
            theme: "light2", //"light1", "dark1", "dark2"
            title: {
                text: this.props.optionLst.length > 0 ? "Chi phí tháng " + this.props.yearmonth + "  -  " + formatNumber(total) + " vnđ" : "Không có chi phí phát sinh trong tháng " + this.props.yearmonth.substr(5, 6)
            },
            data: [{
                type: "funnel",
                indexLabelPlacement: "inside",
                indexLabelFontColor: "white",
                toolTipContent: "<b>{label}</b>: {y} <b>({percentage}%)</b>",
                indexLabel: "{label} (vnđ)",
                dataPoints: this.props.optionLst.length > 0 ? this.props.optionLst : [
                    {y: 0, label: "Nothing"}
                ]
            }]
        };

        return (
            <div>
                <br/>
                <hr/>
                <CanvasJSChart options={options}/>
            </div>
        );
    }
}

Profit.propTypes = {
    yearmonth: PropTypes.string,
    optionLst: PropTypes.array
}

export default Profit;