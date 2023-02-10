const express = require('express');
const router = express.Router();
const setupUser = require("../model/setupUser")
const userservice = require('../service/userslogin')

router.get("/setup", (req, res, next) => {
    setupUser.userSetup().then((data) => {
        res.send(data)
    }).catch(err => next(err));
})

//router to login
router.post('/login', function (req, res, next) {
    let contactNo = req.body.contactNo;
    let password = req.body.password;
    userservice.login(parseInt(contactNo), password).then(function (userDetails) {
        res.json(userDetails);
    }).catch(err => next(err));
})

//router to register
router.post('/register',(req,res,next)=>
{
    let name=req.body.name;
    let emailId=req.body.emailId;
    let contactNo=req.body.contactNo;
    let password=req.body.password;
    userservice.register(name,emailId,contactNo,password).then((inserteData) =>
    {
        res.json(inserteData)
    }).catch(err => next(err))
})

// roter to destination by continent
router.get('/destinations/:continent',(req,res,next) =>
{
    const continent=req.params.continent
    userservice.getDestinations(continent).then((data) =>
    {
        res.json(data)
    }).catch(err => next(err))
})
//roter to get hotdeals
router.get('/hotDeals',(req,res,next) =>
{
    userservice.getHotdeal().then((data)=>
    {
        res.json(data)
    }).catch(err => next(err))
})

//router get for booking Description
router.get('/:destinationId',(req,res,next) =>
{
    const destinationId=req.params.destinationId
    userservice.getDestinationDataById(destinationId).then((data) =>
    {
        res.json(data)
    }).catch(err => next(err))
})
//router to insert booking details
router.post('/:userId/:destinationId',(req,res,next) =>
{
    const userId=req.params.userId
    const destId=req.params.destinationId
    const destinationName=req.body.destinationName
    const checkInDate=req.body.checkInDate
    const checkOutDate=req.body.checkOutDate
    const noOfPersons=req.body.noOfPersons
    const totalCharges=req.body.totalCharges
    obj={userId,destId,destinationName,checkInDate,checkOutDate,noOfPersons,totalCharges}
    userservice.bookTrip(obj).then((data)=>
    {
        res.json(data)
    }).catch(err => next(err))

})
router.get("/booking/:userId",(req,res,next)=>
{
    const userId=req.params.userId
    userservice.findBookings(userId).then((data) =>
    {
        res.json(data)
    }).catch(err => next(err))
})
router.delete("/cancelBooking/:bookingId",(req,res,next) =>
{
    const bookingId=req.params.bookingId
    userservice.deletBookings(bookingId).then((data) =>
    {
        res.json(data)
    }).catch(err => next(err))
})
module.exports = router;

