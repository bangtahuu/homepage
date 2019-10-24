import React from 'react'
import {Button, Form, Header, Icon, Image, Modal} from 'semantic-ui-react'
import PropTypes from "prop-types";
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';
import { ListOption } from '../components/ListOption';
import 'semantic-ui-css/semantic.min.css';

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
            'redirectLink',
            'getStatusDes',
            'onChangePickedTime',
            'handleChangeTypeIDSelect'
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    redirectLink() {
        let link = window.location.href;
        window.location.href = link;
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

    render() {
        const {roominfo, roomTypeOther} = this.props;
        let imgsrc = roominfo.roomid ? 'images/room' + roominfo.roomid + '.png' : 'images/room101.png';

        return (
            <Modal style={{width: '100%'}} closeIcon trigger={<a className="image fit"><img style={{boxShadow: '10px 10px 5px #ccc'}}
                                                                    src="images/hotelico.jpeg" alt="Hotel"/></a>}>
                <Modal.Header>Room Detail</Modal.Header>
                <Modal.Content image scrolling style={{height: '450%'}}>
                    <Image size='medium' src={imgsrc} wrapped/>

                    <Modal.Description style={{width: '100%'}}>
                        <Header>{roominfo.roomDescription}</Header>
                        <p>
                            Status: {this.getStatusDes(roominfo.status)}
                        </p>
                        <hr/>
                        <label>
                            <b>Checkin:</b>
                        </label>
                        <div>
                            <DateTimePicker value={this.state.CheckinTimeSelected} onChange={this.onChangePickedTime}/>
                        </div>
                        <hr/>
                        <div>
                            <Form.Select
                                fluid
                                icon=''
                                label='Room Type:'
                                value={this.state.roomCurrentClass}
                                options={roomTypeOther}
                                onChange={this.handleChangeTypeIDSelect}
                                placeholder='Type'
                            />
                        </div>
                        <hr/>
                        <p>Add Options:</p>
                        <ListOption listoptionIds={this.props.listoptionIds}
                                    listoption={this.props.listoption}
                                    optionListSelected={this.state.optionListSelected}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={this.redirectLink}>
                        {/*<a href="http://localhost:3000/" style={{color: 'white'}}>Proceed</a>*/}
                        Proceed
                    </Button>
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
}