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
