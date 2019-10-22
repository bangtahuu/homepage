import React from 'react';
import ReactDOM from 'react-dom';
import {forEach} from "react-bootstrap/esm/utils/ElementChildren";
import {Card,Button, Form, Row, Col, FormControl, FormCheck} from 'react-bootstrap';
import { Dropdown } from 'semantic-ui-react'

export class ListRoomPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            room: {
                Name: '',
                Company: '',
                Phone: '',
                Product: '',
                Company_Address: '',
                RangeIncome: '',
                isICMCenter: '',
            },
            rooms: [],
        };

        this.getListRoom = this.getListRoom.bind(this);
        this.setListRoom = this.setListRoom.bind(this);
    }



    getListRoom() {
        // fetch("https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=listoption")
        fetch("https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=listRooms")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        // rooms: result,
                        rooms: result
                    });

                    console.log(result[0]);

                }, (error) => {
                    this.setState({
                        isLoaded: true,
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

    render() {
        const friendOptions = [
            {
                key: 'Jenny Hess',
                text: 'Jenny Hess',
                value: 'Jenny Hess',
                image: {avatar: true, src: '/images/avatar/small/jenny.jpg'},
            },
            {
                key: 'Elliot Fu',
                text: 'Elliot Fu',
                value: 'Elliot Fu',
                image: {avatar: true, src: '/images/avatar/small/elliot.jpg'},
            },
            {
                key: 'Stevie Feliciano',
                text: 'Stevie Feliciano',
                value: 'Stevie Feliciano',
                image: {avatar: true, src: '/images/avatar/small/stevie.jpg'},
            },
        ];

        return (
            <div>

                <Form>
                    <Row>
                        <Col>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>

                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formBasicPassword">
                                <Dropdown
                                    placeholder='Select Friend'
                                    fluid
                                    selection
                                    options={friendOptions}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Control type="email" placeholder="Enter email"/>
                        </Col>
                        <Col>
                            <Form.Control type="password" placeholder="Password"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Col>
                        <Col/>
                    </Row>
                </Form>
                <div className="row">
                    <div className="col-3 col-12-mobile">
                        <article className="item">
                            <div className="image fitfull">
                                <a className="image fit"><img src="images/hotelico.jpeg" alt="Hotel"/></a>
                            </div>
                            <header>
                                <h3>Room 101</h3>
                            </header>
                        </article>
                    </div>
                    <div className="col-3 col-12-mobile">
                        <article className="item">
                            <div className="image fitfull">
                                <a className="image fit"><img src="images/hotelico.jpeg" alt="Hotel"/></a>
                            </div>
                            <header>
                                <h3>Room 101</h3>
                            </header>
                        </article>
                    </div>
                    <div className="col-3 col-12-mobile">
                        <article className="item">
                            <div className="image fitfull">
                                <a className="image fit"><img src="images/hotelico.jpeg" alt="Hotel"/></a>
                            </div>
                            <header>
                                <h3>Room 101</h3>
                            </header>
                        </article>
                    </div>
                    <div className="col-3 col-12-mobile">
                        <article className="item">
                            <div className="image fitfull">
                                <a className="image fit"><img src="images/hotelico.jpeg" alt="Hotel"/></a>
                            </div>
                            <header>
                                <h3>Room 101</h3>
                            </header>
                        </article>
                    </div>
                    <div className="col-3 col-12-mobile">
                        <article className="item">
                            <div className="image fitfull">
                                <a className="image fit"><img src="images/hotelico.jpeg" alt="Hotel"/></a>
                            </div>
                            <header>
                                <h3>Room 101</h3>
                            </header>
                        </article>
                    </div>
                    <div className="col-3 col-12-mobile">
                        <article className="item">
                            <div className="image fitfull">
                                <a className="image fit"><img src="images/hotelico.jpeg" alt="Hotel"/></a>
                            </div>
                            <header>
                                <h3>Room 101</h3>
                            </header>
                        </article>
                    </div>
                    <div className="col-3 col-12-mobile">
                        <article className="item">
                            <div className="image fitfull">
                                <a className="image fit"><img src="images/hotelico.jpeg" alt="Hotel"/></a>
                            </div>
                            <header>
                                <h3>Room 101</h3>
                            </header>
                        </article>
                    </div>
                    <div className="col-3 col-12-mobile">
                        <article className="item">
                            <div className="image fitfull">
                                <a className="image fit"><img src="images/hotelico.jpeg" alt="Hotel"/></a>
                            </div>
                            <header>
                                <h3>Room 101</h3>
                            </header>
                        </article>
                    </div>
                </div>
            </div>
        );
    }
}
