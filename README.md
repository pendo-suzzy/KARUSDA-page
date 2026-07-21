# KARUSDA Church Web Application

Welcome to the source code for the Karatina University Seventh-day Adventist (KARUSDA) Church website! 

This guide is written to help anyone—even if you don't have a technical background—understand how the website is built, how the different pieces connect, and where to look if you want to understand how things work behind the scenes.

## The Big Picture: How the Site Works

This website is built using **React**, a modern web technology that works by snapping together reusable "building blocks" (called components) to create the full website. It also connects to a database called **Supabase** so that all the announcements, events, and leadership profiles you add are saved permanently on the internet.

Imagine the website as a restaurant:
- **The Pages (`src/pages`)** are the different dining rooms the guests walk into.
- **The Components (`src/components`)** are the furniture, tables, and decorations that make up those rooms.
- **The AppContext (`src/context`)** is the kitchen and waitstaff. They constantly grab data from the storage (database) and bring it to the tables (pages).
- **The Database (Supabase)** is the pantry where all the ingredients (text, links, images) are safely stored.

---

## Directory & File Explanations

Here is a breakdown of what you will find inside the main `src` (source) folder. Every `.jsx` file is the logic/structure of the site, and every `.css` file contains the visual styling (colors, layout, animations).

### 1. The Starting Point
- **`main.jsx`**: This is the very first file that runs when the website opens. It grabs the entire application and "mounts" it onto the web browser. Think of this as flipping the "Open" sign on the front door.
- **`App.jsx`**: This file is the "Map" or "Traffic Controller" (Router) of the website. It looks at the web address you clicked (like `/ministries` or `/events`) and decides which Page to show you.

### 2. The Brain of the App (Data & Storage)
- **`context/AppContext.jsx`**: This is the most important file for managing data. It talks directly to the Supabase database. When the website loads, this file downloads all the announcements, sermons, and events from the database and shares them with the rest of the website. When you add a new announcement in the Admin panel, it passes through this file to be permanently saved.
- **`lib/supabaseClient.js`**: A tiny file that holds the "keys" and "passwords" connecting the website to the Supabase database.
- **`lib/urlHelpers.js`**: A clever tool that looks at YouTube links or Google Photos links you paste and instantly cleans them up so they display perfectly on the website.

### 3. The Pages (`src/pages`)
These are the full screens that users see when they navigate the website.

- **`Home.jsx` & `Home.css`**: The homepage dashboard. It pulls in recent announcements, leadership profiles, and sermons to give visitors a quick overview.
- **`Events.jsx` & `Events.css`**: Displays the weekly services, midweek fellowships, and volunteer opportunities. It also handles the photo gallery.
- **`Ministries.jsx` & `Ministries.css`**: Showcases the different ministry families and choirs. It features clickable video cards that automatically grab thumbnails from YouTube videos.
- **`Missions.jsx` & `Missions.css`**: A page dedicated to past and upcoming missionary outreach activities, tracking the goals and funds raised.
- **`Admin.jsx` & `Admin.css`**: The hidden control panel! This page allows church leaders to add, edit, or delete content across the entire site without writing any code. It contains tabs for every section (Announcements, Leadership, Sermons, etc.) and uses `AppContext` to save everything permanently.

### 4. The Building Blocks (`src/components`)
These are smaller, reusable pieces of the website that are placed inside the Pages. By keeping them separate, we don't have to rewrite the same code twice.

- **`Navbar.jsx` & `Navbar.css`**: The navigation menu at the very top of the screen. It has intelligent dropdown menus that smoothly guide visitors to different sections.
- **`Footer.jsx` & `Footer.css`**: The very bottom section of the website containing the church's contact information, social links, and quick links.
- **`HeroSlider.jsx` & `HeroSlider.css`**: The big, beautiful image slideshow at the very top of the Home page that cycles through pictures automatically.
- **`AnnouncementCard.jsx` & `AnnouncementCard.css`**: A reusable card design used to display individual announcements beautifully, complete with a functional "Like" button.
- **`Layout.jsx`**: A wrapper file that makes sure the `Navbar` is always at the top and the `Footer` is always at the bottom of every single page, no matter where you navigate.

## Summary: How They All Connect

1. A user visits the website. **`main.jsx`** starts the app.
2. **`AppContext.jsx`** immediately connects to the database and downloads all the church data.
3. **`App.jsx`** sees that the user is on the homepage and loads **`Home.jsx`** (wrapped neatly inside the **`Layout.jsx`** so it has a header and footer).
4. **`Home.jsx`** grabs the data from **`AppContext.jsx`** and gives it to smaller components (like **`HeroSlider.jsx`** and **`AnnouncementCard.jsx`**) to display beautifully on the screen.
5. If an admin logs into **`Admin.jsx`** and changes a leader's name or adds a sermon, it sends a message to **`AppContext.jsx`**, which updates the database. Instantly, the rest of the website reflects the new information without needing to be refreshed!
