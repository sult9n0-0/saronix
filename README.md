# Saronix — Rescue Bot Frontend 🚨🤖

**Saronix** is a React Native app prototype for search-and-rescue operations in debris and disaster zones.  
It provides a user-friendly interface to **login**, **setup rescue bots**, and **monitor operations in real-time**.

---

## 📱 Features

- **User Authentication**: Login and registration screens with demo access  
- **Bot Setup**: Configure and deploy rescue bots  
- **Dashboard**: Monitor bot status, rescue operations, and alerts  
- **Admin Panel**: Manage users and bot access (for admin accounts)  
- **Error Handling**: Shows real-time alerts for invalid inputs or failed operations  
- **Demo Mode**: Quick demo login for testing without creating an account  

---
### 2. Start the App

    npx expo start

You can run the app on:

- Android via Expo Go or emulator
- iOS via Expo Go or simulator
- Web (limited support)

---

## Project Structure

app/
    screens/       # All app screens (Login, Register, Dashboard, BotSetup, Admin)
    components/    # Reusable UI components (buttons, inputs, toasters)
    hooks/         # Custom hooks (e.g., useAuth)
    lib/           # Utility functions

- Navigation is handled with expo-router and file-based routing
- State & API management can be added later with React Query or Context

---

## Demo Login

You can log in instantly for demo purposes:

- Email: demo@rescuebot.io
- Password: demo

Admin access is granted to any email containing "admin" for testing purposes.

---

## Future Development

- Integrate real backend for authentication and bot control
- Add real-time bot location and status updates
- Enable push notifications for alerts
- Enhance UI/UX for disaster scenarios

---

## Contribution

This is currently an in-house prototype. Contributions are welcome once the repo is public.

---

## Notes

- This app is a frontend prototype only
- Backend features like login validation, bot API integration, and data storage will be added later
- Use Expo Go for testing on mobile devices
