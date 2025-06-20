# Chat Application Frontend

A modern real-time chat application built with React.js, featuring public rooms and private messaging capabilities.

## 🚀 Features

- **Real-time messaging** with Socket.io
- **Public chat rooms** - Create and join public rooms
- **Private messaging** - Direct messages between users
- **User authentication** - Secure login/register system
- **Responsive design** - Works on desktop and mobile
- **Markdown support** - Rich text formatting in messages
- **Typing indicators** - See when others are typing
- **Online status** - Real-time user presence
- **Message timestamps** - Smart time formatting

## 🛠️ Tech Stack

- **Frontend**: React.js 18
- **State Management**: Context API
- **Routing**: React Router v6
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios
- **Styling**: Custom CSS with modern design
- **Markdown**: React Markdown

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chat-client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## 🔧 Configuration

The app connects to the backend deployed at:
- **API Base URL**: `https://chatsocket-2-ufd3.onrender.com/api`
- **Socket URL**: `https://chatsocket-2-ufd3.onrender.com`

## 📱 Usage

### Getting Started
1. **Register** a new account or **login** with existing credentials
2. Access the **Dashboard** to see available rooms and conversations
3. **Create new rooms** or **join existing ones**
4. **Start private conversations** with other users

### Public Rooms
- View all available public rooms on the dashboard
- Create new rooms with custom names
- Join any room to start chatting
- See online user count in each room

### Private Messaging
- Start private conversations from the dashboard
- Direct one-on-one messaging
- Private conversation history

### Chat Features
- **Send messages** with Markdown formatting support
- **Real-time updates** - messages appear instantly
- **Typing indicators** - see when others are typing
- **Message timestamps** - relative time display
- **Responsive design** - optimized for all devices

## 🏗️ Project Structure

```
src/
├── api/                 # API service layers
│   ├── auth.js         # Authentication APIs
│   ├── config.js       # Axios configuration
│   ├── messages.js     # Message APIs
│   ├── private.js      # Private messaging APIs
│   └── rooms.js        # Room APIs
├── components/         # Reusable UI components
│   ├── Avatar.js       # User avatar component
│   ├── MessageBubble.js # Chat message display
│   ├── MessageInput.js  # Message input form
│   ├── ProtectedRoute.js # Route protection
│   └── TypingIndicator.js # Typing status display
├── contexts/           # React Context providers
│   ├── AuthContext.js  # Authentication state
│   ├── ChatContext.js  # Chat state management
│   └── SocketContext.js # Socket.io connection
├── pages/              # Main application pages
│   ├── ChatPage.js     # Chat interface
│   ├── DashboardPage.js # Main dashboard
│   ├── LoginPage.js    # User login
│   └── RegisterPage.js # User registration
├── utils/              # Utility functions
│   └── dateUtils.js    # Date formatting helpers
├── App.js              # Main app component
└── index.js            # App entry point
```

## 🔐 Authentication

The app uses JWT-based authentication:
- Tokens are stored in localStorage
- Automatic token attachment to API requests
- Protected routes redirect to login when unauthenticated
- Automatic logout on token expiration

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login

### Rooms
- `GET /api/rooms` - List all rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/:id` - Get room details

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/room/:roomId` - Get room messages
- `GET /api/messages/conversation/:conversationId` - Get private messages

### Private Messaging
- `POST /api/private/start` - Start private conversation
- `GET /api/private` - Get user's conversations
- `POST /api/private/:conversationId/messages` - Send private message

## 🔌 Socket Events

### Client Emits
- `join_server` - Connect user to server
- `join_room` - Join a specific room
- `leave_room` - Leave a room
- `send_message` - Send message to room
- `typing` - Indicate user is typing

### Client Listens
- `receive_message` - New message received
- `user_status_update` - User online/offline status
- `user_typing` - Someone is typing

## 🎨 Styling

The application uses custom CSS with:
- **Modern design system** with consistent colors and spacing
- **Responsive breakpoints** for mobile optimization
- **Smooth animations** and transitions
- **Apple-inspired aesthetics** with attention to detail
- **Dark/light theme support** (coming soon)

## 📱 Mobile Support

Fully responsive design with:
- Touch-friendly interface
- Optimized layouts for small screens
- Proper viewport handling
- iOS/Android compatibility

## 🚀 Deployment

The app is ready for deployment on platforms like:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**

Build for production:
```bash
npm run build
```

## 🔧 Development

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Environment Variables
Create a `.env` file for local development:
```
REACT_APP_API_BASE_URL=https://chatsocket-2-ufd3.onrender.com/api
REACT_APP_SOCKET_URL=https://chatsocket-2-ufd3.onrender.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

## 🔮 Roadmap

- [ ] Message search functionality
- [ ] File/image sharing
- [ ] Voice messages
- [ ] Video calling
- [ ] Dark mode theme
- [ ] Push notifications
- [ ] Message reactions
- [ ] User profiles
- [ ] Room moderation tools