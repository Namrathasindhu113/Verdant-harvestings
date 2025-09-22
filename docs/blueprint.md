# **App Name**: Verdant Harvests

## Core Features:

- Secure Farmer Login: Authenticate farmers securely using Firebase Authentication.
- Harvest Record Capture: Capture harvest details including GPS coordinates, herb name, quantity, and photo uploads.
- Harvest Record Storage: Save harvest records to Firebase Firestore, associated with the farmer's account.
- Photo Storage: Store harvest photos in Firebase Storage, linking them to the appropriate harvest record.
- Offline Mode with Sync: Enable farmers to record harvest data even when offline, synchronizing data with Firestore when a connection is available.
- Rewards Display: Display the farmer's rewards points balance fetched from Firestore in real time. Optionally, recommend actions the farmer can take to earn more rewards; this functionality is implemented via tool-assisted AI.
- Harvest Summary and List: List recent harvests

## Style Guidelines:

- Primary color: Deep green (#386641), evoking the app's theme.
- Background color: Light beige (#F2E8CF) creates a natural, earthy backdrop.
- Accent color: Warm gold (#D6AD60) to highlight interactive elements and rewards.
- Body and headline font: 'PT Sans', a modern yet humanist sans-serif font for readability.
- Use clean, outline-style icons related to farming and herbs.
- Prioritize a clean, card-based layout to organize harvest records and information effectively.
- Incorporate smooth transitions and subtle animations for user interactions, like swiping between records or updating rewards.