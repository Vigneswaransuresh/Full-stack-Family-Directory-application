# Family Directory Application

A full-stack application for managing customer information and their family details.

## Features

- Add, edit, and delete customer records
- Store family member details
- Search functionality
- Responsive design
- PWA support

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Vite
  - PWA

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### Frontend (.env.production)
```env
VITE_API_URL=your_backend_api_url
```

## Deployment

### Backend (Render)
1. Create a new Web Service
2. Connect your GitHub repository
3. Configure:
   - Name: `kalaivani-jothidam-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables:
     - `MONGODB_URI`
     - `PORT`

### Frontend (Netlify)
1. From Netlify dashboard, click "Add new site"
2. Choose "Import an existing project"
3. Select the GitHub repository
4. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Add Environment Variables:
     - `VITE_API_URL`

## Local Development

1. Clone the repository
```bash
git clone https://github.com/Vigneswaransuresh/Full-stack-Family-Directory-application.git
cd Full-stack-Family-Directory-application
```

2. Install dependencies
```bash
npm install
```

3. Start development servers
```bash
# Run both frontend and backend
npm run start

# Or run them separately
npm run server  # Backend
npm run dev     # Frontend
```

## API Endpoints

- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update a customer
- `DELETE /api/customers/:id` - Delete a customer 