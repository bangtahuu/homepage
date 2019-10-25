import _ from 'lodash'
import React from 'react'
import {Button, Form, Image, Input, List, Transition, Dropdown, Dimmer} from 'semantic-ui-react'
import {Icon} from 'semantic-ui-react'
import PropTypes from "prop-types";
import {Table} from 'semantic-ui-react';
import {Menu} from 'semantic-ui-react';
import TableBT from 'react-bootstrap/Table';
import {Loader, Segment} from 'semantic-ui-react';
import {Divider, Header, Grid, Label, Statistic} from 'semantic-ui-react'

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
                option_id: null,
                price: 0,
                quantity: 0,
                total: 0
            },
            listoptionIds: [],
            optionListSelected: [],
        };
        [
            'handleChangeDropdown',
            'handleChangeQuantity',
            'handleAddRow',
            'handleRemoveRow',
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    componentDidMount() {
        let listOptionSlt = this.props.optionListSelected;
        let listOptionSltIds = [];
        listOptionSlt && listOptionSlt.map(item => {
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

    handleAddRow() {
        const option = this.state.option;
        const optionListSelected = this.state.optionListSelected
        optionListSelected.push(option);
        this.setState({
            optionListSelected: optionListSelected
        });

        this.props.onChangeOption(optionListSelected);
    }

    handleRemoveRow() {
        const optionListSelected = this.state.optionListSelected
        optionListSelected.pop();
        this.setState({
            optionListSelected: optionListSelected
        });

        this.props.onChangeOption(optionListSelected);
    }

    handleChangeQuantity(event, data) {
        let option = this.state.option;
        option['quantity'] = data.value;
        option['total'] = data.value * option['price']

        this.setState({
            option: option,
        });
    }

    handleChangeDropdown(event, data) {
        const listoption = this.props.listoption;
        for (let i = 0; i < listoption.length; i++) {
            if (listoption[i].optionId == data.value) {
                let tmp = listoption[i];
                tmp['option_id'] = listoption[i].optionId;
                tmp['quantity'] = 1;
                tmp['total'] = tmp['price'];
                this.setState({
                    option: tmp,
                });
                break;
            }
        }
    }

    render() {
        let items = this.state.optionListSelected;
        const {listoptionIds} = this.props;
        // console.log(this.props.listoptionIds);
        // console.log(this.props.listoption);
        // console.log(this.props.optionListSelected);
        // console.log(this.state.listoptionIds)
        // console.log(this.state.optionListSelected);
        // debugger;
        var count = 0;
        return (
            <div>
                <div>
                    <Segment placeholder textAlign='center'>
                        <Grid columns={1} relaxed='very' stackable>
                            <Grid.Column>
                                <Form>
                                    <Label>Loại SP:</Label>
                                    <Dropdown
                                        options={this.state.listoptionIds}
                                        value={this.state.option.option_id}
                                        placeholder='Choose an option'
                                        selection
                                        onChange={this.handleChangeDropdown}
                                    />
                                    <br/>
                                    <br/>
                                    <Label>Số lượng:</Label>
                                    <Input
                                        disabled={this.state.option.option_id == 0 || this.state.option.option_id == null}
                                        placeholder='...'
                                        type='number'
                                        max='100'
                                        min='0'
                                        value={this.state.option.quantity}
                                        onChange={this.handleChangeQuantity}
                                    />
                                    <br/>
                                    <br/>
                                    <Label> Số tiền/1
                                        sp: <b>{formatNumber(this.state.option.price)} VND</b>
                                    </Label>
                                </Form>

                                <Divider horizontal>Total</Divider>

                                <Statistic horizontal size='tiny'>
                                    <Statistic.Value>{formatNumber(this.state.option.total)}</Statistic.Value>
                                    <Statistic.Label>vnd</Statistic.Label>
                                </Statistic>
                                <Button content='Add' icon='plus square' size='big' color='grey'
                                        onClick={this.handleAddRow}
                                        disabled={this.state.option.option_id == 0 || this.state.option.option_id == null || this.state.option.quantity == 0} />
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </div>
                <Button.Group>
                </Button.Group>
                {items ? <TableBT size="sm" striped bordered hover style={{width: '100%'}}>
                    <thead>
                    <tr>
                        <th></th>
                        <th>
                            <Button
                                label='Remove'
                                disabled={items.length === 0}
                                icon='minus square'
                                onClick={this.handleRemoveRow}
                                floated='right'
                            />
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => (
                        <tr key={Math.random()}>
                            {(item) && (
                                [<td key={Math.random()}>
                                    <b>{item.quantity} - {item.description}</b>
                                </td>,
                                <td key={Math.random()}>
                                    <b style={{float: 'right'}}><Label as='a' color='olive' tag
                                                                       size='large'>{formatNumber(item.total)} VND</Label></b>
                                    <p hidden>{count = count + 1}</p>
                                </td>]
                            )
                        }
                        </tr>
                    ))}
                    </tbody>
                </TableBT> : <div></div>
                }
            </div>
        )
    }
}

ListOption.propTypes = {
    listoptionIds: PropTypes.array,
    listoption: PropTypes.array,
    optionListSelected: PropTypes.array,
    onChangeOption: PropTypes.func,
}