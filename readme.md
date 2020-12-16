# Niles Discord Bot
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a1440f5f9d23451a867348e5f9c1724e)](https://www.codacy.com/app/seanecoffey/Niles?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=seanecoffey/Niles&amp;utm_campaign=Badge_Grade)

A [Discord](https://discord.com/) bot for using [Google Calendar](calendar.google.com) to manage events.
Targeted towards eSports event scheduling (scrims, PCWs).

![example](https://i.imgur.com/3yYK4QB.png)

## Getting Started

[Invite the hosted bot to your Discord here](https://discord.com/oauth2/authorize?permissions=97344&scope=bot&client_id=320434122344366082).

Join the [Niles Discord server](https://discord.gg/jNyntBn) for support, bug reporting and feature requests.

Visit the Niles [website](http://niles.seanecoffey.com/) or [setup guide](http://niles.seanecoffey.com/start) for more detailed use and setup descriptions.

If you wanted to host your own version or similar, these instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* [Node.js](https://nodejs.org/en/) - v12 or higher

### Installing

Setup your Discord app on the [Discord developers website](https://discord.com/developers/applications/me).

Note: To add a development bot to your Discord server, visit https://discord.com/api/oauth2/authorize?client_id=YOUR_APP_ID&scope=bot&permissions=97344 replacing your app id in the URL.

Set up a [Google Service Account](https://developers.google.com/identity/protocols/OAuth2ServiceAccount).
For more information on setting up a Google Service Account, [see here](https://github.com/yuhong90/node-google-calendar/wiki#setup-service-accounts).

Create your own `secrets.json` file in `/config`, using the appropriate values, making sure you also place a copy of your Google Service Account JSON security file somewhere and referencing in `secrets`.

Next you will need to copy the `stores.json.example` in the `/stores` file 3 times.
Rename those files to these names.
```
store.json
```
```
guilddatabase.json
```
```
users.json
```

To run and connect your bot

```
npm install
```

```
node index.js
```

## Built With

* [Discord.js](https://github.com/discordjs/discord.js) - NodeJS library for interfacing with the Discord API
* [node-google-calendar](https://github.com/mchangrh/node-google-calendar) - Simple Node module that supports Google Calendar API

## License

This project is licensed under the MIT License
