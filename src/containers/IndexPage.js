import React from 'react';
import ReactDOM from 'react-dom';
import {Form} from 'semantic-ui-react';
import {Button, Card, Image} from 'semantic-ui-react';
import {Input} from 'semantic-ui-react';
import {Loader, Segment} from 'semantic-ui-react';
import {ListRoomRows} from '../components/ListRoomRows';
import { Dimmer } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';


export class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            rooms: [],
            roomIds: [],
            status: [],
            statusIds: [],
            roomTypeOther: [],
            roomTypeOtherIds: [],
            listoption: [],
            listoptionIds: [],
            roomidselected: '',
            statusSelected: ''
        };

        [
            'getListRoomDetails',
            'setListRoom',
            'handleChangeRoomIDSelect',
            'handleChangeStatusIDSelect',
            'getListStatus',
            'renderSearchForm',
            'renderListRooms',
            'getroomTypeOther',
            'getlistoption'
        ].forEach((method) => this[method] = this[method].bind(this));
    }


    getListRoomDetails() {
        fetch("https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=listRoomsDetail")
            .then(res => res.json())
            .then(
                (result) => {
                    let strs = [];
                    let ids = [];
                    let tmp = [];
                    let tmp2 = {};
                    for (let i = 0; i < result.length; i++) {
                        tmp = JSON.parse(result[i])
                        strs.push(tmp);
                        tmp2 = {};
                        tmp2['key'] = tmp['roomid'];
                        tmp2['text'] = tmp['roomDescription'];
                        tmp2['value'] = tmp['roomid'];
                        ids.push(tmp2);
                    }
                    this.setState({
                        isLoaded: true,
                        rooms: strs,
                        roomIds: ids
                    });
                }, (error) => {
                    this.setState({
                        isLoaded: false,
                    });
                }
            )
    }

    getListStatus() {
        fetch("https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=listStatus")
            .then(res => res.json())
            .then(
                (result) => {
                    let strs = [];
                    let ids = [];
                    let tmp = [];
                    let tmp2 = {};
                    for (let i = 0; i < result.length; i++) {
                        tmp = JSON.parse(result[i])
                        strs.push(tmp);
                        tmp2 = {};
                        tmp2['key'] = tmp['statusId'];
                        tmp2['text'] = tmp['description'];
                        tmp2['value'] = tmp['statusId'];
                        ids.push(tmp2);
                    }
                    this.setState({
                        status: strs,
                        statusIds: ids
                    });
                }, (error) => {
                    this.setState({
                        isLoaded: false,
                    });
                }
            )
    }

    getlistoption() {
        fetch("https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=listoption")
            .then(res => res.json())
            .then(
                (result) => {
                    let strs = [];
                    let ids = [];
                    let tmp = [];
                    let tmp2 = {};
                    for (let i = 0; i < result.length; i++) {
                        tmp = JSON.parse(result[i])
                        strs.push(tmp);
                        tmp2 = {};
                        tmp2['key'] = tmp['optionId'];
                        tmp2['text'] = tmp['description'];
                        tmp2['value'] = tmp['optionId'];
                        ids.push(tmp2);
                    }
                    this.setState({
                        listoption: strs,
                        listoptionIds: ids
                    });
                }, (error) => {
                    this.setState({
                        isLoaded: false,
                    });
                }
            )
    }

    getroomTypeOther() {
        fetch("https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=PricebyOther")
            .then(res => res.json())
            .then(
                (result) => {
                    let strs = [];
                    let ids = [];
                    let tmp = [];
                    let tmp2 = {};
                    for (let i = 0; i < result.length; i++) {
                        tmp = JSON.parse(result[i])
                        strs.push(tmp);
                        tmp2 = {};
                        tmp2['key'] = tmp['roomType'];
                        tmp2['text'] = tmp['description'];
                        tmp2['value'] = tmp['roomType'];
                        ids.push(tmp2);
                    }
                    this.setState({
                        roomTypeOther: strs,
                        roomTypeOtherIds: ids
                    });
                }, (error) => {
                    this.setState({
                        isLoaded: false,
                    });
                }
            )
    }

    setListRoom() {
        let Name = "1";
        let Phone = "2";
        let Company = "3";
        let Company_Address = "4";
        let isICMCenter = "5";
        let RangeIncome = "6";
        let Product = "7";
        let encoded = "Name=" + Name + "&Phone=" + Phone + "&Company=" + Company + "&Company_Address=" + Company_Address + "&isICMCenter=" + isICMCenter + "&RangeIncome=" + RangeIncome + "&Product=" + Product;

        fetch('https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec', {
            method: 'POST',
            body: encoded,
            // body: JSON.stringify({
            //     title: 'New title added',
            //     body: 'New body added. Hello body.'
            // }),
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(response => {
            console.log(response.json());
        }).then(json => {
            console.log(json);
            // this.setState({
            //     user:json
            // });
        });
    }

    renderSearchForm() {
        let listRoomIds = this.state.roomIds;
        let listStatusIds = this.state.statusIds;

        return (
            <div>
                <Input fluid icon='search plus' action='Search' placeholder='Search...'/>
                <br/>
                <Form.Group widths='equal'>
                    <Form.Select
                        fluid
                        icon =''
                        label='RoomID'
                        onChange={this.handleChangeRoomIDSelect}
                        options={listRoomIds}
                        placeholder='RoomIDs'
                    />
                    <Form.Select
                        fluid
                        icon=''
                        label='Status'
                        options={listStatusIds}
                        onChange={this.handleChangeStatusIDSelect}
                        placeholder='Status'
                    />
                </Form.Group>
            </div>
        );
    }

    renderListRooms() {
        return (
            <ListRoomRows roomsInfo={this.state.rooms}
                          statusList={this.state.statusIds}
                          roomTypeOther={this.state.roomTypeOtherIds}
                          listoptionIds={this.state.listoptionIds}
                          listoption={this.state.listoption} />
        );
    }

    handleChangeRoomIDSelect(event, val = null) {
        if (val == null)
            return;
        this.setState({
            roomidselected: val['value']
        });
    }

    handleChangeStatusIDSelect(event, val = null) {
        if (val == null)
            return;
        this.setState({
            statusSelected: val['value']
        });
    }

    componentDidMount() {
        this.getListRoomDetails();
        this.getListStatus();
        this.getroomTypeOther();
        this.getlistoption();
    }

    render() {
        if (this.state.isLoaded == false) {
            return (<Segment>
                        <Dimmer active inverted>
                            <Loader size='large'>Loading</Loader>
                        </Dimmer>
                        <Image src='images/loader.png'/>
                    </Segment>);
        }
        // console.log(this.state.statusIds);
        // console.log(this.state.statusSelected);
        return (
            <div>
                <Form>
                    {this.renderSearchForm()}
                    {this.renderListRooms()}
                </Form>
                <br/><br/>
            </div>
        );
    }
}
