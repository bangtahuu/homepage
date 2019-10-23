import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Rail, Segment } from 'semantic-ui-react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { RoomDetail } from '../components/RoomDetail';
import { RoomDetailModel } from '../components/RoomDetailModel';

export class ListRoomRows extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          open: false
        };
        this.renderRow = this.renderRow.bind(this);
        this.refreshPage = this.refreshPage.bind(this);
    }

    refreshPage(){

    }

    renderDetail(){
        return <RoomDetail />;
    }

    renderRow() {
        const {roomInfo} = this.props;
        return Array.prototype.map.call(roomInfo, (room) => (
            <div className="col-3 col-12-mobile" key={room.roomid}>
                <article className="item">
                    <div className="image fitfull">
                        {this.renderDetail()}
                        {/*<a className="image fit"><img style={{boxShadow: '10px 10px 5px #ccc'}} src="images/hotelico.jpeg" alt="Hotel"/></a>*/}
                    </div>
                    <header>
                        {room.status == 1 ? <h2 style={{backgroundColor: '#ffd633'}}>Room {room.roomid}</h2> : <h2 style={{backgroundColor: '#e1eaea'}}>Room {room.roomid}</h2>}
                    </header>
                </article>
            </div>
        ));
    }

    render() {
        console.log(this.props.roomInfo);
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
    roomsInfo: PropTypes.array
}

