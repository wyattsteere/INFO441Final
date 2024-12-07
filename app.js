import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import WebAppAuthProvider from 'msal-node-wrapper'
import session from 'express-session';
import models from './models.js'

import usersRouter from './routes/users.js';
import reportsRouter from './routes/reports.js';
import watchRouter from './routes/watchs.js';
import mapRouter from './routes/mapRoutes.js';
import markerRouter from './routes/markers.js';
import apiv1Router from './routes/api/v1/apiv1.js';
import myIdentityRouter from './routes/api/v1/users/myidentity.js';


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const authConfig = {
    auth: {
   	clientId: "8a92eab0-46d5-4fc6-b4a5-1380c0b83582",
    	authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    	clientSecret: "CL08Q~qaZs7pBPJEfyXON18EHG6XnqkkIP1iTbGI",
    	redirectUri: "/redirect"
    },
	system: {
    	loggerOptions: {
        	loggerCallback(loglevel, message, containsPii) {
            	console.log(message);
        	},
        	piiLoggingEnabled: false,
        	logLevel: 3,
    	}
	}
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const oneDay = 1000 * 60 * 60 * 24
app.use(session({
    secret: "this is some secret key I am making up 093u4oih54lkndso8y43hewrdskjf",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.get('/signin', (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/",
    })(req, res, next);

});
app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/",
    })(req, res, next);

});
app.use(authProvider.interactionErrorHandler());

app.use((req, res, next) => {
    req.models = models
    next()
})

app.use((req, res, next) => {
  req.models = models
  next()
})

app.use('/users', usersRouter);
app.use('/reports', reportsRouter);
app.use('/watchs', watchRouter);
app.use('/map', mapRouter);
app.use('/marker', markerRouter);


app.use('/api/v1', apiv1Router);
app.use('/api/v1/users', myIdentityRouter);

export default app;
