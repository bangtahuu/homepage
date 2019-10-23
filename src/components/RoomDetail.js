import _ from 'lodash'
import React from 'react'
import { Button, Header, Icon, Image, Modal } from 'semantic-ui-react'
import PropTypes from "prop-types";

export class RoomDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };

        this.redirectLink = this.redirectLink.bind(this);
    }

    redirectLink(){
        let link =window.location.href;
        window.location.href = link;
    }

    render(){
        return (
            <Modal closeIcon trigger={<a className="image fit"><img style={{boxShadow: '10px 10px 5px #ccc'}} src="images/hotelico.jpeg" alt="Hotel"/></a>}>
                <Modal.Header>Profile Picture</Modal.Header>
                <Modal.Content image scrolling>
                    <Image size='medium' src='images/rom101.png' wrapped />

                    <Modal.Description>
                        <Header>Modal Header</Header>
                        <p>
                            This is an example of expanded content that will cause the modal's
                            dimmer to scroll
                        </p>
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

}