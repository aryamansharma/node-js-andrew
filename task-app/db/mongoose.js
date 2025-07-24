const mongoose = require('mongoose')

mongoose.connect('mongodb://aryamansharma1816:yw8hPcNljZm1WpMw@ac-ihp1kwz-shard-00-00.yfdapul.mongodb.net:27017,ac-ihp1kwz-shard-00-01.yfdapul.mongodb.net:27017,ac-ihp1kwz-shard-00-02.yfdapul.mongodb.net:27017/task-app?ssl=true&replicaSet=atlas-bwz2fv-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true
}).then(() => console.log('DB connection successful!'));