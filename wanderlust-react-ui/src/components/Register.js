import React, { Component,Fragment} from "react";
import axios from "axios";
import { Redirect , Link } from 'react-router-dom';
import {backendUrlUser} from '../BackendURL';

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            registerform: {
                name: "",
                emailId: "",
                contactNo: "",
                password:""
            },
            registerErrorMessage: {
                nameError: "",
                emailIdError: "",
                contactNoError: "",
                passwordError:""
            },
            registerformValid: {
                namefield:false,
                emailIdfield:false,
                contactNofield:false,
                passwordfield:false,
                registerButtonfield:false
            },
            registerSuccess:false,
            errorMessage: "",
            loadHome: false,
        }
    }
    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { registerform} = this.state;
        this.setState({
            registerform: { ...registerform,[name]: value }
        });
        this.validateField(name, value);
    }
    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.registerErrorMessage;
        let formValid = this.state.registerformValid;
        console.log("der")
        switch (fieldName) {
            case "name":
                if(!value || value === "")
                {
                    fieldValidationErrors.nameError = "Please enter your name";
                    formValid.namefield = false;
                    
                }
                else if(!value.match(/^[A-Za-z][A-za-z\s]+[A-Za-z]$/))
                {
                    fieldValidationErrors.nameError = "Please Enter a Valid Name"
                    formValid.namefield = false
                    
                }
                else 
                {
                    fieldValidationErrors.nameError = ""
                    formValid.namefield = true
                }
                break;
            case "contactNo":
                let cnoRegex = /^[1-9]\d{9}$/
                if (!value || value === "") {
                    fieldValidationErrors.contactNoError = "Please enter your contact Number";
                    formValid.contactNofield= false;
                } else if (!value.match(cnoRegex)) {
                    fieldValidationErrors.contactNoError = "Contact number should be a valid 10 digit number";
                    formValid.contactNofield = false;
                } else {
                    fieldValidationErrors.contactNoError = "";
                    formValid.contactNofield = true;
                }
                break;
            case "password":
                if (!value || value === "") {
                    fieldValidationErrors.passwordError = "Password is manadatory";
                    formValid.passwordfield = false;
                    } 
                //     else if (!value.match(/^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&*-]).{8,20}$/)) {
                //         fieldValidationErrors.passwordError = "Please Enter a valid password"
                //         formValid.passwordfield = false;
                // } 
                else {
                    fieldValidationErrors.passwordError= "";
                    formValid.passwordfield = true;
                }
                break;
            case "emailId":
                if(value === "")
                {
                    fieldValidationErrors.emailIdError = "Please Enter Email-Id"
                    formValid.emailIdfield = false
                }
                else if(!value.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/))
                {
                    fieldValidationErrors.emailIdError = "Please Enter Email-Id"
                    formValid.emailIdfield = false
                }
                else
                {
                    fieldValidationErrors.emailIdError = "";
                    formValid.emailIdfield = true
                }
                break;
            default:
                break;
        }
        formValid.registerButtonfield = formValid.namefield && formValid.passwordfield && formValid.contactNofield && formValid.emailIdfield
        this.setState({registerformValid:formValid,registerErrorMessage:fieldValidationErrors})
    }
    register()
    {
        this.setState({errorMessage:""})
        const {registerform}=this.state
        axios.post(backendUrlUser+"/register",registerform).then((Response)=>
        {
            this.setState({registerSuccess:true});
            
        }).catch(error =>
            {
                this.setState({errorMessage:error.response.data.message});
                sessionStorage.clear()
            })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.register()
        
    }
    
    render() {
        if (this.state.loadHome === true) return <Redirect to={'/home/' + this.state.userId} />
        return (
            <div>
            <section id="loginform" className="registerSection">
                <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-4 offset-4 ">
                               { this.state.registerSuccess ? 
                               (<div className="text-justify">
                               <h6 className="text-success">Successfully Registered!</h6>
                               <Link style={{textDecoration:"none"}} to="/login">Click here to login</Link>
                               </div>) : 
                               (<Fragment>
                                   <h1 className="text-justify">Join Us</h1>
                                <form className="form text-justify" onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Name<span className="text-danger">*</span></label>
                                        <input 
                                            className="form-control border-top-0 border-right-0 border-left-0"
                                            text="text"
                                            value={this.state.registerform.name}
                                            id="name"
                                            name="name"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    {this.state.registerErrorMessage.nameError ? (<span className="text-danger">
                                        {this.state.registerErrorMessage.nameError}
                                    </span>)
                                        : null}
                                    <div className="form-group">
                                        <label htmlFor="emailId">"Email Id"<span className="text-danger">*</span></label>
                                        <input 
                                            className="form-control border-top-0 border-right-0 border-left-0"
                                            text="text"
                                            value={this.state.registerform.emailId}
                                            id="emailId"
                                            name="emailId"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    {this.state.registerErrorMessage.emailIdError ? (<span className="text-danger">
                                        {this.state.registerErrorMessage.emailIdError}
                                    </span>)
                                        : null}
                                    <div className="form-group">
                                        <label htmlFor="contactNo">contact Number<span className="text-danger">*</span></label>
                                        <input 
                                            className="form-control border-top-0 border-right-0 border-left-0"
                                            text="text"
                                            value={this.state.registerform.contactNo}
                                            id="contactNo"
                                            name="contactNo"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    {this.state.registerErrorMessage.contactNoError ? (<span className="text-danger">
                                        {this.state.registerErrorMessage.contactNoError}
                                    </span>)
                                        : null}
                                    <div className="form-group">
                                        <label htmlFor="name">password<span className="text-danger">*</span></label>
                                        <input 
                                            className="form-control border-top-0 border-right-0 border-left-0"
                                            type="password"
                                            value={this.state.registerform.password}
                                            id="password"
                                            name="password"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    {this.state.registerErrorMessage.passwordError ? (<span className="text-danger">
                                        {this.state.registerErrorMessage.passwordError}
                                    </span>)
                                        : null}
                                    <span><span className="text-danger">*</span> marked feilds are mandatory</span>
                                    <br/>
                                    <div class="form-group">
                                        <div class="text-danger">
                                            <h6>{this.state.errorMessage}</h6>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        id="Register"
                                        className="btn btn-primary btn-lg btn-block"
                                        disabled={!this.state.registerformValid.registerButtonfield}
                                    >
                                        REGISTER
                                    </button>
                                </form>
                                   
                               </Fragment>) }
                               
                            </div>
                        </div>
                </div> 
            </section>
                
            </div>
        )
    }
}

export default Register
