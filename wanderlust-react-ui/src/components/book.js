import React, { Component } from 'react';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Link, Redirect } from 'react-router-dom';
import { Fieldset } from 'primereact/fieldset';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import {InputSwitch} from 'primereact/inputswitch';
import { backendUrlBooking } from '../BackendURL';

class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      dayone: '',
      middle: [],
      lastday: '',
      name: "",
      panelCollapsed: true,
      panelCollapsed1: true,
      panelCollapsed2: true,
      noof:sessionStorage.getItem("noOf"),
      date:sessionStorage.getItem("date"),
      outdate:sessionStorage.getItem("outdate"),
      cost:sessionStorage.getItem("cost"),
      discount:sessionStorage.getItem("discount"),
      checked1:false,
      button:false,
      cancel:false,
      noOfNights:"",
      chargesPerPerson:"",
      flightCharges:"",
      noOfNights:"",
      confirm:true,
      date1:sessionStorage.getItem("date"),
      bookingFormErrorMessage: {
        noOfPersons: "",
        date: ""
        },
      bookingFormValid: {
        noOfPersons: true,
        date: true,
        buttonActive: true
      }

    }
  }

  
  calculateCharges = () => {
    this.setState({ cost: 0 });
    let oneDay = 24 * 60 * 60 * 1000;
    let checkInDate = new Date(this.state.date);
    console.log(checkInDate)
    let checkOutDateinMs = Math.round(Math.abs((checkInDate.getTime() + Number((this.state.noOfNights)) * oneDay)));
    let checkOutDatein = Math.round(Math.abs((checkInDate.getTime() + Number((1)) * oneDay)));
    console.log(checkOutDateinMs)
    let finalCheckOutDate=new Date(checkOutDateinMs);
    let final=new Date(checkOutDatein)
    console.log(finalCheckOutDate)
    this.setState({ outdate: finalCheckOutDate.toDateString(),date1: final.toDateString()});
    console.log(this.state.outdate)
    if (this.state.checked1) {
        let totalCost = Number((-(-this.state.noof)))*((100-this.state.discount)/100)+ Number(this.state.chargesPerPerson) + Number(this.state.flightCharges);
        console.log(typeof(this.state.flightCharges))
        this.setState({ cost: Math.round(totalCost) });
        console.log(this.state.cost)
    } else {
        let totalCost = Number((-(-this.state.noof))) * Number(this.state.chargesPerPerson)*(100-this.state.discount)/100;
        console.log(totalCost)
        this.setState({ cost: Math.round(totalCost) });
        console.log(this.state.cost)
    }
}
  handleChange=(e)=>{
    let name=e.target.name;
    let value = e.target.value;
    this.setState({...this.state,[name]:value,confirm:false},()=>{this.calculateCharges()});
    this.validateField(name, value);
  }
  validateField = (fieldname, value) => {
    let fieldValidationErrors = this.state.bookingFormErrorMessage;
    let formValid = this.state.bookingFormValid;
    switch (fieldname) {
        case "noof":
            if (value === "") {
                fieldValidationErrors.noOfPersons = "This field can't be empty!";
                formValid.noOfPersons = false;
            } else if (value < 1) {
                fieldValidationErrors.noOfPersons = "No. of persons can't be less than 1!";
                formValid.noOfPersons = false;
            } else if (value > 5) {
                fieldValidationErrors.noOfPersons = "No. of persons can't be more than 5.";
                formValid.noOfPersons = false;
            } else {
                fieldValidationErrors.noOfPersons = "";
                formValid.noOfPersons = true;
                console.log(21111)
            }
            break;
        case "date":
            if (value === "") {
                fieldValidationErrors.date = "This field can't be empty!";
                formValid.date = false;
            } else if ((new Date().getTime() > new Date(value).getTime()) )
                {
                    fieldValidationErrors.date = "Check-in date cannot be a past date!";
                    formValid.date = false;
                } else {
                    fieldValidationErrors.date = "";
                    formValid.date = true;
                    console.log(54554)
                }
            break;
        default:
            break;
    }
    formValid.buttonActive = formValid.noOfPersons && formValid.date;
    console.log(formValid.buttonActive)
    this.setState({
        bookingFormErrorMessage: fieldValidationErrors,
        bookingFormValid: formValid
    });
}

 
  displayPackageInclusions = () => {
    const packageInclusions = this.state.packages
    return packageInclusions.map((pack, index) => (<li key={index} className="text-left">{pack}</li>))
  }

  displaydaylist = () => {
    const list = this.state.middle
    return list.map((pack, index) => (<div><h5 className="text-left">Day{this.state.middle.indexOf(pack) + 2}</h5><div className="text-left">{pack}</div></div>))
  }
  getPackages = (component) => {
    axios.get('http://localhost:4000/package/' + component)
      .then((response) => {
        console.log(sessionStorage.getItem("dealId"))
        console.log(sessionStorage.getItem("flight"))
        this.setState({
          packages: response.data[0].details.itinerary.packageInclusions, dayone: response.data[0].details.itinerary.dayWiseDetails.firstDay,
          middle: response.data[0].details.itinerary.dayWiseDetails.restDaysSightSeeing, lastday: response.data[0].details.itinerary.dayWiseDetails.lastDay, name: response.data[0].name,
          noOfNights:response.data[0].noOfNights,flightCharges:response.data[0].flightCharges,chargesPerPerson:response.data[0].chargesPerPerson,noOfNights:response.data[0].noOfNights
        })
        console.log(this.state.middle)
        if (this.state.packages.length === 0) this.setState({ errorMessage: "some error occured" })
      }).catch(error => {
        this.setState({ errorMessage: error.message, packages: [] })
      })
  }
  //
  componentDidMount() {
    this.getPackages(sessionStorage.getItem("dealId"))
    }
