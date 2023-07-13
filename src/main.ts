import { env } from "./env"
import { app } from "./server"

app.listen({
  host: '0.0.0.0',
  port:env.PORT
})
.then(()=>{
  console.log('HTTP SERVER RUNNING ON ' + env.PORT)
})