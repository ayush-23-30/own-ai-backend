import express from 'express'; 
import morgan from 'morgan';
import connectWithDB from '../backend/db/db.js'
import router from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import projectRouter from '../backend/routes/projects.router.js'
import aiRouter from './routes/ai.route.js';

const app = express(); 

app.use(morgan('dev')); 

connectWithDB(); 
 
app.use(cors()); // change when delpoying to production

app.use(express.json()); 
app.use(express.urlencoded({
  extended : true
}))

app.use(cookieParser())

app.use('/users', router)
app.use('/projects', projectRouter)
app.use('/ai', aiRouter)

app.get('/', (req,res) => {
  res.send('Hello I am Your Personal AI ')
})


export default app;
