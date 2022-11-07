# x11docker-kodi-starter
Starting x11docker kodi with KORE 

## Install 
1. Prepare: 
 - Install node
 - Install NPM 
 - Install KORE on your smartphone
2. Cone Repository with 
`git clone https://github.com/SHoen/x11docker-kodi-starter.git `
3. Configure
- Create `.env`file and set PORT and your Kodi START command
- Open KORE and configure WAKE UP on LAN with the MAC address of your media center and set the PORT  to the same value of the .env file

## Use 
1. Start server with `$ node index.js`
2. Open KORE and Press WAKE UP

Kodi Media center should start. 

## Furhter Steps.
Autostart - start the server after booting 
