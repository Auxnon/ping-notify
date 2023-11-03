// https://crontab.guru/

import https from "https";
import schedule from "node-schedule";

const SITES = ["https://MakeAvoy.com", "https://Petrichor64.app"];
const SIMPLEPUSH_KEY = "C5KUQv";
schedule.scheduleJob("0 8-23/1 * * *", () => {
  // run every hour from 08:00 to 23:00

  const failed = [];
  const promises = SITES.map(
    (site) =>
      new Promise((resolve, reject) => {
        https
          .get(`${site}/health`, (res) => {
            //   console.log(res);
            if (res.statusCode !== 200) {
              console.log(`❌ Site ${site} is down`);
              if (!failed.includes(site)) failed.push(site);
            } else {
              console.log(`✅ Site ${site} is up`);
            }
            resolve();
          })
          .on("error", (e) => {
            console.log(`❓Cannot resolve site ${site}`);
            if (!failed.includes(site)) failed.push(site);
            resolve();
          });
      })
  );

  Promise.all(promises).then(() => {
    if (failed.length) {
      console.log(`❌❌Site ${failed.join(", ")} is down`);
      const data = JSON.stringify({
        key: SIMPLEPUSH_KEY,
        title: "Site down",
        msg: `Site ${failed.join(", ")} is down`,
        event: "site-down",
      });

      const req = https.request(
        {
          host: "simplepu.sh",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "content-length": data.length,
          },
        },

        (res) => {
          console.log(res);
        }
      );
      req.write(data);
      req.end();
    }
  });
});

// 0/1 * * * *
