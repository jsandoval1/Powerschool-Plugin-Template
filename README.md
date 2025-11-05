# PowerSchool Plugin Template

A complete starter template for PowerSchool plugin development with integrated Steel Alloy live server for real-time file synchronization.

## Two Ways to Get Started

### Just Want the Files? (Recommended - No Git)
**Perfect for simple projects or if you'll set up Git later:**

1. **[📦 Download ZIP](https://github.com/jsandoval1/powerschool-plugin-template/archive/refs/heads/main.zip)**
2. Extract to your desired folder  
3. Start coding immediately - no Git tracking!

### Want a GitHub Repository?
**Perfect if you want version control from the start:**

1. Click **"Use this template"** button above
2. Creates a new repo in **your** GitHub account  
3. Clone your new repo and start developing

---

**Note:** Both methods give you the same files. The ZIP method is simpler and gives you complete freedom to set up version control later (or not at all if you so choose).

##  Setup Instructions

### Step 1: Customize Your Plugin

Replace all placeholder values in these files:

#### 📄 `plugin.xml`
```xml
<plugin name="[PLUGIN_NAME]"> => Name your plugin
<plugin version="[PLUGIN_VERSION]"> => Version your plugin
<plugin description="[PLUGIN_DESCRIPTION]"> => Describe your plugin
<publisher name="[PUBLISHER_NAME]"> => Your name as the publisher
<publisher email="[PUBLISHER_EMAIL]"> => Your email as the publisher
```

#### 📁 File & Folder Renaming

1. **Admin folder**: Rename `web_root/admin/[PLUGIN_FOLDER]/` to your plugin folder:
   ```bash
   mv "web_root/admin/[PLUGIN_FOLDER]" "web_root/admin/myawesomeplugin"
   ```

2. **Navigation file**: Rename and edit `web_root/pagecataloging/[PLUGIN_NAME]Nav.json`:
   ```bash
   mv "web_root/pagecataloging/[PLUGIN_NAME]Nav.json" "web_root/pagecataloging/MyAwesomePluginNav.json"
   ```
   
   Then edit the content:
   ```json
   {
       "pages": [
           {
               "htmlID": "navFreeMyAwesomePlugin",
               "title": "My Awesome Plugin",
               "pageURL": "/admin/myawesomeplugin/home.html",
               "version": "1.0.0",
               ...
           }
       ]
   }
   ```

3. **Query file**: Rename `queries_root/[PLUGIN_NAME].named_queries.xml`:
   ```bash
   mv "queries_root/[PLUGIN_NAME].named_queries.xml" "queries_root/MyAwesomePlugin.named_queries.xml"
   ```

4. **Permission file**: Rename `permissions_root/[PLUGIN_NAME].permission_mappings.xml`:
   ```bash
   mv "permissions_root/[PLUGIN_NAME].permission_mappings.xml" "permissions_root/MyAwesomePlugin.permission_mappings.xml"
   ```

5. **Update home.html**: Edit `web_root/admin/[your-folder]/home.html` and replace `[PLUGIN_NAME]` with your plugin name.

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Generate SSL Certificates

The Steel Alloy server requires SSL certificates for localhost:

**Windows users (Git Bash/WSL):**
```bash
MSYS_NO_PATHCONV=1 openssl req -x509 -newkey rsa:4096 -keyout localhost.key -out localhost.crt -days 365 -nodes -subj "/CN=localhost"
```

This will generate the localhost.key and localhost.crt files in the root of your project folder.

### Step 4: Trust the SSL Certificates

**Windows users:**
1. Open File Explorer and navigate to your project folder
2. Right-click `localhost.crt` → **Install Certificate**
3. Select **Local Machine** → Next
4. Select **Place all certificates in the following store** → Browse
5. Select **Trusted Root Certification Authorities** → OK → Next → Finish



### Step 5: Start Development Server

```bash
npm start
```

You should see:
```
listening at https://:::8000, and watching web_root
```

Visit `https://localhost:8000` to verify the server is running (you should see a Steel Alloy message).

## 🔧 PowerSchool Setup (Steel Alloy CPM)

### Install Steel Alloy Plugin

1. **Download Steel Alloy CPM plugin** from the [PowerSchool Community](https://support.powerschool.com/developer/#/page/steel-alloy-cpm)
2. **Install in PowerSchool**: System → Plugin Management → Install
3. **Navigate to Steel Alloy**: System → Page and Data Management → Steel Alloy CPM

### Configure Steel Alloy

1. **Server URL**: `https://localhost:8000`
2. **Click START**
3. **Verify connection**: You should see "Running..." status

### Test the Live Sync

1. Edit any file in `web_root/` (e.g., modify `home.html`)
2. Save the file
3. Check Steel Alloy CPM - you should see the file change detected
4. The file will automatically sync to PowerSchool!

## 📦 Building & Distribution

### Create Plugin Zip

```bash
npm run zip
```

This will:
- Automatically increment the patch version (1.0.0 → 1.0.1)
- Update version in `plugin.xml` and navigation files
- Create `iterations/YourPlugin_1.0.1.zip`
- Ready for PowerSchool installation!

### Version History

All plugin versions are saved in the `iterations/` folder:
```
iterations/
├── MyPlugin_1.0.1.zip
├── MyPlugin_1.0.2.zip
└── MyPlugin_1.0.3.zip
```

## 📁 Project Structure

```
your-plugin/
├── plugin.xml                    # Plugin metadata
├── web_root/                     # Main plugin files (watched by server)
│   ├── admin/
│   │   └── yourplugin/          # Your custom pages
│   │       └── home.html
│   └── pagecataloging/
│       └── YourPluginNav.json   # Navigation menu
├── queries_root/                # PowerQueries (optional)
│   └── YourPlugin.named_queries.xml
├── permissions_root/            # Permission mappings (optional)
│   └── YourPlugin.permission_mappings.xml
├── iterations/                  # Generated zip files
├── sa_server.js                # Live development server
├── localhost.key               # SSL certificate (generated)
├── localhost.crt               # SSL certificate (generated)
└── package.json               # Dependencies & scripts
```

## 🛠 Available Commands

```bash
npm start          # Start development server (watches web_root)
npm run dev        # Same as start
npm run zip        # Bump version + create distribution zip, gets thrown into the iterations folder
```

## 🔍 Troubleshooting

### SSL Certificate Issues
- **Browser security warning**: Click "Advanced" → "Proceed to localhost"
- **Steel Alloy connection failed**: Ensure certificate is trusted in system keychain
- **Certificate generation failed on Windows**: Use `MSYS_NO_PATHCONV=1` prefix with the OpenSSL command
- **Certificate expired**: Regenerate with the OpenSSL commands above

### Steel Alloy Not Detecting Changes
- Verify server is running (`npm start`)
- Check Steel Alloy server URL is `https://localhost:8000`
- Ensure you clicked "START" in the Steel Alloy CPM plugin on your server
- Check browser console for CORS errors

### Plugin Installation Issues
- Verify `plugin.xml` syntax is valid
- Check all placeholder values are replaced
- Ensure zip file contains proper directory structure



