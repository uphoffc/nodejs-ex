# Getting started

Install node.js and npm. Then run
```
npm install
npm start
```
and go to http://localhost:8080/

# Edit slides

Edit public/index.html

# Modify theme or client script

Install sass and browserify.
```
npm install -g sass
npm install -g browserify
```
Modify
```
css/theme/source/tum.scss # Theme
client.js # Client source
```
then run
```
./build.sh
```
Hint: browserify and sass have a --watch option which will monitor your file for changes.

# Change password

Modify hash in server.js@17. Create hash with bcyrpt.
