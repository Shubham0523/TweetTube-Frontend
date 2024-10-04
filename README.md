# TweetTube 🎥🐦 (YouTube + Twitter)

**✨ Acknowledgments**
This project was cloned from my friend Chandan Polai's frontend repository. You can find his original repository [here](https://github.com/ChandanPolai/UCHIHA-FRONTEND). I want to give him credit for his contributions.

I also learned and built this project's backend by following Hitesh Choudhary's content on his YouTube channel, Chai aur Code. His tutorials were invaluable in shaping the backend of this platform.

## Overview

**TweetTube** is an innovative project combining the functionality of a video hosting platform like YouTube with micro-blogging features similar to Twitter. Built on a robust tech stack including Node.js, Express.js, React.js, and MongoDB, this platform offers a seamless user experience with modern features.

## 🌐 Important Links

| 📄 Content               | 🔗 Link                                                                 |
| -------------------------|------------------------------------------------------------------------|
| 🔴 Live Link             | [click here](https://tweet-tube-frontend.vercel.app/)                          |
| 📈 Model                 | [click here](https://app.eraser.io/workspace/cATefMPkrAdzR9c6teox?origin=share) |

## 🚀 Features

### 👤 User Management:

- 🔐 Registration, login, logout, change password
- 🖼️ Profile management (avatar, cover image, other details)
- 🕒 Watch history tracking and Clearing Watch History
- 👍 Liked videos tracking

### 📹 Video Management:

- ⬆️ Video upload
- ❌ Canceling Video upload with all resources cleaned up on backend
- 🎞️ View all videos in various resolutions, including 720p, according to your preference.
- 👁️‍🗨️ Visibility control (publish/un-publish)
- ✏️ Video editing and deletion
- 🔍 Video Search and pagination

### 📝 Tweet Management:

- 🐦 Tweet creation and publishing
- 👁️ Viewing user tweets
- ✏️ Updating and deleting tweets
- ❤️ Liking-disliking tweets

### 🔔 Subscription Management:

- ➕ Subscribing to channels
- 👥 Viewing Channel subscribers
- 📜 Viewing Subscribed channel lists

### 🎵 Playlist Management:

- ➕ Creating, updating, and deleting playlists
- ➕ Adding videos to playlists
- ➖ Removing videos from playlists and undoing them
- 📜 Viewing user playlists

### 👍 Like Management:

- ❤️ Liking and Un-liking videos, comments, and tweets
- 👁️‍🗨️ Viewing liked videos

### 💬 Comment Management:

- ➕ Adding, updating, and deleting comments on videos

### 📊 Dashboard:

- 📈 Viewing channel statistics (views, subscribers, videos, likes)
- 🎞️ Accessing uploaded videos and controls
- 📊 Viewing video statistics (PublishStatus, VideoName, DateUploaded, Views, TotalComments, LikeRatings)

### ✅ Health Check:

- 🛠️ Endpoint to verify the server's health

## 🛠️ Technologies

- ⚙️ **Node.js**: The runtime environment for executing JavaScript code server-side.
- 🌐 **Express.js**: A web application framework for Node.js.
- 🗄️ **MongoDB**: A NoSQL database used for storing application data.
- 🔗 **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js.
- 🔒 **JWT**: JSON Web Tokens for securely transmitting information between parties as a JSON object.

## 🔄 Updates I Made:
- Updated Cloudinary util file to support uploading large video files.
- Added action and state management for refreshAccessToken to handle token expiration.
- Fixed subscribers and mySubscriptions pages, which previously showed no data. I corrected the Redux state to properly fetch and display data from the backend.
- Resolved an issue with the like count on the video component, which was not displaying correctly. I fixed this in both the likeSlice and the likes component to ensure accurate counting.
- Corrected minor typos throughout the project to ensure consistency and readability.

## 📞 Connect

To connect with me, please contact me on my socials.

- [LinkedIn](https://www.linkedin.com/in/shubham-arora-01699a231/)


