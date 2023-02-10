const { Schema } = require("mongoose");
const Mongoose = require("mongoose")
Mongoose.Promise = global.Promise;
const url = "mongodb://localhost:27017/Wanderlust_DB";

let schema = Schema({
  bookingId:String,
  userId:String,
  destId:String,
  destinationName:String,
  checkInDate:Date,
  checkOutDate:Date,
  noOfPersons:Number ,
  totalCharges:Number
},{collection:"Bookings"})
let bookingsSchema=new Schema(schema,{collection:"Bookings",timestamps:true})
let userSchema = Schema({
    name: String,
    userId: String,
    emailId: String,
    contactNo: Number,
    password: String,
    bookings: [String]
}, { collection: "Users" })

let hotdealsSchema =Schema({
    destinationId : String,
  continent: String,
  imageUrl: String,
  name: String,
  details: {
    about: String,
    itinerary: {
      dayWiseDetails: {
        firstDay: String,
        restDaysSightSeeing: [String],
        lastDay: String
      },
      packageInclusions: [String],
      tourHighlights: [String],
      tourPace: [String]
    }
  },
  noOfNights: Number,
  flightCharges: Number,
  chargesPerPerson:Number,
  discount:Number,
  availability: Number
},{collection:"Hotdeals"})
let destinationSechma=Schema({
  destinationId : String,
continent: String,
imageUrl: String,
name: String,
details: {
  about: String,
  itinerary: {
    dayWiseDetails: {
      firstDay: String,
      restDaysSightSeeing: [String],
      lastDay: String
    },
    packageInclusions: [String],
    tourHighlights: [String],
    tourPace: [String]
  }
},
noOfNights: Number,
flightCharges: Number,
chargesPerPerson:Number,
discount:Number,
availability: Number
},{collection:"Destinations"})
let collection = {};

collection.getUserCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true }).then((database) => {
        return database.model('Users', userSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}
collection.getDestinations = ()=>
{
  return Mongoose.connect(url,{useNewUrlParser:true}).then((database)=>
  {
    return database.model('Destinations',destinationSechma)
  }).catch((error) => {
    let err = new Error("Could not connect to Database");
    err.status = 500;
    throw err;
})
}
collection.getHotdeals = () =>
{
    return Mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology: true}).then((database) =>
    {
        return database.model('Hotdeals',hotdealsSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}
collection.getBookings = () =>
{
   return Mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then((database)=>
   {
     return database.model('Bookings',bookingsSchema);
   }).catch((error) => {
    let err = new Error("Could not connect to Database");
    err.status = 500;
    throw err;
})
}
module.exports = collection;
