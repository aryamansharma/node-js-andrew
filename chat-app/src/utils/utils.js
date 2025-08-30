const generateMessageObj = (text) => {
    return {
        text,
        createAt: new Date().getTime()
        // this method will conver the data into unix timestamp,
        // generally when working with time we should work with timestamps because they are easy to transfer and with almost all languages
    }
}

const generateLocationMessage = (url) => {
    return {
        url,
        createAt: new Date().getTime()
    }
}

module.exports = {
    generateMessageObj,
    generateLocationMessage
}