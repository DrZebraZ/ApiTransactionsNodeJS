import { env } from "./env"
import { app } from "./server"

app.listen({
  port:env.PORT
})
.then(()=>{
  console.log('HTTP SERVER RUNNING ON ' + env.PORT)
})