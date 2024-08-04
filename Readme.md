# Charity Shop Inventory System Backend

## Overview

This project is a backend API for a local hospice charity's inventory management system. The system allows each of the charity's four shops to showcase their unique in-store items. It facilitates the management of item details by volunteers and staff, and provides public access to view the items available in each shop. The backend is built using Node.js and Express, with NeDB for data storage, and is documented using Swagger.

## Features

#### Item Features
- [ ] Item CRUD System
   - [ ] Create new items
   - [ ] View all items
   - [ ] Update item details
   - [ ] Delete items
#### User/Volunteer Features
- [ ] Account management
   - [ ] Create user accounts (Managers or Admins)
   - [ ] View user details
   - [ ] Update user details
   - [ ] Delete user accounts (Managers or Admins)
   - [ ] View all users (Managers or Admins)
#### Authentication Features
- [ ] User authentication using JWT
  - [ ] Generate Access Tokens
  - [ ] Generate Refresh Tokens
  - [ ] Login
  - [ ] Logout - Clear Cookies
- [ ] Middleware for authentication and authorization
  - [ ] Role-based access control (RBAC)
     - [ ] Volunteer role
     - [ ] Manager role
     - [ ] Admin role
  - [ ] Token Authentication

## Requirements

- Node.js (v20.15.1 LTS)
- pnpm (v9.6.0) or npm (v7.5.4)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Fraser-Hobbs/WebApp2-backend.git
    cd Backend
    ```

2. Install dependencies using pnpm:
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

## License

This project is licensed under the MIT License.

---

For any questions or further information, please contact me.
