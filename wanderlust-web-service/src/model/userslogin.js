const userDetails = require('./beanClasses/users');
const connection = require("../utilities/connections")

const usersDB = {}
usersDB.generateId=()=>
{
    return connection.getUserCollection().then((model)=>
    {
        return model.distinct("userId").then((ids)=>
        {
            if(ids.length>0)
            {
                let num_part_id=ids.map((ele)=> Number(ele.substring(1)))
                let Id=Math.max(...num_part_id);
                return "U"+(Id+1);
            }
            else
            {
                return "U1001"
            }
            
        })
    })
}
usersDB.generateBookingId=()=>
{
    return connection.getBookings().then((model)=>
    {
        return model.distinct("bookingId").then((ids)=>
        {
            if(ids.length>0)
            {
                let num_part_id=ids.map((ele)=> Number(ele.substring(1)))
                let Id=Math.max(...num_part_id);
                return "B"+(Id+1);
            }
            else{
                return "B1001"
            }
            
        })
    })
}
usersDB.generateBookingId()
usersDB.registerUser=(name,emailId,contactNo,password) =>
{
    return usersDB.generateId().then(Uid => {
    return connection.getUserCollection().then((model)=>
        {
            return usersDB.checkUser(contactNo).then((found)=>
            {
                if(found == null)
                {
                    return model.insertMany([{"userId":Uid,"name":name,"emailId":emailId,"contactNo":contactNo,"password":password}]).then((data)=>
                    {
                        return data;
                    })
                }
                else
                {
                    return null;
                }
            })
        })
    })
    
}

usersDB.checkUser = (contactNo) => {
    return connection.getUserCollection().then((collection) => {
        return collection.findOne({ "contactNo": contactNo }).then((customerContact) => {
            if (customerContact) {
                return new userDetails(customerContact);
            }
            else return null;
        })
    })
}

usersDB.getPassword = (contactNo) => {
    return connection.getUserCollection().then((collection) => {
        return collection.find({ "contactNo": contactNo }, { _id: 0, password: 1 }).then((password) => {
            if (password.length != 0)
                return password[0].password;
            else
                return null;
        })
    })
}

usersDB.getHotdeals =() =>
{
    return connection.getHotdeals().then((collection) =>
    {
        return collection.find({},{_id:0}).then((dataarry)=>
        {
            if(dataarry.length > 0)
            {
                return dataarry;
            }
            else
            {
                return null;
            }
        })
    })
}
usersDB.getDestinations = (continent) =>
{
    return connection.getDestinations().then((collection)=>
    {
        const regE="("+continent+")"
        const s =RegExp(regE)
        return collection.find({$or:[{"continent":continent},{"name":{$regex:s}}]},{_id:0}).then((dataarry)=>
        {
            return connection.getHotdeals().then((model) =>
            {
                return model.find({$or:[{"continent":continent},{"name":{$regex:s}}]},{_id:0}).then((dataarry2) =>{
                    dataarry2.push(...dataarry)
                    if(dataarry2.length >0)
                    {
                        return dataarry2;
                    }
                    else
                    {
                        return null;
                    }
                })
            })
        })
    })
}
usersDB.getDestinationDataById =(destinationid) =>
{
    return connection.getDestinations().then((collection)=>
    {
        return collection.find({"destinationId":destinationid},{_id:0}).then((destinationArray)=>{
            if(destinationArray.length > 0)
            {
                return destinationArray;
            }
            else
            {
                return connection.getHotdeals().then((model)=>
                {
                    return model.find({"destinationId":destinationid},{_id:0}).then((hotdealArray)=>
                    {
                        if(hotdealArray.length > 0)
                        {
                            return hotdealArray;
                        }
                        else{
                            return null;
                        }
                    })
                })
            }
        })
    })
}

usersDB.bookTrip=(obj) =>
{
    return connection.getBookings().then((collection) =>
    {
        return usersDB.generateBookingId().then((bid) =>
        {
            let details={...obj,"bookingId":bid}
            return collection.insertMany([details]).then((data1) =>
            {
               return connection.getUserCollection().then((model)=>
                {
                    return model.updateOne({"userId":details.userId},{$push:{"bookings":bid}}).then((data2) =>
                    {
                        return connection.getDestinations().then((destmodel) =>
                        {
                            return destmodel.updateOne({"destinationId":details.destId},{$inc:{"availability":-details.noOfPersons}}).then((updata)=>
                            {
                                if(updata.nModified==1)
                                {
                                    return true
                                }
                                else
                                {
                                    return connection.getHotdeals().then((hotdealmodel)=>
                                    {
                                        return hotdealmodel.updateOne({"destinationId":details.destId},{$inc:{"availability":-details.noOfPersons}}).then((update2)=>
                                        {
                                            if(update2.nModified==1)
                                            {
                                                return true
                                            }
                                            else{
                                                return false
                                            }
                                        })
                                    })
                                }
                            })
                        })
                    })
                })
            })
        })
    })
}
usersDB.findBookings= (userId) =>
{
    return connection.getBookings(userId).then((collection) =>
    {
        return collection.find({"userId":userId},{_id:0}).then((data)=>
        {
            if(data.length>0)
            {
                return data;
            }
            else
            {
                return null;
            }
        })
    })
}

usersDB.deletBookings=(bookingId)=>
{
    return connection.getBookings().then((collection)=>
    {
        return collection.findOne({"bookingId":bookingId}).then((arraydata) =>
        {
            const user=arraydata.userId
            const dest=arraydata.destId
            const nof=arraydata.noOfPersons
            return connection.getUserCollection().then((usercollection)=>
            {
                return usercollection.updateOne({"userId":user},{$pull:{"bookings":bookingId}}).then((updatedata)=>
                {
                    return connection.getDestinations().then((destmodel) =>
                    {
                        return destmodel.updateOne({"destinationId":dest},{$inc:{"availability":nof}}).then((updata1) =>
                        {
                            if(updata1.nModified==1)
                            {
                                return collection.deleteOne({"bookingId":bookingId}).then((dataofdeleted)=>
                                {
                                    return usersDB.findBookings(user).then((arraybooking)=>
                                    {
                                        if(arraybooking.length >0)
                                        {
                                            return arraybooking
                                         }
                                         else
                                        {
                                         return null
                                        }
                                    })
                                })
                            }
                            else{
                                return connection.getHotdeals().then((hotdealmodel) =>
                                {
                                    return hotdealmodel.updateOne({"destinationId":dest},{$inc:{"availability":nof}}).then((update2)=>
                                    {
                                        if(update2.nModified==1)
                                        {
                                            return collection.deleteOne({"bookingId":bookingId}).then((dataofdeleted)=>
                                {
                                    return usersDB.findBookings(user).then((arraybooking)=>
                                    {
                                        if(arraybooking.length >0)
                                        {
                                            return arraybooking
                                         }
                                         else
                                        {
                                         return null
                                        }
                                    })
                                })
                                        }
                                        else{
                                            return null
                                        }
                                    })
                                })
                            }
                            
                        })
                    })
                  
                })
            })
        })
    })
}
// usersDB.bookTrip({userId:"U1001",destId:"D1001",destinationName:"A Week in Greece: Athens, Mykonos & Santorini",checkInDate:"2018-12-09",checkOutDate:"2018-12-16",noOfPersons:2 ,totalCharges:5998})
// usersDB.deletBookings("B1002")
module.exports = usersDB;
