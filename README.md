# KARUSDA Church Web Application

Welcome to the source code for the KARUSDA Church website. This guide is written for anyone who wants to understand how the website works, even if they are not a developer. The goal is to make the project easier to understand by explaining the main ideas in simple language.

## The Big Picture

This website is built with React, which is a tool for building interactive web pages. The site also uses Supabase as its backend. In simple terms, Supabase is the cloud service that stores the church content and helps the website load and save information securely.

Think of the website like a church office:
- The pages are the different rooms in the office.
- The components are the furniture and tools inside those rooms.
- The backend is the filing cabinet and storage room where information is kept.
- Supabase is the system that manages that storage room.

---

## What Is Supabase and Why Is It Used?

Supabase is a backend platform that gives the website three important services:

1. Database
   - This is where the website stores information such as announcements, events, leadership details, sermons, gallery images, and mission updates.
   - It acts like a digital record book for the church.

2. Authentication
   - This is the login system used by the admin panel.
   - It makes sure only authorized church administrators can add, edit, or remove content.

3. Storage
   - This is where uploaded files are kept, such as images, PDFs, and other documents.
   - When a file is uploaded, Supabase gives the website a public link to it, which can then be displayed on the website.

Supabase also supports real-time updates, which means that when one person changes something in the database, the website can refresh and show the latest information automatically.

---

## How the Backend Works in This Project

The frontend of the website is the part visitors see. The backend is the hidden part that makes everything work behind the scenes.

Here is the basic flow:
1. A visitor opens the website.
2. The app asks Supabase for the latest church information.
3. Supabase returns the data.
4. The website displays that data on the screen.

When an administrator logs in and adds content:
1. The admin enters information in the Admin page.
2. The website sends the new content to Supabase.
3. Supabase saves it in the database or storage.
4. The website updates to show the new content.

---

## The Database Explained

The database is the main home for the website content. Instead of storing content inside the code itself, the website keeps it in Supabase so it can be edited more easily.

The app uses several database tables, including:
- announcements: weekly announcements and notices
- events: services, gatherings, and volunteer opportunities
- gallery: photos for the gallery section
- leadership: church leaders and their profile information
- ministries: ministry groups and details
- choir: choir information and videos
- missions: mission outreach records
- sermon: sermon titles, speakers, dates, and links

These tables are like separate shelves in a filing cabinet. Each shelf holds a different kind of information.

### What happens in practice?
- When the homepage loads, it asks Supabase for announcements and leadership details.
- When the events page opens, it asks for the event list.
- When an admin saves a new announcement, the new row is written into the announcements table.

---

## Authentication Explained

Authentication means proving who is allowed to manage the website.

In this project, the Admin page uses Supabase Authentication with email and password sign-in. This is how the system checks whether someone is an approved administrator.

### In simple terms
- The admin enters an email and password.
- The website sends those details to Supabase.
- Supabase checks them.
- If they are correct, the user is considered signed in.

### What this protects
- Prevents random visitors from editing content
- Keeps the church website updates controlled
- Makes sure only trusted people can add or delete content

The login flow is handled mostly in the Admin page and the Supabase client setup.

---

## Storage Explained

Storage is where uploaded files are kept. The website allows admins to upload pictures and documents from the Admin page. These uploads are placed into Supabase Storage buckets.

Examples include:
- event images
- announcement photos
- leadership profile pictures
- mission documents
- gallery images

Once a file is uploaded, Supabase creates a public URL for it. That URL is then saved into the database so the website can display the file later.

### Why storage matters
- Files do not need to be stored inside the app code
- They can be uploaded from the admin panel
- They remain available online for the website to use

---

## Environment Variables

The app connects to Supabase using two important values:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

These values are stored in the environment so the website knows which Supabase project to connect to. They are read in the Supabase client file.

If these values are missing or incorrect, the website will not be able to connect to the backend.

---

## Important Files and What They Do

### 1. src/main.jsx
This is the first file that runs when the website starts. It loads the main React app and mounts it into the browser.

### 2. src/App.jsx
This file acts like the route guide of the website. It decides which page should appear based on the current URL, such as the Home page, Events page, Ministries page, or Admin page.

### 3. src/context/AppContext.jsx
This is one of the most important files in the project. It acts as the bridge between the frontend and Supabase.

It is responsible for:
- connecting to the database
- loading church data when the app starts
- saving new data entered in the Admin page
- deleting records when needed
- refreshing the site when content changes

This file is basically the middle layer that allows the website to talk to the backend.

### 4. src/lib/supabaseClient.js
This file creates the connection to Supabase. It uses the project URL and anonymous key to initialize the Supabase client.

In simple terms, this file is the key that opens the door between the app and the cloud backend.

### 5. src/lib/urlHelpers.js
This helper file cleans up video and image links so they display correctly. It helps normalize links entered by admins into a format the app can use properly.

### 6. src/pages/Admin.jsx
This is the control panel for church content. It lets administrators add, update, or remove site information.

It handles:
- login and logout
- uploading images and documents
- saving content to the database
- editing existing records
- deleting records

This is the most visible part of the backend workflow for non-technical users.

### 7. src/pages/Home.jsx, Events.jsx, Ministries.jsx, Missions.jsx
These are the main pages visitors see. They request the data from the app context and display it nicely on the page.

### 8. src/components
These are reusable pieces of the website, such as the navbar, footer, hero slider, and announcement cards. They receive data from the pages and display it in a consistent layout.

### 9. src/data/initialData.js
This file contains starter data for the website. It helps the app have a fallback set of values if the database is empty or not loaded yet.

---

## How the Website Uses the Backend in Daily Life

A normal example might look like this:
1. A church leader opens the Admin page.
2. They log in with their Supabase account.
3. They add a new announcement.
4. The announcement is saved to the Supabase database.
5. The homepage automatically shows the new announcement.

Another example:
1. A leader uploads a new photo for the gallery.
2. The file is stored in Supabase Storage.
3. The image link is saved in the database.
4. The gallery page loads the image from the saved link.

---

## Important Notes for Non-Developers

- The website does not rely on local files alone for important content.
- Most content is stored in the cloud through Supabase.
- The Admin page is the main place where content is managed.
- Images and documents are uploaded through storage, while text and metadata are saved in the database.
- If a connection to Supabase is lost, the website may not load content correctly.

---

## Summary

In short, this project uses React for the front-end and Supabase for the backend. Supabase handles the database, authentication, and file storage. The Admin page lets trusted users manage the church website without editing code directly. The app context file acts as the main bridge between the website and Supabase, making sure content is loaded, saved, and refreshed smoothly.

If you want to understand the project quickly, remember this simple idea:
- React shows the website
- Supabase stores and protects the content
- the Admin page lets people manage that content
