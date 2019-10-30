import React from 'react';
import ReactDOM from 'react-dom';
import {Form, Input, Image, Loader, Segment, Dimmer, Label} from 'semantic-ui-react';
import {ListRoomRows} from '../components/ListRoomRows';
import 'semantic-ui-css/semantic.min.css';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

export class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadedRooms: false,
            isLoadedParam: false,
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
            'UpdateCheckInRoom',
            'handleChangeRoomIDSelect',
            'handleChangeStatusIDSelect',
            'getListStatus',
            'renderSearchForm',
            'renderListRooms',
            'getroomTypeOther',
            'getlistoption',
            'handleClearSearching',
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    async getListRoomDetails(filter) {
        console.log("getListRoomDetails");
        console.log(filter);
        this.setState({
            isLoadedRooms: false,
        });
        await fetch("https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=listRoomsDetail")
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
                    // debugger;
                    if (filter) {
                        let newstr = strs.filter(function (item) {
                            return item.roomid == filter.id;
                        });
                        this.setState({
                            isLoadedRooms: true,
                            rooms: newstr,
                            roomIds: ids
                        });
                    } else {
                        this.setState({
                            isLoadedRooms: true,
                            rooms: strs,
                            roomIds: ids
                        });
                    }
                }, (error) => {
                    this.setState({
                        isLoadedRooms: false,
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
                        isLoadedParam: true,
                        status: strs,
                        statusIds: ids
                    });
                }, (error) => {
                    this.setState({
                        isLoadedParam: false,
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
                    for (let i = 0; i < result.length; i++) {
                        tmp = JSON.parse(result[i])
                        strs.push(tmp);
                        ids.push(tmp['optionId']);
                    }
                    this.setState({
                        isLoadedParam: true,
                        listoption: strs,
                        listoptionIds: ids
                    });
                }, (error) => {
                    this.setState({
                        isLoadedParam: false,
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
                        isLoadedParam: true,
                        roomTypeOther: strs,
                        roomTypeOtherIds: ids
                    });
                }, (error) => {
                    this.setState({
                        isLoadedParam: false,
                    });
                }
            )
    }

    async UpdateCheckInRoom(id, checkinTime, roomClass, options, totalOptionPrice) {
        let current_datetime = checkinTime;
        let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()
        // debugger;
        let encoded = "checkinTime=" + formatted_date +
            "&roomClass=" + roomClass +
            "&options=" + options +
            "&totalOptionPrice=" + totalOptionPrice;

        await fetch('https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=checkin&id=' + id, {
            method: 'POST',
            body: encoded,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(async function (response) {
            let msgerr = '';
            let isSuccess = false;
            await response.json().then(function (data) {
                console.log(data);
                data['result'] == 'error' ? msgerr = JSON.stringify(data["error"]["message"]) : isSuccess = true;
            });

            let stt = response.status;
            if (stt == 200) {
                if (!msgerr) {
                    toast.success("Đặt phòng thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                } else {
                    toast.error("Error:" + JSON.stringify(msgerr));
                }
            } else {
                toast.error("Something is wrong, please check log for detail!");
            }
        })
    }

    handleClearSearching() {
        this.setState({
            roomidselected: '',
            statusSelected: '',
        });
        this.getListRoomDetails();
    }

    handleChangeRoomIDSelect(event, val = null) {
        if (val == null)
            return;
        this.setState({
            roomidselected: val['value']
        }, () => {
            let filter = {'id': val['value']};
            this.getListRoomDetails(filter);
        });
        // getListRoomDetails
    }

    handleChangeStatusIDSelect(event, val = null) {
        if (val == null)
            return;
        this.setState({
            statusSelected: val['value']
        });
    }

    renderSearchForm() {
        let listRoomIds = this.state.roomIds;
        let listStatusIds = this.state.statusIds;

        if (this.state.isLoadedParam == false) {
            return (<Segment>
                <Dimmer active inverted>
                    <Loader size='large'>Loading</Loader>
                </Dimmer>
                <Image src='images/loader.png'/>
            </Segment>);
        }

        let styleDisable = {'pointerEvents': ''};

        if (!this.state.isLoadedRooms || !this.state.isLoadedParam) {
            styleDisable = {'pointerEvents': 'none'};
        }
        return (
            <Segment padded style={styleDisable}>
                <Label attached='top left' onClick={this.handleClearSearching}>Clear</Label>
                <Input fluid icon='search plus' action='Search' placeholder='Search...'/>
                <br/>
                <Form.Group widths='equal'>
                    <Form.Select
                        fluid
                        icon=''
                        label='RoomID'
                        value={this.state.roomidselected}
                        onChange={this.handleChangeRoomIDSelect}
                        options={listRoomIds}
                        placeholder='RoomIDs'
                    />
                    <Form.Select
                        fluid
                        icon=''
                        label='Status'
                        value={this.state.statusSelected}
                        options={listStatusIds}
                        onChange={this.handleChangeStatusIDSelect}
                        placeholder='Status'
                    />
                </Form.Group>
            </Segment>
        );
    }

    renderListRooms() {
        const {rooms, statusIds, roomTypeOtherIds, listoptionIds, listoption} = {...this.state};

        if (this.state.isLoadedRooms == false) {
            return (<Segment>
                <Dimmer active inverted>
                    <Loader size='large'>Loading</Loader>
                </Dimmer>
                <Image src='images/loader.png'/>
            </Segment>);
        }

        return (
            <Segment padded>
                <Label attached='top'>Room List</Label>
                <ListRoomRows roomsInfo={rooms}
                              statusList={statusIds}
                              roomTypeOther={roomTypeOtherIds}
                              listoptionIds={listoptionIds}
                              listoption={listoption}
                              UpdateCheckInRoom={this.UpdateCheckInRoom}/>
            </Segment>
        );
    }

    componentDidMount() {
        this.getListRoomDetails();
        this.getListStatus();
        this.getroomTypeOther();
        this.getlistoption();
    }

    render() {
        // console.log(this.state.statusIds);
        // console.log(this.state.statusSelected);
        return (
            <div>
                <ToastContainer style={{fontSize: '20px', textAlign: 'center'}}/>
                <Form>
                    {this.renderSearchForm()}
                    {this.renderListRooms()}
                </Form>
                <br/><br/>
            </div>
        );
    }
}
