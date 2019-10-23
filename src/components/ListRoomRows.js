import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Rail, Segment } from 'semantic-ui-react'

export class ListRoomRows extends React.Component {
    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
    }

    renderRow() {
        const {roomInfo} = this.props;
        return Array.prototype.map.call(roomInfo, (room) => (
            <div className="col-3 col-12-mobile" key={room.roomid}>
                <article className="item">
                    <div className="image fitfull">
                        <a className="image fit"><img style={{boxShadow: '10px 10px 5px #ccc'}} src="images/hotelico.jpeg" alt="Hotel"/></a>
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
    roomInfo: []
}

ListRoomRows.propTypes = {
    roomInfo: PropTypes.array
}

