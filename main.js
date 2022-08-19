const server = require('./index')
const PORT = process.env.PORT5000;



server.listen(PORT, ()=>{
    console.log("server is running")
})
