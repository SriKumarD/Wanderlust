import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import {backendUrlBooking} from '../BackendURL';
import { ProgressSpinner } from 'primereact/progressspinner';

class ViewBookings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            dialog_visible: false,
            name:"",
            in:"",
            out:"",
            charges:"",
            bid:"",
            
        }
    }
    componentDidMount() {
        axios.get(backendUrlBooking+"/booking/"+ sessionStorage.getItem('userId')).then(response => {
            this.setState({ bookings: response.data })
            console.log(this.state.bookings)
            console.log(response)
        }).catch(error => {
            this.setState({ bookings: [] })
        })
    }
    onHide = (event) => {
        this.setState({ dialog_visible: false });
    }

    cancel = (id) => {
        this.setState({ dialog_visible: false });
        axios.delete(backendUrlBooking+"/cancelBooking/"+id).then(response=>{
        console.log(response.data)
        // window.location.replace("http://localhost:3000/viewBookings");
        this.setState({bookings:response.data})
    }).catch(error => {
        this.setState({ bookings: [] })
    })
    }
    displayCards = () => {
        if (this.state.bookings.length != 0) {
            
            let mycards = []
            for (let card of this.state.bookings) {
                
                let element = (
                    <div className="card bg-light text-dark col-md-8 offset-2 viewBookings">
                        <div className="card-header text-left">
                            Booking Id:{card.bookingId}
                        </div>
                        <div className='card-body row'>
                            <div className="col-md-9 text-left"><h1>{card.destinationName}</h1></div>
                            <div className="col-md-6 text-left">

                                <div>Trip starts on:{card.checkInDate.slice(0, 10)}</div>

                                <div>Trip ends on:{card.checkOutDate.slice(0, 10)}</div>
                                <div>Travellers:{card.noOfPersons}</div>
                            </div>
                            <div className="col-md-6 text-left">

                                <div>Fare Details</div>
                                <div>Rs.{card.totalCharges}</div>
                                <div><button className="btn btn-link" 
                                onClick={(e) => { this.setState({ dialog_visible: true,name:card.destinationName,in:card.checkInDate.slice(0, 10),out:card.checkOutDate.slice(0, 10),charges:card.totalCharges,bid:card.bookingId }) }}>
                                    Claim refund</button></div>
                            </div>
                        </div>
                        <div className="card-footer">
                            
                        </div>
                        
                    </div>
                )
                mycards.push(element)
            }
            return mycards

        }
        else {
            return (<div className="viewBookings">
                <div >
                    <h1>Sorry You have not planned any trips with us yet!</h1>
                </div>
                    <Link to='/' className="btn btn-success" style={{marginRight:"45%"}}>CLICK HERE START BOOKING</Link>
            </div>)
        }
    }

    render() {
        
        const footer = (
            <div>
                <Button label="BACK" icon="pi pi-check" onClick={this.onHide} />
                <Button label="CONFIRM CANCELLATION" icon="pi pi-times" onClick={()=>{this.cancel(this.state.bid)}} className="p-button-secondary" />
            </div>
                );

        return (
            <div>
                {this.displayCards()}
                <div className="content-section implementation">
                            <Dialog className="text-left"
                                header="Confirm Cancellation"
                                visible={this.state.dialog_visible}
                                style={{ width: '50vw' }}
                                footer={footer}
                                onHide={this.onHide}
                                maximizable
                            >
                                <div className="text-danger">Are you sure you want to cancel your trip to {this.state.name}?</div>
                                <div>Trip starts on:{this.state.in}</div>

                                <div>Trip ends on:{this.state.out}</div>
                                
                                <div>Refund Amount:${this.state.charges}</div>
                            </Dialog>
                        </div>

            </div>

        );
    }
}

export default ViewBookings;