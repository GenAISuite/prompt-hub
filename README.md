# prompt-hub
Sure! Let me explain the flow of your application when you open the site, including which pages are involved and how the data flows between them. I'll also provide a simple flow chart to illustrate this.

### Application Flow Overview

1. **User Opens Site (`/`)**
   - **File**: `pages/index.js`
   - **Action**: The Home Page is rendered.
   - **Check**: `withAuth` HOC checks if the user is authenticated.
     - **Authenticated**: The page shows prompts and other content.
     - **Not Authenticated**: Redirects to the sign-in page.

2. **Sign-In (`/signin`)**
   - **File**: `pages/signin.js`
   - **Action**: Renders the Sign-In Page.
   - **User Interaction**: User enters email and password and submits the form.
   - **API Call**: `/api/auth/signin` is called to authenticate the user.
     - **Success**: User is redirected to the Home Page (`/`).
     - **Failure**: An error message is shown.

3. **Sign-Up (`/signup`)**
   - **File**: `pages/signup.js`
   - **Action**: Renders the Sign-Up Page.
   - **User Interaction**: User enters registration details and submits the form.
   - **API Call**: `/api/auth/signup` is called to create a new user.
     - **Success**: User is redirected to the Home Page (`/`).
     - **Failure**: An error message is shown.

4. **Forgot Password (`/forgot-password`)**
   - **File**: `pages/forgot-password.js`
   - **Action**: Renders the Forgot Password Page.
   - **User Interaction**: User enters their email to receive a password reset link.
   - **API Call**: `/api/auth/forgot-password` is called to send the reset link.
     - **Success**: Success message is shown.
     - **Failure**: An error message is shown.

5. **Create Prompt (`/create`)**
   - **File**: `pages/create.js`
   - **Action**: Renders the Create Prompt Page.
   - **User Interaction**: User fills out the form to create a new prompt.
   - **API Call**: `/api/prompts` is called with POST method to create the prompt.
     - **Success**: User is redirected to the Home Page (`/`).
     - **Failure**: An error message is shown.

6. **Prompt Details (`/prompt/[id]`)**
   - **File**: `pages/prompt/[id].js`
   - **Action**: Renders the Prompt Details Page.
   - **API Call**: `/api/prompts/[id]` is called to fetch details of the specific prompt.
     - **User Interaction**: User can view and edit the prompt.
     - **Editing**: Updates are sent via PUT request to `/api/prompts/[id]`.

### Flow Chart

Here’s a simple flow chart illustrating the application flow:

```
+-------------------+
| User Opens Site   |
| (/)               |
+---------+---------+
          |
          v
+---------+---------+
| withAuth HOC      |
| (Checks Auth)     |
+---------+---------+
    |       |
    |       |
    v       v
+---+---+   +----------------+
| Home  |   | Sign-In Page   |
| Page  |   | (/signin)      |
+-------+   +--------+-------+
    |                |
    |                |
    v                v
+---+---+     +------+---------+
| API Call    |     | Sign-Up Page |
| (/api/auth/ |     | (/signup)    |
| signin)     |     +--------------+
+------+------+
        |
        v
+-------+-------+
| Redirect to   |
| Home Page     |
| (/), if sign- |
| in successful |
+---------------+
```

### Detailed Flow:

1. **Home Page (`/`)**
   - **If Authenticated**: Displays prompts. Makes an API call to `/api/prompts` to fetch prompts based on search.
   - **If Not Authenticated**: Redirects to `/signin`.

2. **Sign-In Page (`/signin`)**
   - **Sign-In Process**: Submits credentials to `/api/auth/signin`.
   - **On Success**: Redirects to `/`.

3. **Sign-Up Page (`/signup`)**
   - **Sign-Up Process**: Submits user data to `/api/auth/signup`.
   - **On Success**: Redirects to `/`.

4. **Forgot Password Page (`/forgot-password`)**
   - **Forgot Password Process**: Submits email to `/api/auth/forgot-password`.
   - **On Success**: Displays success message.

5. **Create Prompt Page (`/create`)**
   - **Create Prompt Process**: Submits prompt data to `/api/prompts`.
   - **On Success**: Redirects to `/`.

6. **Prompt Details Page (`/prompt/[id]`)**
   - **Fetch Details**: Fetches prompt details from `/api/prompts/[id]`.
   - **Editing**: Submits updates to `/api/prompts/[id]`.

This flow ensures that users navigate through the application, performing actions such as signing in, creating prompts, and handling password resets smoothly.