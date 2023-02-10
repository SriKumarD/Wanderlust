import React from "react";
import App, { Counter } from "./App";
import { shallow } from "enzyme";
import Home from "./components/home";
import Login from "./components/login";
import Hotdeals from "./components/hotDeals";
import Packages from "./components/packages";
import Register from "./components/Register";
import ViewBooking from "./components/viewbooking";

const dummyData = [
  {
      "destinationId" : "D1001",
      "continent":"Europe",
      "imageUrl":"/assets/geece.jpg",
      "name" : "A Week in Greece: Athens, Mykonos & Santorini",
      "details" : {
          "about" : "Watch the setting sun from the hilltops of Greece’s most famous islands.Experience ancient history and open-air museums in the capital of Athens. Then, the quintessential, beautiful Greek islands you’ve been dreaming of come to life on the isles of Mykonos and Santorini.",
          "itinerary" : {
              "dayWiseDetails":{
                      "firstDay":"Travel day: Board your overnight flight to Athens.",
                      "restDaysSightSeeing":[
                                              "Santorini",
                                              "Acropolis", 
                                              "Parthenon", 
                                              "Temple of Apollo", 
                                              "Ruins of Olympia", 
                                              "Ancient Theater of Epidaurus"
                                          ],
                      "lastDay":"Departure:Transfer to the airport for your flight home."
              },
              "packageInclusions" : [ 
                  "7 nights in handpicked hotels", 
                  "7 breakfasts", 
                  "3 dinners with beer or wine", 
                  "3 guided sightseeing tours", 
                  "Expert tour director & local guides", 
                  "Private deluxe motor coach"
              ],
              "tourHighlights" : [ 
                  "Greece",
                  "Athens",
                  "Mykonos",
                  "Santorini",
                  "Acropolis", 
                  "Parthenon", 
                  "Temple of Apollo", 
                  "Ruins of Olympia", 
                  "Ancient Theater of Epidaurus", 
                  "Corinth Canal photo stop"
              ],
              "tourPace" : [ 
                  "On this guided tour, you will walk for about 2 hours daily across uneven terrain, including paved roads and unpaved trails, with some hills and stairs."
              ]
          }
}}]
describe("App Component", () => {

  test("checks for 1 nav tag", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('nav').length).toEqual(1);
  })
  test("checkss for 1 tag with class .navbar-header in app", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(".navbar-header").length).toEqual(1);
  });
  test("checks for initial state of logged_out state", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.state().logged_out).toEqual(false);
  });
});
describe("Home Component", () => {
  // test cases will be written here.

  test("check for 1 header component", () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find("header").length).toEqual(1);
  });


  test("checks for section component with id about", () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find("#continent").length).toEqual(1);
  });

  test("checks for section component with id signup ", () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find("#signup").length).toEqual(1);
  });
});
describe("Hotdeals Component", () => {
  // test cases will be written here.

  test("check for initial value of packagePage", () => {
    const wrapper = shallow(<Hotdeals />);
    expect(wrapper.state().packagePage).toBe(false);
  });
  test("check Viewbutton in Cards",()=>
  {
    const wrapper=shallow(<Hotdeals/>);
    expect(wrapper.state().bookingPage).toBe(false);
  })

  test("check Cancle button in Cards",()=>
  {
    const wrapper=shallow(<Hotdeals/>);
    wrapper.setState({packages:dummyData})
    expect(wrapper.find("#viewbutton").length).toEqual(1);
  })
});
describe("Login Component",()=>
{
  test("checks for initial state of loadHome to be false", () => {
    const wrapper = shallow(<Login/>);
    expect(wrapper.state().loadHome).toEqual(false);
  });
  test("checks for  loing button",()=>
  {
    const wrapper=shallow(<Login/>);
    expect(wrapper.find("#login").length).toEqual(1);
  });
  test("checks for Register Button",()=>
  {
    const wrapper=shallow(<Login/>);
    expect(wrapper.find("#Register").length).toEqual(1);
  });
})
describe("Packagepage component",()=>
{
  test("check for Booking page to be false view in package",()=>
  {
     const wrapper=shallow(<Packages/>);
     wrapper.setState({ index: 0, deal: dummyData[0], showItinerary: true })
     expect(wrapper.find("Sidebar").length).toEqual(1);
  });
  test("check for Booking page to be false view in package",()=>
  {
     const wrapper=shallow(<Packages/>);
     wrapper.setState({ index: 0, deal: dummyData[0], showItinerary: true })
     expect(wrapper.find("TabPanel").length).toEqual(3);
  });
  test("check for Booking page to be false view in package",()=>
  {
     const wrapper=shallow(<Packages/>);
     wrapper.setState({ index: 0, deal: dummyData[0], showItinerary: true })
     expect(wrapper.find("TabView").length).toEqual(1);
  });

});

describe("Register Componenet",() =>
{
  test("Check for form in Register",()=>
  {
    const wrapper=shallow(<Register></Register>);
    expect(wrapper.find("form").length).toEqual(1);
  })
  test("Check for paswoord in form of Register",()=>
  {
    const wrapper=shallow(<Register></Register>);
    expect(wrapper.find("#password").length).toEqual(1);
  })
  test("Check for paswoord in form of Register",()=>
  {
    const wrapper=shallow(<Register></Register>);
    expect(wrapper.state().registerformValid.registerButtonfield).toBe(false);
  })

});

describe("View Componenet",() =>
{
  test("Check for dialog box in View",()=>
  {
    const wrapper=shallow(<ViewBooking></ViewBooking>);
    expect(wrapper.state().dialog_visible).toBe(false);
  })
  test("Check for Home button",() =>
  {
    const wrapper=shallow(<ViewBooking></ViewBooking>);
    wrapper.setState({bookings: []})
    expect(wrapper.find("#Home").length).toBe(1)
  })
  test("Check for Footer for dilogue box",() =>
  {
    const wrapper=shallow(<ViewBooking></ViewBooking>);
    expect(wrapper.state().in).toBe("")
  })
})