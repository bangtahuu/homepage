import React from 'react'
import {Button, Form, Header, Image, Label, Modal} from 'semantic-ui-react'
import PropTypes from "prop-types";
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';
import {ListOption} from '../components/ListOption';
import 'semantic-ui-css/semantic.min.css';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

Moment.locale('vn')
momentLocalizer()

export class RoomDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            CheckinTimeSelected: (this.props.roominfo.fromTime ? new Date(this.props.roominfo.fromTime) : new Date()),
            roomCurrentClass: (this.props.roominfo.roomCurrentClass ? this.props.roominfo.roomCurrentClass : ''),
            optionListSelected: (this.props.roominfo.moreOptionId ? JSON.parse(this.props.roominfo.moreOptionId) : ''),
        };

        [
            'checkinRoomSubmit',
            'getStatusDes',
            'onChangePickedTime',
            'handleChangeTypeIDSelect',
            'handleChangeOption',
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    checkinRoomSubmit() {
        // window.location.reload(true);
        let action = 'checkin';
        let roomId = this.props.roominfo.roomid;
        let id = this.props.roominfo.id;
        let checkinTime = this.state.CheckinTimeSelected;
        let roomClass = this.state.roomCurrentClass;
        let options = JSON.stringify(this.state.optionListSelected);

        let totalOptionPrice = 0;
        for (let i = 0; i < this.state.optionListSelected.length; i++) {
            totalOptionPrice = totalOptionPrice + this.state.optionListSelected[i].total;
        }

        if (!checkinTime) {
            toast.error('Bạn chưa chọn giờ vào!');
            return;
        }
        if (!roomClass) {
            toast.error('Bạn chưa chọn loại phòng!');
            return;
        }

        this.props.UpdateCheckInRoom(id, checkinTime, roomClass, options, totalOptionPrice);
    }

    getStatusDes(status = '') {
        let stt = this.props.statusList;
        for (var i = 0; i < stt.length; i++) {
            if (stt[i].key == status) {
                return stt[i].text;
            }
        }
    }

    onChangePickedTime(val) {
        this.setState({
            CheckinTimeSelected: val
        });
    }

    handleChangeTypeIDSelect(event, val = null) {
        if (val == null)
            return;
        this.setState({
            roomCurrentClass: val['value']
        });
    }

    handleChangeOption(data = []) {
        console.log(JSON.stringify(data))
        this.setState({
            optionListSelected: data
        });
    }

    render() {
        const {roominfo, roomTypeOther} = this.props;
        let imgsrc = roominfo.roomid ? 'images/room' + roominfo.roomid + '.png' : 'images/room101.png';

        return (
            <Modal style={{width: '100%'}} closeIcon
                   trigger={<a className="image fit"><img style={{boxShadow: '10px 10px 5px #ccc'}}
                                                          src="images/hotelico.jpeg" alt="Hotel"/></a>}>
                <Modal.Header>Room Detail</Modal.Header>
                <Modal.Content image scrolling style={{height: '450%'}}>
                    <Image size='medium' src={imgsrc} wrapped/>

                    <Modal.Description style={{width: '100%'}}>
                        <Header>{roominfo.roomDescription}</Header>
                        <b>
                            Status: {this.getStatusDes(roominfo.status)}
                        </b>
                        <hr/>
                        <label>
                            <b>Checkin:</b>
                        </label>
                        <div>
                            <DateTimePicker value={this.state.CheckinTimeSelected} onChange={this.onChangePickedTime}/>
                        </div>
                        <hr/>
                        <div>
                            <label>
                                <b>Room Type:</b>
                            </label>
                            <Form.Select
                                fluid
                                icon=''
                                // label='Room Type:'
                                value={this.state.roomCurrentClass}
                                options={roomTypeOther}
                                onChange={this.handleChangeTypeIDSelect}
                                placeholder='Type'
                            />
                        </div>
                        <hr/>
                        <Label as='a' color='teal' ribbon>
                            Thêm Sản Phẩm:
                        </Label>
                        <ListOption listoptionIds={this.props.listoptionIds}
                                    listoption={this.props.listoption}
                                    onChangeOption={this.handleChangeOption}
                                    optionListSelected={this.state.optionListSelected ? this.state.optionListSelected : []}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={this.checkinRoomSubmit}>
                        CheckIn
                    </Button>
                    {/*<Toastr/>*/}
                </Modal.Actions>
            </Modal>
        );
    }
}


RoomDetail.propTypes = {
    roominfo: PropTypes.object,
    statusList: PropTypes.array,
    roomTypeOther: PropTypes.array,
    listoptionIds: PropTypes.array,
    listoption: PropTypes.array,
    UpdateCheckInRoom: PropTypes.func,
}