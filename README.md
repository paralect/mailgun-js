# mailgun.js

Fork of Mailgun-js library
Simple Node.js module for [Mailgun](https://github.com/mailgun/mailgun-js-boland), which is not maintained anymore.

# Maintenance Notice

This library is no longer maintained. Mailgun now has a supported, official library at https://github.com/mailgun/mailgun-js. It is also available as an npm at https://www.npmjs.com/package/mailgun.js. I'd encourage everyone to migrate from this library to the official library. If you have questions or issues with the official library, please raise issues there.
# Maintenance Notice

This library is no longer maintained. It was started over [6 years ago](https://github.com/bojand/mailgun-js/commit/7a1a1407a1105945a7e435e0a65b986ea34f320c) because we were Mailgun customers and needed a good Node.js client. Since then this module has become more popular then ever expected, and even [official documentation](https://documentation.mailgun.com/en/latest/api-sending.html#examples) references it. Likewise a lot has changed over the years. Due to various factors my employer nor I use Mailgun any more, and we have not for a couple of years now. I have attempted to maintain the library but over time that has proved to be increasingly more difficult as I do not use it and have no need for it. I have reached out to Mailgun to inquire if they would take over the module and repository but never received any meaningful response. I would be happy to add a well-intentioned contributor to maintain this; but I do not have the time, incentive, and plans to maintain this module any more.

## Installation

`npm install mailgun-js`

## Usage overview

This is a simple Node.js module for interacting with the [Mailgun](http://www.mailgun.com) API. This module is intended to be used within Node.js environment and **not** from the browser. For browser use the [mailgun.js](https://github.com/mailgun/mailgun-js) module.

Please see [Mailgun Documentation](https://documentation.mailgun.com) for full Mailgun API reference.

This module works by providing proxy objects for interacting with different resources through the Mailgun API.
Most methods take a `data` parameter, which is a Javascript object that would contain the arguments for the Mailgun API.
All methods take a final parameter callback with two parameters: `error`, and `body`.
We try to parse the `body` into a javascript object, and return it to the callback as such for easier use and inspection by the client.
If there was an error a new `Error` object will be passed to the callback in the `error` parameter.
If the error originated from the (Mailgun) server, the response code will be available in the `statusCode` property
of the `error` object passed in the callback.
See the `/docs` folder for detailed documentation. For full usage examples see the `/test` folder.

```js
var api_key = 'XXXXXXXXXXXXXXXXXXXXXXX';
var domain = 'www.mydomain.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!'
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

Note that the `to` field is required and should be a string containing 1 or more comma-separated addresses. Additionally `cc` and `bcc` fields can be specified. Recipients in those fields will be addressed as such.  See https://documentation.mailgun.com/api-sending.html#sending for additional details.

Messages stored using the Mailgun `store()` action can be retrieved using `messages(<message_key>).info()` function.
Optionally the MIME representation of the message can be retrieved if `MIME` argument is passed in and set to `true`.

Something more elaborate. Get mailing list info, create a member and get mailing list members and update member.
Notice that the proxy objects can be reused.

```js
var list = mailgun.lists('mylist@mycompany.com');

list.info(function (err, data) {
  // `data` is mailing list info
  console.log(data);
});

var bob = {
  subscribed: true,
  address: 'bob@gmail.com',
  name: 'Bob Bar',
  vars: {age: 26}
};

list.members().create(bob, function (err, data) {
  // `data` is the member details
  console.log(data);
});

list.members().list(function (err, members) {
  // `members` is the list of members
  console.log(members);
});

list.members('bob@gmail.com').update({ name: 'Foo Bar' }, function (err, body) {
  console.log(body);
});

list.members('bob@gmail.com').delete(function (err, data) {
  console.log(data);
});
```

#### Options

`Mailgun` object constructor options:

* `apiKey` - Your Mailgun API KEY
* `publicApiKey` - Your public Mailgun API KEY
* `domain` - Your Mailgun Domain (Please note: domain field is `MY-DOMAIN-NAME.com`, not https://api.mailgun.net/v3/MY-DOMAIN-NAME.com)
* `mute` - Set to `true` if you wish to mute the console error logs in `validateWebhook()` function
* `agent` - The [Agent](https://nodejs.org/docs/latest-v10.x/api/http.html#http_class_http_agent) to use - see [request](https://nodejs.org/docs/latest-v10.x/api/http.html#http_http_request_options_callback) options for the provided values. **Note** When providing an `agent` it must be able to handle the provided (or default) `protocol`.
* `timeout` - Request timeout in milliseconds
* `host` - the mailgun host (default: 'api.mailgun.net'). Note that if you are using the EU region the host should be set to  'api.eu.mailgun.net'
* `protocol` - the mailgun protocol (default: 'https:', possible values: 'http:' or 'https:')
* `port` - the mailgun port (default: '443')
* `endpoint` - the mailgun host (default: '/v3')
* `retry` - the number of **total attempts** to do when performing requests. Default is `1`.
That is, we will try an operation only once with no retries on error. You can also use a config
object compatible with the `async` library for more control as to how the retries take place.
See docs [here](https://caolan.github.io/async/docs.html#retry)
* `testMode` - turn test mode on. If test mode is on, no requests are made, rather the request options and data is logged
* `testModeLogger` - custom test mode logging function


#### Attachments

Attachments can be sent using either the `attachment` or `inline` parameters. `inline` parameter can be use to send an
attachment with `inline` disposition. It can be used to send inline images. Both types are supported with same mechanisms
as described, we will just use `attachment` parameter in the documentation below but same stands for `inline`.

Sending attachments can be done in a few ways. We can use the path to a file in the `attachment` parameter.
If the `attachment` parameter is of type `string` it is assumed to be the path to a file.

```js
var filepath = path.join(__dirname, 'mailgun_logo.png');

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!',
  attachment: filepath
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

We can pass a buffer (has to be a `Buffer` object) of the data. If a buffer is used the data will be attached using a
generic filename "file".

```js
var filepath = path.join(__dirname, 'mailgun_logo.png');
var file = fs.readFileSync(filepath);

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!',
  attachment: file
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

We can also pass in a stream of the data. This is useful if you're attaching a file from the internet.

```js
var request = require('request');
var file = request("https://www.google.ca/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png");

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!',
  attachment: file
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

Finally we provide a `Mailgun.Attachment` class to add attachments with a bit more customization. The Attachment
constructor takes an `options` object. The `options` parameters can have the following fields:
* `data` - can be one of
    * a string representing file path to the attachment
    * a buffer of file data
    * an instance of `Stream` which means it is a readable stream.
* `filename` - the file name to be used for the attachment. Default is 'file'
* `contentType` - the content type. Required for case of `Stream` data. Ex. `image/jpeg`.
* `knownLength` - the content length in bytes. Required for case of `Stream` data.

If an attachment object does not satisfy those valid conditions it is ignored. Multiple attachments can be sent by
passing an array in the `attachment` parameter. The array elements can be of any one of the valid types and each one
will be handled appropriately.

```js
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var filename = 'mailgun_logo.png';
var filepath = path.join(__dirname, filename);
var file = fs.readFileSync(filepath);

var attch = new mailgun.Attachment({data: file, filename: filename});

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!',
  attachment: attch
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

```js
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var filename = 'mailgun_logo.png';
var filepath = path.join(__dirname, filename);
var fileStream = fs.createReadStream(filepath);
var fileStat = fs.statSync(filepath);

msg.attachment = new mailgun.Attachment({
  data: fileStream,
  filename: 'my_custom_name.png',
  knownLength: fileStat.size,
  contentType: 'image/png'});

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

#### Sending MIME messages

Sending messages in MIME format can be accomplished using the `sendMime()` function of the `messages()` proxy object.
The `data` parameter for the function has to have `to` and `message` properties. The `message` property can be a full
file path to the MIME file, a stream of the file, or a string representation of the MIME
message. To build a MIME string you can use the [nodemailer](https://www.npmjs.org/package/nodemailer) library.
Some examples:

```js
var domain = 'mydomain.org';
var mailgun = require('mailgun-js')({ apiKey: "YOUR API KEY", domain: domain });
var MailComposer = require('nodemailer/lib/mail-composer');

var mailOptions = {
  from: 'you@samples.mailgun.org',
  to: 'mm@samples.mailgun.org',
  subject: 'Test email subject',
  text: 'Test email text',
  html: '<b> Test email text </b>'
};

var mail = new MailComposer(mailOptions);

mail.compile().build((err, message) => {

    var dataToSend = {
        to: 'mm@samples.mailgun.org',
        message: message.toString('ascii')
    };

    mailgun.messages().sendMime(dataToSend, (sendError, body) => {
        if (sendError) {
            console.log(sendError);
            return;
        }
    });
});
```
#### Referencing MIME file

```js
var filepath = '/path/to/message.mime';

var data = {
  to: fixture.message.to,
  message: filepath
};

mailgun.messages().sendMime(data, function (err, body) {
  console.log(body);
});
```

```js
var filepath = '/path/to/message.mime';

var data = {
  to: fixture.message.to,
  message: fs.createReadStream(filepath)
};

mailgun.messages().sendMime(data, function (err, body) {
  console.log(body);
});
```

#### Creating mailing list members

`members().create({data})` will create a mailing list member with `data`. Mailgun also offers a resource for creating
members in bulk. Doing a `POST` to `/lists/<address>/members.json` adds multiple members, up to 1,000 per call,
to a Mailing List. This can be accomplished using `members().add()`.

```js
var members = [
  {
    address: 'Alice <alice@example.com>',
    vars: { age: 26 }
  },
  {
    name: 'Bob',
    address: 'bob@example.com',
    vars: { age: 34 }
  }
];

mailgun.lists('mylist@mycompany.com').members().add({ members: members, subscribed: true }, function (err, body) {
  console.log(body);
});
```

## Generic requests

Mailgun-js also provides helper methods to allow users to interact with parts of the api that are not exposed already.
These are not tied to the domain passed in the constructor, and thus require the full path with the domain
passed in the `resource` argument.

* `mailgun.get(resource, data, callback)` - sends GET request to the specified resource on api.
* `mailgun.post(resource, data, callback)` - sends POST request to the specified resource on api.
* `mailgun.delete(resource, data, callback)` - sends DELETE request to the specified resource on api.
* `mailgun.put(resource, data, callback)` - sends PUT request to the specified resource on api.

Example: Get some stats

```js
mailgun.get('/samples.mailgun.org/stats', { event: ['sent', 'delivered'] }, function (error, body) {
  console.log(body);
});
```

## Promises

Module works with Node-style callbacks, but also implements promises with the [promisify-call](https://www.npmjs.com/package/promisify-call) library.

```js
mailgun.lists('mylist@mydomain.com').info().then(function (data) {
  console.log(data);
}, function (err) {
  console.log(err);
});
```

The function passed as 2nd argument is optional and not needed if you don't care about the fail case.

## Webhook validation

The Mailgun object also has a helper function for validating Mailgun Webhook requests
(as per the [mailgun docs for securing webhooks](http://documentation.mailgun.com/user_manual.html#securing-webhooks)).
This code came from [this gist](https://gist.github.com/coolaj86/81a3b61353d2f0a2552c).

Example usage:

```js
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

function router(app) {
  app.post('/webhooks/mailgun/*', function (req, res, next) {
    var body = req.body;

    if (!mailgun.validateWebhook(body.timestamp, body.token, body.signature)) {
      console.error('Request came, but not from Mailgun');
      res.send({ error: { message: 'Invalid signature. Are you even Mailgun?' } });
      return;
    }

    next();
  });

  app.post('/webhooks/mailgun/catchall', function (req, res) {
    // actually handle request here
  });
}
```

## Email Addresses validation

These routes require Mailgun public API key.
Please check Mailgun [email validation documentation](https://documentation.mailgun.com/api-email-validation.html) for more responses details.

### Validate Email Address

**mailgun.validate(address, private, options, fn)**

Checks if email is valid.

- `private` - whether it's private validate
- `options` - any additional options

Example usage:

```js
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

mailgun.validate('test@mail.com', {mailbox_verification: true}, function (err, body) {
  if(body && body.is_valid){
    // do something
  }
});
```

### Parse Email Addresses list

Parses list of email addresses and returns two lists:
  - parsed email addresses
  - unparseable email addresses

Example usage:

```js
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

mailgun.parse([ 'test@mail.com', 'test2@mail.com' ], function (err, body) {
  if(error){
    // handle error
  }else{
    // do something with parsed addresses: body.parsed;
    // do something with unparseable addresses: body.unparseable;
  }
});
```

## Debug logging

[debug](https://npmjs.com/package/debug) package is used for debug logging.

```sh
DEBUG=mailgun-js node app.js
```

## Test mode

Test mode can be turned on using `testMode` option. When on, no requests are actually sent to Mailgun, rather we log the request options and applicable payload and form data. By default we log to `console.log`, unless `DEBUG` is turned on, in which case we use debug logging.

```js
mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain, testMode: true })

const data = {
  from: 'mailgunjs+test1@gmail.com',
  to: 'mailgunjstest+recv1@gmail.com',
  subject: 'Test email subject',
  text: 'Test email text'
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

```
options: { hostname: 'api.mailgun.net',
  port: 443,
  protocol: 'https:',
  path: '/v3/sandbox12345.mailgun.org/messages',
  method: 'POST',
  headers:
   { 'Content-Type': 'application/x-www-form-urlencoded',
     'Content-Length': 127 },
  auth: 'api:key-0e8pwgtt5ylx0m94xwuzqys2-o0x4-77',
  agent: false,
  timeout: undefined }
payload: 'to=mailgunjs%2Btest1%40gmail.com&from=mailgunjstest%2Brecv1%40gmail.com&subject=Test%20email%20subject&text=Test%20email%20text'
form: undefined
undefined
```

Note that in test mode no error or body are returned as a result.

The logging can be customized using `testModeLogger` option which is a function to perform custom logging.

```js
const logger = (httpOptions, payload, form) => {
  const { method, path } = httpOptions
  const hasPayload = !!payload
  const hasForm = !!form

  console.log(`%s %s payload: %s form: %s`, method, path, hasPayload, hasForm)
}

mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain, testMode: true, testModeLogger: logger })

const data = {
  from: 'mailgunjs+test1@gmail.com',
  to: 'mailgunjstest+recv1@gmail.com',
  subject: 'Test email subject',
  text: 'Test email text'
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
```

Sample output:

```
POST /v3/sandbox12345.mailgun.org/messages payload: true form: false
undefined
```

## Tests

To run the test suite you must first have a Mailgun account with a domain setup. Then create a file named _./test/data/auth.json_, which contains your credentials as JSON, for example:

```json
{ "api_key": "XXXXXXXXXXXXXXXXXXXXXXX", "public_api_key": "XXXXXXXXXXXXXXXXXXXXXXX", "domain": "mydomain.mailgun.org" }
```

You should edit _./test/data/fixture.json_ and modify the data to match your context.

Then install the dev dependencies and execute the test suite:

```
$ npm install
$ npm test
```

The tests will call Mailgun API, and will send a test email, create route(s), mailing list and mailing list member.

## Notes

This project is not endorsed by or affiliated with [Mailgun](http://www.mailgun.com).
The general design and some code was heavily inspired by [node-heroku-client](https://github.com/jclem/node-heroku-client).

## License

Copyright (c) 2012 - 2017 OneLobby and Bojan D.

Licensed under the MIT License.