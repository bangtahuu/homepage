import React from 'react';
import PropTypes from 'prop-types';
import { RoomDetail } from '../components/RoomDetail';
import 'semantic-ui-css/semantic.min.css';

export class ListRoomRows extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          open: false
        };

        [
            'renderRow',
            'refreshPage'
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    refreshPage(){

    }

    renderDetail(room = []){
        return <RoomDetail roominfo={room}
                           statusList={this.props.statusList}
                           roomTypeOther={this.props.roomTypeOther}
                           listoptionIds={this.props.listoptionIds}
                           listoption={this.props.listoption}
                           UpdateCheckInRoom={this.props.UpdateCheckInRoom}/>;
    }

    renderRow() {
        const {roomsInfo} = this.props;
        return Array.prototype.map.call(roomsInfo, (room) => (
            <div className="col-3 col-12-mobile" key={room.roomid}>
                <article className="item">
                    <div className="image fitfull">
                        {this.renderDetail(room)}
                        {/*<a className="image fit"><img style={{boxShadow: '10px 10px 5px #ccc'}} src="images/hotelico.jpeg" alt="Hotel"/></a>*/}
                    </div>
                    <header>
                        {room.status == 1 ? <h2 style={{backgroundColor: '#e1eaea'}}>Room {room.roomid}</h2> : <h2 style={{backgroundColor: '#ffd633'}}>Room {room.roomid}</h2>}
                    </header>
                </article>
            </div>
        ));
    }

    render() {
        // console.log(this.props.roomInfo);
        return (
            <div className="row">
                {this.renderRow()}
            </div>

        );
    }
}

ListRoomRows.defaultProps = {
    roomsInfo: []
}

ListRoomRows.propTypes = {
    roomsInfo: PropTypes.array,
    statusList: PropTypes.array,
    roomTypeOther: PropTypes.array,
    listoptionIds: PropTypes.array,
    listoption: PropTypes.array,
    UpdateCheckInRoom: PropTypes.func,
}

