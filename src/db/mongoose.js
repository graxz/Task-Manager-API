const mongoose = require('mongoose')

///Users/User/Desktop/mongodb/bin/mongod.exe --dbpath=/Users/User/Desktop/mongodb-data
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
