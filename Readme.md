# Charity Shop Inventory System Backend

## Overview

This project is a backend API for a local hospice charity's inventory management system. The system allows each of the charity's four shops to showcase their unique in-store items. It facilitates the management of item details by volunteers and staff, and provides public access to view the items available in each shop. The backend is built using Node.js and Express, with NeDB for data storage, and is documented using Swagger.

## Features

#### Item Features
- [x] Item CRUD System
   - [x] Create new items
   - [x] View all items
   - [x] Update item details
   - [x] Delete items
#### User/Volunteer Features
- [x] Account management
   - [x] Create user accounts (Managers or Admins)
   - [x] View user details
   - [x] Update user details
   - [x] Delete user accounts (Managers or Admins)
   - [x] View all users (Managers or Admins)
#### Authentication Features
- [x] User authentication using JWT
  - [x] Generate Access Tokens
  - [x] Generate Refresh Tokens
  - [x] Login
  - [x] Logout - Clear Cookies
- [x] Middleware for authentication and authorization
  - [x] Role-based access control (RBAC)
     - [x] Volunteer role
     - [x] Manager role
     - [x] Admin role
  - [x] Token Authentication

## Additional Features
- [x] Swagger Documentation
- [x] Store Management System
- [ ] Express Validation
- [ ] Logging

## Requirements

- Node.js (v20.15.1 LTS)
- pnpm (v9.6.0) or npm (v7.5.4)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Fraser-Hobbs/WebApp2-backend.git
    cd Backend
    ```

2. Install dependencies using pnpm or npm:
    ```bash
    pnpm install
    ```

3. Start the server:
    ```bash
    pnpm start
    ```

4. The server should now be running on `http://localhost:3000`

## API Documentation

Swagger documentation is available at `http://localhost:3000/api-docs`.

## Directory Structure

```
BackEnd/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── itemController.js
│   │   │   ├── userController.js
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── routes/
│   │   │   ├── itemRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── authRoutes.js
├── config.js
├── index.js
├── .env
├── package.json
└── README.md

```


## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## Example Environment Variables

```dotenv
NODE_ENV= dev/prod
URL= 'http://localhost:3000' // or your domain
PORT=3000
ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
DATASTORE_DIR='path/to/folder/'
ACCESS_TOKEN_SECRET= // (Random Sha-256 Hash)
REFRESH_TOKEN_SECRET= // (Random Sha-256 Hash)
```


## License

This project is licensed under the MIT License.

---

For any questions or further information, please contact me.
