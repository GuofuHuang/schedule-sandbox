import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'

const moment = require('moment');
const createEventUri = 'https://graph.microsoft.com/v1.0/users/test@globalthesource1.onmicrosoft.com/calendar/events';

const sampleEvent = {
    subject: "Dummy event now at " + moment(new Date()).format('DD MMM, YYYY'),
    start: {
        "dateTime": moment(new Date()).add('day', 1).toDate(),
        "timeZone": "UTC"
    },
    end: {
        "dateTime": moment(new Date()).add('day', 2).toDate(),
        "timeZone": "UTC"
    },
}

export function setupMsGraphApi() {
    WebApp.connectHandlers.use('/addMeeting', (req, res, next) => {
        //res.writeHead(200);
        //res.end(`Meeting Created`);
        
        var body = "";
        req.on('data', Meteor.bindEnvironment(function (data) {
            body += data;
            var token = JSON.parse(body).token;
            //console.log(token);
            HTTP.call('POST', createEventUri, { 
                content: 'string',
                'data': sampleEvent,
                'headers': {
                    'Authorization': 'Bearer ' + token,
                    'content-type':'application/json'
                } 
            }, (err, tokenResult) => {
                if (!err) {
                    res.writeHead(200);
                    res.end(tokenResult.content);
                } else {
                    res.writeHead(500);
                    res.end(err);
                }
            });
        }));
    });
}