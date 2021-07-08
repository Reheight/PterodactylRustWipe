const CronJob = require('cron').CronJob;
const config = require('./config.json');
const axios = require('axios').default;
const moment = require("moment-timezone");
const nodeactyl = require("nodeactyl");

const pteroAPI = new nodeactyl.NodeactylClient(config.PANEL_URL, config.API_KEY);

const getFiles = async (SERVER_ID, DIRECTORY = "") => {
  const response = await axios({
    url: `${config.PANEL_URL}/api/client/servers/${SERVER_ID}/files/list?directory=${encodeURI(DIRECTORY)}`,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.API_KEY}`
    },
    method: "GET"
  }).catch(null);

  return response.data.data;
}

const deleteFile = async (SERVER_ID, ROOT, FILENAME) => {
  await axios({
    url: `${config.PANEL_URL}/api/client/servers/${SERVER_ID}/files/delete`,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.API_KEY}`
    },
    data: {
      "root": ROOT,
      "files": [
        FILENAME
      ]
    },
    method: "POST"
  }).catch(() => console.log(`Error while deleting: ${ROOT}/${FILENAME}`));
}

config.WIPES.forEach(async ({ SERVER_ID, SERVER_IDENTITY, FORCE_WIPE, CRON, TIMEZONE, BLUEPRINT_WIPE, EXTRA_FILES }) => {
  const currTime = moment().tz(TIMEZONE);

  const job = new CronJob(CRON, async () => {
    pteroAPI.killServer(SERVER_ID);

    if (FORCE_WIPE && currTime.date() > 7)
      return;

    const files = await getFiles(SERVER_ID, `/server/${SERVER_IDENTITY}`);
    if (!files || files == null)
      return;
    
    files.forEach(async file => {
      const filename = file.attributes.name;
      
      if (filename == "cfg" || filename == "companion.id")
        return;
    
      if (filename.includes("player.blueprints") && !BLUEPRINT_WIPE)
        return;
      
      await deleteFile(SERVER_ID, `/server/${SERVER_IDENTITY}`, filename);

      EXTRA_FILES.forEach(async ({ DIRECTORY, FILE }) => {
        await deleteFile(SERVER_ID, DIRECTORY, FILE);
      });
      
      pteroAPI.startServer(SERVER_ID);
    });
  }, null, true, TIMEZONE);
  
  job.start();
})

