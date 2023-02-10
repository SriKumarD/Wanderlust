const userDB = require('../model/userslogin');

const userService = {}

//login a user
userService.login = (contactNo, userPassword) => {
    return userDB.checkUser(contactNo).then((user) => {
        if (user == null) {
            let err = new Error("Enter registered contact number! If not registered, please register")
            err.status = 404
            throw err
        }
        else {
            return userDB.getPassword(contactNo).then((password) => {
                if (password != userPassword) {
                    let err = new Error("Incorrect password")
                    err.status = 406
                    throw err
                }
                else {
                    return user;
                }
            })
        }
    })
}
userService.register=(name,emailId,contactNo,password)=>
{
    return userDB.registerUser(name,emailId,contactNo,password).then((data)=>
    {
        if(data == null)
        {
            let err=new Error("Register Phone Number Already Exist");
            err.status=409;
            throw err;
        }
        else{
            return data;
        }
    })
}

userService.getHotdeal= () =>
{
    return userDB.getHotdeals().then((data)=>
    {
        if(data.length == 0)
        {
            let err=new Error("Hotdeals are Not Available");
            err.status=409;
            throw err;
        }
        else
        {
            return data;
        }
        
    })
}
userService.getDestinations=(continent)=>
{
    return userDB.getDestinations(continent).then((data) =>
    {
        if(data.length==0)
        {
            let err=new Error("Destination Not Found");
            err.status=409;
            throw err;
        }
        else{
            return data;
        }
    })
}
userService.getDestinationDataById=(destinationid) =>
{
    return userDB.getDestinationDataById(destinationid).then((arraydata)=>
    {
        
        if(arraydata.length == 0)
        {
            let err=new Error("Destination Id Not Found");
            err.status=409;
            throw err;
        }
        else
        {
            return arraydata;
        }
    })
}
userService.bookTrip=(obj) =>
{
    return userDB.bookTrip(obj).then((data)=>
    {
        if(!data)
        {
            let err=new Error("Booking Failed");
            err.status=409;
            throw err;
        }
        else{
            return data
        }
    })
}
userService.findBookings =(userId) =>
{
    return userDB.findBookings(userId).then((data) =>
    {
        if(!data)
        {
            let err=new Error("No Bookings Found");
            err.status=409;
            throw err;
        }
        else{
            return data;
        }
    })
}
userService.deletBookings =(bookingId) =>
{
    return userDB.deletBookings(bookingId).then((data)=>
    {
        if(data==null)
        {
            let err=new Error("Cancelation Failed");
            err.status=409;
            throw err;
        }
        else
        {
            return data;
        }
    })
}
module.exports = userService
