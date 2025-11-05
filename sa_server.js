/*  CPMinator Watch Service
-- A PowerSchool CPM developer tool
-- watches a development folder and reports changes to the CPMinator custom page
-- CPMinator grabs changed files and pushes them in CMP
*/

// Include Dependencies
var fs = require("fs");
var path = require("path");

// Configuration Settings (default settings)
var webroot = "/development/webroot"; // the root development folder on your local machine
var webport = 8000; // the SSL port that you will serve change reports on

// if parameters exist use those instead
if (process.argv[2]) webroot = process.argv[2];
if (process.argv[3]) webport = process.argv[3];

// Ensure webroot is an absolute path
if (!path.isAbsolute(webroot)) {
  webroot = path.resolve(webroot);
}
var http = require("http");
var https = require("https");
var express = require("express");
var chokidar = require("chokidar");
var allowQuery = false;

// SSL Web Service (self-signed cert)
const credentials = {
  key: fs.readFileSync("localhost.key"),
  cert: fs.readFileSync("localhost.crt"),
};

var app = express();
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

var timestamp = Date.now();
var cpmwatch = [{ timestamp: timestamp, action: "init", file: "", status: "" }];

chokidar.watch(webroot).on("all", (event, filePath) => {
  // Use path.relative to get proper relative path (handles Windows/Unix paths correctly)
  var rel_path = path.relative(webroot, filePath);
  // Normalize to forward slashes for CPM compatibility
  rel_path = rel_path.replace(/\\/g, "/");
  // Ensure no leading slash
  if (rel_path.startsWith("/")) {
    rel_path = rel_path.substring(1);
  }
  timestamp = Date.now();

  // put the change into the array
  if (allowQuery) {
    cpmwatch.push({
      timestamp: timestamp,
      action: event,
      file: rel_path,
      status: "pending",
    });
    console.log(event, rel_path, timestamp);
  }
});

app.get("/", function (req, res) {
  var content =
    'Steel Alloy says, "This server is not the server you\'re looking for ..."';
  res.send(content);
});

app.get("/cpminfo/:ts", function (req, res) {
  // ts is the timestamp of the last request
  if (req.params.ts == 0) {
    // if zero, send the timestamp of the last time only
    res.send(JSON.stringify(cpmwatch[cpmwatch.length - 1].timestamp));
    console.log(
      "Steel Alloy checked in! Now serving changes in " + webroot + "..."
    );
    allowQuery = true;
  } else {
    // limit rows to 100 [added for protection]
    if (cpmwatch.length > 100) {
      cpmwatch.splice(0, cpmwatch.length - 100);
    }

    // otherwise send all the items greater than timestamp
    var actions = [];
    if (allowQuery) {
      var actions = cpmwatch.filter((item) => item.timestamp > req.params.ts);
    }
    res.send(JSON.stringify(actions));
  }
});

app.get("/cpmfile/:ts", function (req, res) {
  // ts is the timestamp of the requested file
  var request = cpmwatch.find((item) => item.timestamp == req.params.ts);
  if (request) {
    // File path is already normalized with forward slashes from the watch handler
    // Convert back to OS-specific path for file system access
    var filePath = request.file.replace(/\//g, path.sep);
    var filename = path.join(webroot, filePath);
    res.sendFile(filename);
  } else {
    res.status(404).send("File not found");
  }
});

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(webport, function () {
  var host = httpsServer.address().address;
  var port = httpsServer.address().port;
  console.log(
    "listening at https://%s:%s, and watching %s",
    host,
    port,
    path.relative(process.cwd(), webroot) || 'web_root'
  );
});
