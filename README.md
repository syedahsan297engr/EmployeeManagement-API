## Description

This project is a Nest.js backend application GraphQL based built with PostgreSQL and Typeorm for database management. Some Features in it are as:

- Role Based Access Control
- Authentication, Authorization
- Employee Listing, Pagination, Filtering
- Login, SignUp
- Create, Update Employee Mutation
- Listing employees is public.
- Get employee by id is only accessible to logged in users.
- Creation and Update of employee only admin can do this.
- API's are JWT secured, except the public APIs

---

## Project Setup

### Prerequisites

1. **Environment Variables**:

   - Create an `.env` file in your system. Include all necessary configurations such as `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and JWT secret keys. `Sample.env` is in project.

2. **Database Setup**:
   - Make sure PostgreSQL is installed and create a database for the project.

---

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <repo-name>
   ```
2. install packages:
   ```bash
   npm install
   ```
3. run migrations for db
   ```bash
   npm run migration:run
   ```
4. seed the data for some testing
   ```bash
   npm run data:sync
   ```
5. run the server
   ```bash
   npm run dev
   ```

### Testing

The link to postman collection is as:
[Postman Collection](https://api-testing-1941.postman.co/workspace/API-Testing-Workspace~8058514d-b069-437f-aeac-4334d223fafc/collection/6751efa86c32e95f6b40e027?action=share&creator=30954765)
