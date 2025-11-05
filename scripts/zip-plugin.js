const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function incrementPatchVersion(version) {
  const parts = version.split('.');
  let major = parseInt(parts[0]) || 0;
  let minor = parseInt(parts[1]) || 0;
  let patch = parseInt(parts[2]) || 0;
  
  patch++; // Always increment patch
  
  return `${major}.${minor}.${patch}`;
}

function updateVersion(newVersion) {
  // Update plugin.xml
  let pluginXml = fs.readFileSync('plugin.xml', 'utf8');
  pluginXml = pluginXml.replace(/version="[^"]+"/, `version="${newVersion}"`);
  fs.writeFileSync('plugin.xml', pluginXml);
  
  // Update navigation JSON if it exists
  const pageCatalogPath = 'web_root/pagecataloging';
  if (fs.existsSync(pageCatalogPath)) {
    const navFiles = fs.readdirSync(pageCatalogPath).filter(f => f.endsWith('Nav.json'));
    navFiles.forEach(file => {
      const navPath = path.join(pageCatalogPath, file);
      console.log(`Updating version in ${file}...`);
      let navJson = fs.readFileSync(navPath, 'utf8');
      navJson = navJson.replace(/"version":\s*"[^"]+"/, `"version": "${newVersion}"`);
      fs.writeFileSync(navPath, navJson);
    });
  }
}

function zipPlugin() {
  // Read current plugin info
  const pluginXml = fs.readFileSync('plugin.xml', 'utf8');
  const nameMatch = pluginXml.match(/name="([^"]+)"/);
  const versionMatch = pluginXml.match(/version="([^"]+)"/);
  
  const pluginName = nameMatch ? nameMatch[1] : 'plugin';
  const currentVersion = versionMatch ? versionMatch[1] : '1.0.0';
  
  // Increment patch version
  const newVersion = incrementPatchVersion(currentVersion);
  updateVersion(newVersion);
  
  console.log(`Plugin: ${pluginName}`);
  console.log(`Version: ${currentVersion} → ${newVersion}`);
  
  // Create iterations directory if it doesn't exist
  const iterationsDir = 'iterations';
  if (!fs.existsSync(iterationsDir)) {
    fs.mkdirSync(iterationsDir);
    console.log(`Created ${iterationsDir}/ directory`);
  }
  
  // Create zip filename
  const zipFileName = `${pluginName.replace(/\s+/g, '')}_${newVersion}.zip`;
  const zipPath = path.join(iterationsDir, zipFileName);
  
  console.log(`Creating ${zipPath}...`);
  
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  output.on('close', () => {
    console.log(`✅ Created ${zipPath} (${archive.pointer()} bytes)`);
  });
  
  archive.on('error', (err) => {
    throw err;
  });
  
  archive.pipe(output);
  
  // Add plugin files (exclude node_modules, .git, iterations, etc.)
  archive.directory('web_root', 'web_root');
  archive.directory('queries_root', 'queries_root');
  archive.directory('permissions_root', 'permissions_root');
  archive.file('plugin.xml', { name: 'plugin.xml' });
  
  archive.finalize();
}

zipPlugin();