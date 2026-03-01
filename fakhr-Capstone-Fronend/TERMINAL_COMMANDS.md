# Terminal Commands - Copy & Paste

## 🎯 Quick Start (Copy these commands)

### Option 1: Run iOS Simulator

```bash
cd /Users/ajayeb/Desktop/Sanad-Capstone-Fronend
npm install
npx expo install --fix
npm run ios
```

### Option 2: Run Android Emulator

```bash
cd /Users/ajayeb/Desktop/Sanad-Capstone-Fronend
npm install
npx expo install --fix
npm run android
```

### Option 3: Start Expo Server (Manual)

```bash
cd /Users/ajayeb/Desktop/Sanad-Capstone-Fronend
npm install
npx expo install --fix
npm start
# Then press 'i' for iOS or 'a' for Android
```

---

## 🔧 If Simulator Doesn't Work

### Clear Everything and Reinstall

```bash
cd /Users/ajayeb/Desktop/Sanad-Capstone-Fronend
rm -rf node_modules package-lock.json .expo
npm cache clean --force
npm install
npx expo install --fix
npm start -- --clear
```

### Check Expo Version

```bash
npx expo --version
```

### Verify Dependencies

```bash
npm list expo
npm list expo-router
```

---

## 📱 What Should Happen

After running `npm run ios` or `npm run android`:

1. ✅ Terminal shows: "Starting Metro Bundler"
2. ✅ Terminal shows: "Starting iOS Simulator" or "Starting Android Emulator"
3. ✅ Simulator/Emulator opens automatically
4. ✅ App builds and loads
5. ✅ You see the Login screen (if not logged in) or Home screen (if logged in)

---

## ⚠️ Troubleshooting

### Problem: "expo not found"

**Solution:**

```bash
npm install expo@~54.0.33
```

### Problem: Simulator doesn't open

**Solution:**

- iOS: Make sure Xcode is installed and iOS Simulator is available
- Android: Make sure Android Studio is installed and an AVD is created

### Problem: App doesn't load

**Solution:**

```bash
npm start -- --clear
# Then reload in simulator: Cmd+R (iOS) or R+R (Android)
```

---

## ✅ Success Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Expo dependencies fixed (`npx expo install --fix`)
- [ ] Simulator/Emulator is running
- [ ] Expo server is running
- [ ] App loads in simulator
- [ ] No errors in terminal
