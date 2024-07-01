# Contributing to instoll-aliases

We are excited that you are interested in contributing to the `instoll-aliases` repository! By contributing, you help improve the tool for everyone. Here are the steps to get started:

## How to Contribute

### 1. Fork the Repository

1. Navigate to the [instoll-aliases repository](https://github.com/instoll-sh/instoll-aliases).
2. Click the "**Fork**" button at the top right of the page.
3. This creates a copy of the repository in your GitHub account.

### 2. Clone Your Fork

1. Open your terminal.
2. Clone your forked repository:
   ```bash
   git clone https://github.com/your-username/instoll-aliases.git
   ```

4. Navigate to the repository directory:
   ```bash
   cd instoll-aliases
   ```

### 3. Create a New Branch

1. Create a new branch for your changes:
   ```bash
   git checkout -b your-branch-name
   ```

### 4. Add Your Package Alias

1. Open the `aliases` file in your preferred text editor.
2. Add your package alias in the appropriate format:
   ```
   "alias" <package_url_or_github_repo>
   ```
3. Save the file.

### 5. Commit Your Changes

1. Add your changes to the staging area:
   ```bash
   git add aliases
   ```
2. Commit your changes with a descriptive message:
   ```bash
   git commit -m "Add alias for [package-name]"
   ```

### 6. Push Your Changes

1. Push your changes to your forked repository:
   ```bash
   git push origin your-branch-name
   ```

### 7. Create a Pull Request

1. Navigate to the original [instoll-aliases repository](https://github.com/instoll-sh/instoll-aliases).
2. Click on the "**Compare & pull request**" button next to your recently pushed branch.
3. Provide a descriptive title and description for your pull request.
4. Click "**Create pull request**".

## Review Process

1. Your pull request will be reviewed by one of the repository maintainers.
2. You may be asked to make some changes or provide more information.
3. Once your pull request is approved, it will be merged into the main branch.

## Tips for a Successful Contribution

- **Be clear and concise**: Make sure your pull request title and description clearly describe the changes you have made.
- **Follow the format**: Ensure your alias entry follows the correct format:
  ```
  "alias" <package_url_or_github_repo>
  ```
- **Test your changes**: Verify that your alias works correctly with the `instoll` tool.

## Code of Conduct

Please note that this project is governed by a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Thank You!

Thank you for contributing to the `instoll-aliases` repository! Your efforts help make this project better for everyone.

Happy coding! 🚀
