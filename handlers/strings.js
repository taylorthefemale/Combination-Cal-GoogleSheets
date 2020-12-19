const HELP_MESSAGE = "```\
        Mc3 Mustang E-Sports Calendar Help Settings\n\
---------------------------\n\
!display             -  Display your calendar\n\
!update / !sync      -  Update the Calendar\n\
!create / !scrim     -  Create events using GCal's default interpreter - works best like !scrim xeno June 5 8pm - 9pm\n\
!delete              -  Delete an event using the form !delete <event_title>, ONLY works when the title matches the one in Google Calendar\n\
!clean / !purge      -  Deletes messages in current channel, !clean <number>\n\
!stats / !info       -  Display list of statistics and information about the ricky bot\n\
!invite              -  Get the invite link for ricky to join your server!\n\
!setup               -  Get details on how to setup ricky\n\
!id                  -  Set the Google calendar ID for the guild\n\
!tz                  -  Set the timezone for the guild\n\
!prefix              -  View or change the prefix for ricky\n\
!displayoptions      -  Change formatting of the calendar display\n\
!admin               -  Restrict the usage of ricky to a specific role\n\
!help                -  Display this message\n\
```\ ";

const NO_CALENDAR_MESSAGE = "I can't seem to find your calendar! This is usually because you haven't invited ricky to access your calendar, run `!setup` to make sure you followed Step 1.\n\
You should also check that you have entered the correct calendar id using `!id`.\n\
\nIf you are still getting this error join the Discord support server here: https://discord.gg/jNyntBn";

const SETUP_HELP = "```\
        Mc3 Mustang E-Sports - SETUP MODE\n\
---------------------------\n\
NOTE: ALL COMMANDS BECOME AVAILABLE AFTER SETUP IS COMPLETE\n\
!setup               -  Get details on how to setup ricky for use.\n\
!prefix              -  View or change the prefix for ricky\n\
!id                  -  Set the Google calendar ID for the guild\n\
!tz                  -  Set the timezone for the guild\n\
!adminrole           -  Restrict the usage of ricky to a specific role\n\
!help                -  Display this message\n\
```\n\
Visit http://niles.seanecoffey.com/start for more info.";

const SETUP_MESSAGE = "\
Hi! My name is ricky. I'm an E-Sports bot made to make life in server easy and organized\' Lets get me setup for use in this Discord. The steps are outlined below \n\
\n1. Invite `discordbot@nylastrial.iam.gserviceaccount.com` to \'Make changes to events\' under the Permission Settings on the Google Calendar you want to use with Mc3-Mustangs-ESports\n\
2. Enter the Calendar ID of the calendar to Discord using the `!id` command, i.e. `!id 123abc@123abc.com`\n\
3. Enter the timezone you want to use in Discord with the `!tz` command, i.e. i.e. `!tz America/New_York` or `!tz UTC+4` or `!tz EST` No spaces in formatting.\n\
\n Mc3-Mustangs-ESports should now be able to sync with your Google calendar and interact with on you on Discord, try `!display` to get started!";

const RESTRICT_ROLE_MESSAGE = "\
You can restrict who can control the E-Sports bot and the associated Google Calendar with roles. \n\
Mc3-Mustangs-ESports will only allow one role to be used, and it must have a unique name. \n\
The person assigning the restriction must have the role being assigned. \n\
i.e. Create a role called *Scheduler*, and then tell ricky to only allow people with that role using `!admin Scheduler` (case sensitive)\n\
**Warning - Experimental Feature**";

const DISPLAYOPTIONS_USAGE =
`**displayoptions USAGE**\`\`\`
    COMMAND                      PARAMS        EFFECT
    !displayoptions help         (0|1)         hide/show help
    !displayoptions pin          (0|1)         pin calendar message
    !displayoptions format       (12|24)       12h or 24h clock display
    !displayoptions tzdisplay    (0|1)         hide/show timezone
    !displayoptions emptydays    (0|1)         hide/show empty days
    !displayoptions showpast     (0|1)         hide/show today's past events
    !displayoptions trim         (n)           trim event names to n characters (0 = off)
    !displayoptions days         (n)           number of days to display (max 90)
    !displayoptions style        (code|embed)  use old or new event display style (see niles.seanecoffey.com/customisation)
    !displayoptions inline       (0|1)         makes embed display inline (see niles.seanecoffey.com/customisation)
    !displayoptions description  (0|1)         hide/show event description (only compatible with embed)
    \`\`\`
    `;

module.exports = {
  HELP_MESSAGE,
  NO_CALENDAR_MESSAGE,
  SETUP_MESSAGE,
  SETUP_HELP,
  RESTRICT_ROLE_MESSAGE,
  DISPLAYOPTIONS_USAGE
};
