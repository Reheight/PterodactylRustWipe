## PterodactylRustWipe
Automatic wiping tool for Rust Servers that are using the Pterodactyl Game Management Panel.

This system, including the README file are still a WIP and will be continuously updated as time progresses.


## Getting Started

In order to get the system running there are a few things you will need to do. Install some NPM packages, generate an API key, modify the config and get it up and running!

### Prerequisites

1. You will need NodeJS, and Node Package Manager (NPM).
2. You will need to leave the node shell running, or use a service manager such as PM2 or NSSM.
3. Retrieve API key from your Panel. (https://YourPanel.com/account/api).

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Reheight/PterodactylRustWipe.git
   ```
2. Install NPM packages
   ```sh
   npm install cron axios moment-timezone cron-parser nodeactyl --save
   ```
3. Edit config.json
   ```javascript
   {
  "API_KEY": "PTERODACTYL API KEY",
  "PANEL_URL": "PANEL URL",
  "WIPES": [
    {
      "SERVER_ID": "SERVER ID",
      "SERVER_IDENTITY": "rust",
      "BLUEPRINT_WIPE": false,
      "CRON": "0 16 * * WED",
      "SERVER_NAME": "YOUR SERVER NAME",
      "FORCE_WIPE": false,
      "TIMEZONE": "America/New_York",
      "EXTRA_FILES": [
        {
          "DIRECTORY": "/oxide/data",
          "FILE": "Statistics.json"
        }
      ]
    },
    {
      "SERVER_ID": "SERVER ID",
      "SERVER_IDENTITY": "rust",
      "BLUEPRINT_WIPE": false,
      "CRON": "0 16 * * THU",
      "SERVER_NAME": "YOUR SERVER NAME",
      "FORCE_WIPE": true,
      "TIMEZONE": "America/New_York",
      "EXTRA_FILES": []
    }
  ]
}
```