bookTrip=()=>
{
    axios.post(backendUrlBooking+"/"+sessionStorage.getItem("userId")+"/"+sessionStorage.getItem("dealId"),{"destinationName":this.state.name,
    "checkInDate": this.state.date,
    "checkOutDate":this.state.outdate,
    "noOfPersons": this.state.noof,
    "totalCharges":this.state.cost}).then((data) =>
    {
        this.setState({button:true});
    })
}
  render() {
    
    if(this.state.cancel){return <Redirect to={sessionStorage.getItem('url')}/>}

    if(this.state.button==false){
    return (
      <div className="row">
        <div className="content-section implementation col-md-5  offset-1 bookingSection">
          <h1 className="text-left">{this.state.name}</h1>
          <Fieldset legend="Overview" className="text-left" toggleable={true} collapsed={this.state.panelCollapsed} onToggle={(e) => this.setState({ panelCollapsed: e.value })}>
            <p>{sessionStorage.getItem("overview")}</p>
          </Fieldset>

          <Fieldset legend="Package Inclusions" className="text-left" toggleable={true} collapsed={this.state.panelCollapsed1} onToggle={(e) => this.setState({ panelCollapsed1: e.value })}>
            <p>{this.displayPackageInclusions()}</p>
          </Fieldset>
          <Fieldset legend="Itinerary" className="text-left" toggleable={true} collapsed={this.state.panelCollapsed2} onToggle={(e) => this.setState({ panelCollapsed2: e.value })}>
            <h4 className="text-left">Day Wise itinerary</h4>
            <h5 className="text-left">Day1</h5>
            <h6 className="text-left">{this.state.dayone}</h6>
            {this.displaydaylist()}
            <h6 className="text-left">{this.state.lastday}</h6>
            <h5 className="text-left">Day{this.state.middle.length + 2}</h5>
            <div className="text-danger text-left">
              **This itinerary is just a suggestion, itinerary can be modified as per requirement. <a
                href="#contact-us">Contact us</a> for more details.
                        </div>
          </Fieldset>
        </div>
<div className="content-section implementation card col-md-4 offset-1 bookingSection" style={{position:"absolute",marginLeft:"60%"}}>
<div className="card-body form">
              <div className="form-group text-left">
                <label htmlFor="number" className="text-left">No of Travellers</label>
                <input type="number" name="noof" className="form-control" onChange={this.handleChange}value={this.state.noof} />
                <div>
                {this.state.bookingFormErrorMessage.noOfPersons ?
                <span className="text-danger">{this.state.bookingFormErrorMessage.noOfPersons}</span>
                : null}
                </div>
                <label htmlFor="date">Trip start date </label>
                <input type="date" name="date" className="form-control" onChange={this.handleChange} value={this.state.date}/>
               <div>
                 {this.state.bookingFormErrorMessage.date ?
                                        <span className="text-danger">{this.state.bookingFormErrorMessage.date}</span>
                                        : null}
              </div>
              <br/>
                {/* <label>Include flights:</label><span>     </span><InputSwitch name="checked1" checked={this.state.checked1}  onChange={this.handleChange}/><br/> */}
            
                {/* <button  type ="submit"className="btn btn-primary"  disabled={this.state.confirm} onSubmit={this.handleSubmit}>Confirm</button> */}
                {/* <button className="btn btn-info btn-block" onClick={this.calculateCharges}>CalculateCharges</button> */}
              </div>
              
              <div className="text-left">
                Your trip ends on:{this.state.outdate}
                
      <h3>You Pay:Rs.{this.state.cost}</h3>
              </div>
              <div className="text-center ">
                 <button  type ="button"className="btn btn-success" disabled={!this.state.bookingFormValid.buttonActive} onClick={this.bookTrip}>Book</button>
                &nbsp; &nbsp; &nbsp;
                <button type="button" className="btn btn-link" onClick={(e)=>{this.setState({cancel:true})}}>Cancel</button>
              </div>
        </div>
    </div>
 </div>

    )}else{
      return (
      <div className="bookingSection">
      <h2>Booking Confirmed!!</h2>
      <h2 className="text-success">Congratulations! Trip planned to {this.state.name}</h2>
      <h4>Trip starts on:{this.state.date1}</h4>
      <h4>Trip ends on:{this.state.outdate}</h4>
      <Link to="/viewBookings">Click here to View your Bookings</Link>
      <br/>
      <br/>
      <br/>
        </div>
      )
    }
  }
}
export default Book;