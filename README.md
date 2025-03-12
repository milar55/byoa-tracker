# Habit Tracker App

A simple habit tracking app built with React Native, Expo, TypeScript, and Firebase.

## Features

- Add habits with name, description, and frequency (daily, weekly, monthly)
- Track habits by marking them as completed
- View habit details and history
- See statistics about habits and completion rates
- Track streaks for habits
- Real-time data sync with Firebase

## Tech Stack

- React Native
- Expo
- TypeScript
- Firebase (Firestore)

## Setup

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Add a new web app to your Firebase project
3. Enable Firestore in your Firebase project
4. Copy your Firebase configuration
5. Update the `tracker/config/firebase.ts` file with your Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Running the App

```bash
npx expo start
```

## Project Structure

- `app/`: Contains all the screens and navigation setup (Expo Router)
- `components/`: Reusable UI components
- `context/`: Context providers for state management
- `types/`: TypeScript type definitions
- `config/`: Configuration files (Firebase, etc.)

## Future Enhancements

- Push Notifications
- Add habits to different categories
- More detailed statistics and graphs
- Goal setting for habits
- User authentication
- Sharing and social features

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
