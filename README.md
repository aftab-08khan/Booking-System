📌 Booking System (Full Stack Django + React + Stripe)

A full-stack event booking platform with authentication, event management, booking system, and Stripe payment integration.

🚀 Tech Stack
Backend
Django 4.2
Django REST Framework
Simple JWT Authentication
SQLite (development)
Stripe API
Frontend
React (Vite)
Axios
React Router
Tailwind CSS


✨ Features
User registration & login (JWT)
Protected APIs
Event listing system
Event booking system
Seat capacity control
Stripe payment integration
Webhook-based payment confirmation
User dashboard
Secure API structure


📁 Project Structure
backend/
 ├── accounts/
 ├── events/
 ├── bookings/
 ├── payments/
 ├── config/

frontend/
 ├── src/
     ├── api/
     ├── pages/
     ├── components/
     ├── routes/

     
⚙️ Setup Instructions
🧠 Backend Setup (Django)
1. Clone Project
git clone <your-repo-url>
cd backend
2. Create Virtual Environment
python -m venv venv
source venv/bin/activate   # Mac/Linux
3. Install Dependencies
pip install -r requirements.txt
4. Run Migrations
python manage.py makemigrations
python manage.py migrate
5. Create Superuser
python manage.py createsuperuser
6. Run Server
python manage.py runserver


🌐 Frontend Setup (React)
1. Install Dependencies
cd frontend
npm install
2. Run Frontend
npm run dev


🔐 Environment Variables
Backend (.env)
SECRET_KEY=your_secret_key
DEBUG=True
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret


Frontend (.env)
VITE_API_BASE_URL=http://127.0.0.1:8000/api/


📡 API Endpoints
🔐 Authentication
Method	Endpoint	Description
POST	/api/auth/register/	Register user
POST	/api/auth/login/	Login user (JWT)
POST	/api/auth/refresh/	Refresh JWT token


🎟️ Events
Method	Endpoint	Description
GET	/api/events/	List all events
GET	/api/events/<id>/	Event detail


📦 Bookings
Method	Endpoint	Description
POST	/api/bookings/create/	Create booking
GET	/api/bookings/	Get user bookings


💳 Payments (Stripe)
Method	Endpoint	Description
POST	/api/payments/create-checkout-session/	Create Stripe session
POST	/api/payments/webhook/	Stripe webhook handler


🔁 FULL USER FLOW
1. Register user
2. Login → get JWT token
3. View events
4. Create booking
5. Create Stripe checkout session
6. Pay using Stripe
7. Webhook confirms payment
8. Booking becomes confirmed
💳 Stripe Test Card

Use for testing:

Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits


🔒 Authentication

All protected endpoints require:

Authorization: Bearer <your_access_token>
⚠️ Common Issues
❌ Token expired

→ Re-login or use refresh token

❌ Invalid event ID

→ Ensure event exists in admin panel

❌ Webhook not working

→ Run Stripe CLI listener

stripe listen --forward-to localhost:8000/api/payments/webhook/
🚀 Deployment Ready Features
JWT Authentication
Environment-based config
Stripe integration
Production-safe webhook handling
CORS configured
Protected routes implemented


📌 Future Improvements
Email notifications
Booking cancellation
Admin analytics dashboard
Seat selection UI
Docker deployment
Role-based access (Admin/User)

👨‍💻 Author
Built as a full-stack assessment project using Django + React + Stripe integration.
