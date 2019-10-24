import _ from 'lodash'
import React from 'react'
import {Button, Form, Image, Input, List, Transition, Dropdown, Dimmer} from 'semantic-ui-react'
import {Icon} from 'semantic-ui-react'
import PropTypes from "prop-types";
import {Table} from 'semantic-ui-react';
import {Label, Menu} from 'semantic-ui-react';
import TableBT from 'react-bootstrap/Table';
import {Loader, Segment} from 'semantic-ui-react';

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export class ListOption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.listoptionIds.slice(0, this.props.optionListSelected.length),
            option: {
                description: '',
                option_id: 1,
                price: 0,
                quantity: 1
            },
            listoptionIds: [],
            optionListSelected: [],
        };
        [
            'handleAdd',
            'handleRemove',
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    componentDidMount() {
        let listOptionSlt = this.props.optionListSelected;
        let listOptionSltIds = [];
        listOptionSlt.map(item => {
            listOptionSltIds.push(item["option_id"])
        })

        var listOptionIDsTmp = listOptionSltIds.concat(this.props.listoptionIds);
        var listOptionIDsMerge = listOptionIDsTmp.filter((item, pos) => listOptionIDsTmp.indexOf(item) === pos);

        this.setState({
            items: listOptionIDsMerge.slice(0, this.props.optionListSelected.length)
        });


        //get List option for select
        var listoptionIdstmp = {};
        var listoptionIds = [];

        this.props.listoption.map(item => {
            listoptionIdstmp = {}
            listoptionIdstmp['key'] = item['optionId'];
            listoptionIdstmp['text'] = item['description'];
            listoptionIdstmp['value'] = item['optionId'];
            listoptionIds.push(listoptionIdstmp);
        });
        this.setState({
            listoptionIds: listoptionIds,
        });

        //Set value for State: optionListSelected
        this.setState({
            optionListSelected: this.props.optionListSelected
        });

    }

    handleAdd = () =>
        this.setState((prevState) => ({
            items: this.props.listoptionIds.slice(0, prevState.items.length + 1),
        }))

    handleRemove = () =>
        this.setState((prevState) => ({items: prevState.items.slice(0, -1)}))

    render() {
        const {items} = this.state;
        const {listoptionIds} = this.props;
        // console.log(this.props.listoptionIds);
        // console.log(this.props.listoption);
        // console.log(this.state.items);
        // console.log(this.props.optionListSelected);
        // console.log(this.state.listoptionIds)
        // console.log(this.state.optionListSelected);
        // debugger;
        var count = 0;
        return (
            <div>
                <Button.Group>
                    <Button
                        disabled={items.length === 0}
                        icon='minus square'
                        onClick={this.handleRemove}
                    />

                    <Button
                        disabled={items.length === this.props.listoptionIds.length}
                        icon='plus square'
                        onClick={this.handleAdd}
                    />
                </Button.Group>
                <TableBT striped bordered hover style={{width: '100%'}}>
                    <thead>
                    <tr>
                        <th></th>
                        {/*<th>Description</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => (
                        <tr key={item}>
                            <td>
                                {(this.state.optionListSelected && this.state.optionListSelected[count]) ? (
                                    <div>
                                        <label><b>Loại SP:</b></label><br/>
                                        <Dropdown
                                            key={item}
                                            onChange={this.handleChange}
                                            options={this.state.listoptionIds}
                                            placeholder='Choose an option'
                                            value={this.state.optionListSelected[count].option_id}
                                            selection
                                        />
                                        <hr/>
                                        <label><b>Số lượng:</b></label><br/>
                                        <Input type="number" value={this.state.optionListSelected[count].quantity}/>
                                        <hr/>
                                        <p>Số tiền/1 sp: <b>{formatNumber(this.state.optionListSelected[count].price)} VND</b></p>
                                        <div hidden>{count = count + 1}</div>
                                    </div>
                                ) :
                                    (<Segment>
                                        <Dimmer active inverted>
                                            <Loader size='large'>Loading</Loader>
                                        </Dimmer>
                                        <Image src='images/loader.png'/>
                                    </Segment>)
                                }
                                {/*<label><b>Loại SP:</b></label><br/>*/}
                                {/*<Dropdown*/}
                                {/*    key={item}*/}
                                {/*    onChange={this.handleChange}*/}
                                {/*    options={this.state.listoptionIds}*/}
                                {/*    placeholder='Choose an option'*/}
                                {/*    selection*/}
                                {/*/>*/}
                                {/*<hr/>*/}
                                {/*<label><b>Số lượng:</b></label><br/>*/}
                                {/*<Input type="number"/>*/}
                                {/*<hr/>*/}

                                {/*/!*<p>Số tiền/1 sp: <b>{formatNumber(item.price)} VND</b></p>*!/*/}
                                {/*<p>Số tiền/1 sp: <b>{formatNumber((optionListSelected && optionListSelected[count]) ? optionListSelected[count].price : 0 )} VND</b></p>*/}
                                {/*<div hidden>{count = count + 1}</div>*/}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </TableBT>
            </div>
        )
    }
}

ListOption.propTypes = {
    listoptionIds: PropTypes.array,
    listoption: PropTypes.array,
    optionListSelected: PropTypes.array,
}