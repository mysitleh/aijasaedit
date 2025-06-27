# AI Edit Landing

A modern web application built with Next.js and Firebase, providing AI-powered photo and video editing services.

## Features

- **AI Transformation:** Upload your media and get several AI-generated transformation options.
- **Order Form:** A seamless ordering process to request custom edits.
- **Responsive Design:** An elegant and modern interface that works on all devices.
- **Built with Modern Tech:** Next.js, React, Tailwind CSS, ShadCN UI, Genkit, and Firebase.

---

## Deployment Options

You can deploy this application on various platforms. Below are guides for Firebase (recommended for leveraging the full backend setup) and Vercel.

### Prerequisites

- **Node.js:** Ensure you have Node.js version 18 or newer installed.
- **Firebase Account:** You need a Google account to use Firebase.
- **Git & GitHub Account:** You need to host your code on GitHub to deploy to Vercel.

---

### Option 1: Firebase App Hosting (Full-Featured)

Follow these steps to set up Firebase and get your application online using Firebase App Hosting.

#### Step 1: Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** and follow the prompts to create a new project. Give it a memorable name, like `ai-edit-landing-app`.
3.  Once the project is created, you'll be taken to the project dashboard. Click the **</>** (Web) icon to add a new web app to your project.
4.  Give your app a nickname (e.g., "AI Edit Landing Web") and click **"Register app"**.
5.  Firebase will provide you with a `firebaseConfig` object. **Copy this object**, we'll need it in the next step.

#### Step 2: Configure Environment Variables

Environment variables are used to securely store your API keys and other sensitive configurations.

1.  In your project root, create a new file named `.env`.
2.  Copy the contents from the `firebaseConfig` object you got in Step 1 and format it like this:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy...YOUR_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="1:your-sender-id:web:your-app-id"
```

#### Step 3: Set Up Firestore Database

Firestore will be used to store order details.

1.  In the Firebase Console, go to the **Build > Firestore Database** section.
2.  Click **"Create database"**.
3.  Choose to **Start in production mode** and click **"Next"**.
4.  Select a Cloud Firestore location that is closest to your users (e.g., `nam5 (us-central)` for North America) and click **"Enable"**.
5.  After the database is created, go to the **"Rules"** tab. Replace the existing rules with the following and click **"Publish"**:

    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Deny all access by default
        match /{document=**} {
          allow read, write: if false;
        }

        // Allow clients to create new orders, but only with valid data.
        // This provides server-side validation to prevent bad data.
        match /orders/{orderId} {
          allow create: if request.resource.data.name is string &&
                           request.resource.data.name.size() >= 2 &&
                           request.resource.data.contact is string &&
                           request.resource.data.contact.size() >= 5 &&
                           request.resource.data.service is string &&
                           request.resource.data.service.size() > 0 &&
                           request.resource.data.message is string &&
                           request.resource.data.message.size() >= 10 &&
                           request.resource.data.message.size() <= 500 &&
                           request.resource.data.file_url is string &&
                           request.resource.data.file_url.matches('https://firebasestorage.googleapis.com/.*') &&
                           request.resource.data.created_at == request.time &&
                           request.resource.data.status == 'pending_payment' &&
                           request.resource.data.keys().hasOnly(['name', 'contact', 'service', 'message', 'file_url', 'created_at', 'status']);
        }
      }
    }
    ```

#### Step 4: Set Up Firebase Storage

Storage is used for storing user-uploaded files.

1.  In the Firebase Console, go to the **Build > Storage** section.
2.  Click **"Get started"**.
3.  Choose to **Start in production mode** and click **"Next"**.
4.  Use the same location as your Firestore and click **"Done"**.
5.  After the storage bucket is created, go to the **"Rules"** tab. Replace the existing rules with the following and click **"Publish"**:
    ```
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        // Deny all access by default
        match /{allPaths=**} {
          allow read, write: if false;
        }

        // Allow anyone to upload files to the 'uploads' folder.
        // Restrict file size to 10MB, matching frontend validation.
        match /uploads/{fileName} {
          allow write: if request.resource.size < 10 * 1024 * 1024;
        }

        // Allow public read access to generated images
        match /generated/{fileName} {
            allow read: if true;
        }
      }
    }
    ```

#### Step 5: Deploy to Firebase App Hosting

1.  **Install Firebase CLI:** If you haven't already, install it globally.
    ```bash
    npm install -g firebase-tools
    ```
2.  **Login to Firebase:**
    ```bash
    firebase login
    ```
3.  **Connect Your Project:** Run the following command to link your local folder to the Firebase project.
    ```bash
    firebase init apphosting
    ```
    - Select your Firebase project from the list.
    - Confirm the backend location (you can leave it as default).
4.  **Deploy Your App:**
    ```bash
    firebase deploy
    ```

This process will build and deploy your Next.js application. Once it's done, the CLI will give you the public URL where your app is live.

---

### Option 2: Vercel (via GitHub)

Vercel is an excellent platform for hosting Next.js apps, offering a seamless deployment experience through GitHub.

#### Step 1: Push Your Code to GitHub

1.  Create a new repository on [GitHub](https://github.com/new).
2.  In your local project folder, initialize Git and push your code:
    ```bash
    git init -b main
    git add .
    git commit -m "Initial commit"
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git push -u origin main
    ```
    (Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub details.)

#### Step 2: Deploy on Vercel

1.  Go to [Vercel](https://vercel.com/new) and sign up with your GitHub account.
2.  Click **"Import Git Repository"** and select the repository you just pushed.
3.  Vercel will automatically detect that it's a Next.js project.
4.  Expand the **"Environment Variables"** section. Copy all the keys and values from your local `.env` file and add them here one by one. This is a crucial step to connect your app to Firebase.
5.  Click the **"Deploy"** button.

Vercel will now build and deploy your application. In a few moments, it will provide you with a public URL. Every time you push a new commit to your `main` branch on GitHub, Vercel will automatically redeploy the changes.
