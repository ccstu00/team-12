import express from 'express'

const app = express()
const PORT  = process.env.PORT || 3000;

app.get('/',(req,res)=>{
  res.send("Team-12: UMASS Marketplace")
})
app.get('/listings',(req,res)=>{
  res.send('Items for Sale at UMASS: (Listings)')
})
app.use((req,res)=>{
res.status(404).send('Page not found.');
})

app.listen(PORT , ()=>{
  console.log(`Listening on http://localhost:${PORT}`)
})
