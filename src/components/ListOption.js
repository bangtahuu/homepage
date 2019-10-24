import _ from 'lodash'
import React from 'react'
import {Button, Form, Image, Input, List, Transition, Dropdown} from 'semantic-ui-react'
import {Icon} from 'semantic-ui-react'
import PropTypes from "prop-types";
import {Table} from 'semantic-ui-react';

let users = [];

export class ListOption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // items: users.slice(0, 0)
            items: this.props.listoption.slice(0, 0)
        };
    }

    componentDidMount() {
        this.props.optionListSelected.map(item => {
            console.log(item)
        });
    }

    handleAdd = () =>
        this.setState((prevState) => ({
            items: this.props.listoption.slice(0, prevState.items.length + 1),
        }))

    handleRemove = () =>
        this.setState((prevState) => ({items: prevState.items.slice(0, -1)}))

    render() {
        const {items} = this.state;
        const {listoptionIds} = this.props;
        // console.log(this.props.listoptionIds);
        console.log(this.props.listoption);
        // console.log(this.state.items);
        console.log(this.props.optionListSelected);
        return (
            <div>
                <Button.Group>
                    <Button
                        disabled={items.length === 0}
                        icon='minus square'
                        onClick={this.handleRemove}
                    />

                    <Button
                        disabled={items.length === this.props.listoption.length}
                        icon='plus square'
                        onClick={this.handleAdd}
                    />
                </Button.Group>
                <Table >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell></Table.HeaderCell>
                            {/*<Table.HeaderCell>ID</Table.HeaderCell>*/}
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Price/1prd</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {items.map((item) => (
                            <Table.Row key={item.optionId}>
                                <Table.Cell>
                                    <Button
                                        disabled={items.length === 0}
                                        icon='minus square'
                                        onClick={this.handleRemove}
                                    />
                                </Table.Cell>
                                {/*<Table.Cell>{item.optionId}</Table.Cell>*/}
                                <Table.Cell>
                                    {/*<Form.Select*/}
                                    {/*    fluid*/}
                                    {/*    icon=''*/}
                                    {/*    options={listoptionIds}*/}
                                    {/*    onChange={this.handleChangeTypeIDSelect}*/}
                                    {/*    placeholder='Options'*/}
                                    {/*/>*/}
                                    <Dropdown
                                        onChange={this.handleChange}
                                        options={listoptionIds}
                                        placeholder='Choose an option'
                                        selection
                                    />
                                </Table.Cell>
                                <Table.Cell><Input type="number"/></Table.Cell>
                                <Table.Cell>{item.price}</Table.Cell>
                            </Table.Row>
                        ))}
                        {this.props.listoption.map((item) => (
                            <Table.Row warning key={item.optionId}>
                                <Table.Cell></Table.Cell>
                                <Table.Cell></Table.Cell>
                                <Table.Cell></Table.Cell>
                                <Table.Cell></Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            {/*<Table.HeaderCell></Table.HeaderCell>*/}
                            <Table.HeaderCell></Table.HeaderCell>
                            <Table.HeaderCell>Total:</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
        )
    }
}

ListOption.propTypes = {
    listoptionIds: PropTypes.array,
    listoption: PropTypes.array,
    optionListSelected: PropTypes.array,
}