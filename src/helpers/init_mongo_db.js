const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(
    'mongodb+srv://kanzulhuda:'
    + process.env.MONGO_ATLAS_PW +
    '@kanzulhuda.nwxfc.mongodb.net/kanzulhuda?retryWrites=true&w=majority',
  {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
         useFindAndModify: false 
    }
).then(()=>{console.log('Database Connected')})
.catch(err=>{
    console.log(err.message)
});
