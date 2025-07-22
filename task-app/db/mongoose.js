const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://aryamansharma1816:yw8hPcNljZm1WpMw@cluster0.yfdapul.mongodb.net/task_app?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})