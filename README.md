src/
├── app/
│   └── (auth)/
│       ├── _layout.tsx
│       ├── login.tsx
│       └── register.tsx
│
├── features/
│   └── auth/
│       ├── AuthHeader.tsx
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
│
├── services/
│   ├── api.ts
│   └── auth.service.ts
│
├── store/
│   └── auth.store.ts
│
└── types/
    └── auth.ts
What each part does

app/(auth)
Only Expo Router screens/navigation.

features/auth
Actual UI for authentication.

services/api.ts
Axios configuration and Django API connection.

services/auth.service.ts
Calls Django endpoints:

POST /auth/login/
POST /auth/register/

and later:

POST /auth/refresh/
GET /auth/me/

store/auth.store.ts
Zustand state:

user
accessToken
refreshToken
isAuthenticated
login()
logout()

types/auth.ts
TypeScript interfaces for users, login responses, registration data, etc.

<!-- How to check if there are any typscrip errors -->
npx tsc --noEmit


## Login response data
const data = await login({
  username: username.trim(),
  password,
});

console.log('LOGIN RESPONSE:', data);
console.log('USER:', data.user);
console.log('ACCESS TOKEN:', data.access);
console.log('REFRESH TOKEN:', data.refresh);

setAuth(
  data.user,
  data.access,
  data.refresh
);

console.log('AUTH STATE UPDATED');