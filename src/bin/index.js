import {createServer} from 'http'
import express from 'express'
import {config} from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import cloudinary from "cloudinary"

import {api} from '../apis'
import {initSocketIO} from '../socket'
import {startTest} from '../db'

export async function startServer() {
  await config()
  const app = express()
  const server = createServer(app)
  initSocketIO(server)
  await Promise.all([
    app.use(cors()),
    app.use(helmet()),
    app.use(compression()),
    app.use(bodyParser.urlencoded({extended: true})),
    app.use(bodyParser.json()),
    app.use('/api', api),
    startTest()
  ])

  var API_KEY = "719885694626182";
  var API_SERECT = "ntLl6-9WLZ0QS9L9ceeaRZ7_7Lk";
  cloudinary
    .v2
    .config({api_key: API_KEY, api_secret: API_SERECT, cloud_name: "livestreamzz"});
    
  // morgan('tiny')
  server.listen(process.env.PORT | 3001, () => console.log(`Server is running at port 3001 .........`))
}