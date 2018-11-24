# streetr

## Install
```bash
npm install
```

## Develop
1. Install the [Expo app](https://expo.io/tools#client) and ensure your mobile and computer are connected to the same network.
2. Run `npm start`.
3. Open the Expo app on your mobile and scan the QR code to test the app.
4. Code
5. Lint with `npm run lint`

## Troubleshooting
If you are using Ubuntu, you may have a recurring Watchman error. Run this command to solve it:
```bash
echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_watches && echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_queued_events && echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_instances && watchman shutdown-server && sudo sysctl -p
```
