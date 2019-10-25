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
            'handleAdd',
            'handleRemove',
            'handleChangeDropdown',
            'handleChangeQuantityOld',
            'handleChangeQuantity'
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

    handleAdd = () => {
        let optionListSelected = this.state.optionListSelected;
        optionListSelected.push(this.state.option);
        this.setState((prevState) => ({
            items: this.props.listoptionIds.slice(0, prevState.items.length + 1),
            optionListSelected: optionListSelected
        }));
    }

    handleRemove = () =>
        this.setState((prevState) => ({items: prevState.items.slice(0, -1)}))

    handleChangeQuantityOld = (event, data, itempar) => {
        console.log(event.target);
        console.log(data);
        console.log(itempar);

        const optionListSelected = this.state.optionListSelected;
        for (let i = 0; i < optionListSelected.length; i++) {
            if (optionListSelected[i].option_id == itempar) {
                optionListSelected[i].quantity = data.value;
                break;
            }
        }

        this.setState({
            optionListSelected: optionListSelected
        });
    }

    handleChangeQuantity(event, data) {
        console.log(event);
        console.log(data.value);

        let listoption = this.props.listoption;
        listoption['quantity'] =  data.value
        this.setState({
            option: listoption,
        });
    }

    handleChangeDropdown(event, data) {
        console.log(event);
        console.log(data.value);

        const listoption = this.props.listoption;
        for (let i = 0; i < listoption.length; i++) {
            console.log(listoption[i]);
            if(listoption[i].optionId == data.value){
                let tmp = listoption[i];
                tmp['option_id'] = listoption[i].optionId;
                tmp['quantity'] = 1;
                console.log(tmp);
                this.setState({
                    option: tmp,
                });
                break;
            }
        }
    }

    render() {
        const {items} = this.state;
        const {listoptionIds} = this.props;
        // console.log(this.props.listoptionIds);
        console.log(this.props.listoption);
        // console.log(this.state.items);
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
                                    <Statistic.Value>{formatNumber(1000000)}</Statistic.Value>
                                    <Statistic.Label>vnd</Statistic.Label>
                                </Statistic>
                                <Button content='Add' icon='plus square' size='big' color='grey'/>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </div>
                <Button.Group>
                </Button.Group>
                <TableBT size="sm" striped bordered hover style={{width: '100%'}}>
                    <thead>
                    <tr>
                        <th>Chi tiết</th>
                        <th>
                            <Button
                                label='Remove'
                                disabled={items.length === 0}
                                icon='minus square'
                                onClick={this.handleRemove}
                                floated='right'
                            />
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => (
                        <tr key={item}>
                            {(this.state.optionListSelected && this.state.optionListSelected[count]) && (
                                [<td key={item}>
                                    <b>{this.state.optionListSelected[count].quantity} - {this.state.optionListSelected[count].description}</b>
                                </td>,
                                    <td key={item + 1}>
                                        <b style={{float: 'right'}}><Label as='a' color='olive' tag
                                                                           size='large'>{formatNumber(this.state.optionListSelected[count].total)} VND</Label></b>
                                        <p hidden>{count = count + 1}</p>
                                    </td>]
                            )
                            }
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