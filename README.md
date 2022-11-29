# Displate Discord Notifier

My friends and I kept missing some really good Limited Edition Displates, so I made this bot to notify us when new ones come out
Discord bot that uses the Displate Limited Edition api to pull information about current and upcoming Limited Edtions.

## Features

- Lists all of the current and upcoming Limited Edition Displates in a configurable channel
- Updates the messages every hour
  - Can be triggered manually
- Pings a configurable role when a new Limited Edition is announced
- Deletes messages when the Displate has sold out
- Shows the amount of time left before the active Displates stop being sold
- Shows the number of Displates that are left
- Shows the amount of time until the email for members goes out to purchase the upcoming Displates
- Shows the amount of time until non-members are able to purchase the upcoming Displates

## Limitations
I only designed the bot to run on a single server, though it would be pretty easy to allow it to support multiple servers. Because of this limitation you will have to self host this bot if you would like to use it. The repo includes a docker container to make it easy to deploy.

## Photos
![Active Limited Edition](/assets/active-limited.png)
![Upcoming Limited Edition](/assets/upcoming-limited.png)
![Unreleased Ultra Limited Edition](/assets/unreleased-ultra-limited.png)

