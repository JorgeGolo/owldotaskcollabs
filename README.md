# Owldotask

---

Owldotask is a platform designed to give users the opportunity to earn rewards
by completing small tasks, such as quizzes and mini-games.

Every task completed grants points as a reward. These points, called
**feathers**, help users climb the leaderboard, unlock perks, and even earn
real-life rewards. Users can sign in with their Google accounts to create their
own account at [https://owldotask.com](https://owldotask.com).

---

## Technical Description

This repository is a collaborator's copy of the frontend for
[https://owldotask.com](https://owldotask.com).

It's built with **React** and **Next.js** using **Static Site Generation
(SSG)**, with **CI/CD** implemented via Git commits to GitHub.

The frontend communicates via **API routes** with a **Laravel** backend
installation, which is also deployed with its own CI/CD pipeline.

---

## Collaboration Guidelines - Git Workflow

### Discord Server

[https://discord.gg/xjbaeC7F](https://discord.gg/xjbaeC7F)

### Local Frontend Setup

1.  **Prerequisites. Make sure you have the following installed on your system:

		- Node.js and npm/yarn
		- Git

2.  **Clone the Repository.

    ```bash
    git clone https://docs.github.com/es/repositories
    cd [repository-name]
    ```

3. Frontend Configuration (React + Next.js)

    ```bash
    npm install
    # or if you use yarn
    yarn install
    ```
    
4 . Configure environment variables: If you wish to actively participate in local project testing, you can join our Discord server and request the specific .env test files for that purpose.

5 . Run development mode:

    ```bash
    npm run dev
    # or if you use yarn
    yarn dev
    ```
6 . Additional Considerations:

 - Frontend-Backend Communication: The frontend communicates with the backend via API routes.
 - PWA (Progressive Web App): The project includes PWA functionalities. The _app.js file registers the Service Worker (sw.js) for the PWA. During development, the Service Worker is unregistered to avoid conflicts.
 - package.json Scripts: Familiarize yourself with the scripts defined in package.json, such as dev, build, start, and generate-routes. The build script also runs a script to generate static routes for PWA pre-caching.
 - Project Structure: The main frontend source code is commonly organized within src/, including components/, assets/, styles/, and context/. Page files are located in pages/. The _app.js file initializes all pages and is where the Service Worker registration is included.
 - Versioning: The project version is set in package.json.
 
### Prettier

Collaborators on this repository use **Prettier** (as a Visual Studio Code
extension) to maintain clean and consistent code.

### Git and GitHub Workflow

Here's how to effectively contribute to our repository using Git and GitHub:

1.  **Ensure your local `main` branch is up-to-date with the remote
    repository.** First, switch to your `main` branch and pull the latest
    changes:

    ```bash
    git checkout main
    git pull origin main
    ```

2.  **Always work on a separate branch for your changes.** Give your branch a
    descriptive name (e.g., `your-name/feature-description` like
    `randall/add-login-button`).

    Create and switch to your new branch:

    ```bash
    git checkout -b your-descriptive-branch-name
    ```

3.  **Make your changes and commit.** Once you've made your modifications, stage
    and commit them:

    ```bash
    git add .
    git commit -m "Brief, descriptive commit message"
    ```

4.  **Push your branch to the remote repository.** Once you're ready to share
    your work or create a Pull Request, push your branch:

    - **First time pushing this branch?** Use:
      ```bash
      git push --set-upstream origin your-descriptive-branch-name
      ```
    - **For subsequent pushes on this branch,** you can simply use:
      ```bash
      git push
      ```

5.  **Create a Pull Request (PR).** Go to the GitHub web interface and navigate
    to our repository. GitHub will usually detect your recently pushed branch
    and prompt you to open a Pull Request. Follow the on-screen instructions to
    create it, add reviewers, and provide a clear description of your changes.

### What happens next?

Once your PR is created, team members will review your changes, leave comments,
and eventually approve it. After approval, your branch will be merged into the
`main` branch.
