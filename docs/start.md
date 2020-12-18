---
layout: default
title: Getting Started
nav_order: 2
---

# Getting Started
{: .no_toc }

## Steps
{: .no_toc .text-delta}

1. TOC
{:toc}

---

## Invite Niles to your server

[Invite Niles](https://discord.com/oauth2/authorize?client_id=320434122344366082&scope=bot&permissions=523344){: .btn}

---

## Configure Google Calendar

Select or create a [Google Calendar](https://calendar.google.com), and select 'Settings and sharing'
{: .pb-4 }

ricky [gcalexample](../../assets/images/gcal-example-0.gif)
{: .text-center .pb-4 }

Scroll down and under 'Share with specific people', add `discordbot@nylastrial.iam.gserviceaccount.com` and give permissions to `Make changes to events`
{: .pb-4 }

ricky [gcalexample](../../assets/images/gcal-example-1.gif)
{: .text-center}

---

## Add Google Calendar to your Niles Configuration

Still on the 'Settings and sharing' page, scroll down to 'Integrate Calendar' and copy the calendar ID.
{: .pb-4 }

ricky [gcalidexample](../../assets/images/gcal-example-2.png)
{: .text-center .pb-4 }

Now in your Discord server (in a channel where Niles will have permissions, i.e. #general or another channel you have setup) we can use `ricky id` with the usage `ricky id calendarID` i.e:

`ricky id qb9t3fb6mn9p52a4re0hc067d8@group.calendar.google.com`

ricky [discord-calendar-id-example](../../assets/images/discord-calendar-id.gif)
{: .text-center}

---

## Configure Timezone

We could pull this from your Google calendar or Discord server, but since your members might be in different timezones, you must add your own.

This can be done using `ricky tz` i.e.

`ricky tz America/New_York`
`ricky tz UTC+5`
`ricky tz EST`

ricky [discord-tz-example](../../assets/images/discord-tz.gif)
{: .text-center}

[Full list of TZ database names on Wikipedia](https://cutt.ly/tz)

---

## Run your calendar for the first timericky 

Great now we can tell Niles to pull events from our GCal, setting up the database and display our calendar.

`ricky display` - Displays the calendar WITHOUT deleting any messages.

Both methods pin the current calendar to the channel it was called in.

The calendar will automatically check for updates every 5 minutes, but you can manually use `ricky update` to pull any updates.

ricky [discord-display-example](../../assets/images/discord-display.gif)
{: .text-center }

---

## Customise it

You can change the way Niles looks and behaves, depending on your needs. See the [detailed customisation documentation](../customisation).
