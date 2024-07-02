import fs from 'fs';
import https from 'https';
import http from 'http';
import { env } from 'process';
import { Octokit } from '@octokit/action';

// Function to perform a HEAD request
const checkLink = (url) => {
  return new Promise((resolve) => {
    const request = url.startsWith('https') ? https : http;
    request
      .request(url, { method: 'HEAD' }, (response) => {
        resolve({ url, statusCode: response.statusCode, active: response.statusCode === 200 ? '✅' : '❌' });
      })
      .on('error', () => {
        resolve({ url, statusCode: 'Error', active: '❌' });
      })
      .end();
  });
};

// Function to create an issue on GitHub
const createIssue = async (octokit, link, statusCode) => {
  const issueTitle = `Invalid link detected: ${link}`;
  const issueBody = `An invalid link was detected during the link validation check.

**Link**: ${link}
**Status Code**: [${statusCode}](https://http.cat/${statusCode}) ❌

**Check time**: _${new Date().toLocaleString()}_`;

  try {
    const response = await octokit.rest.issues.create({
      owner: env.GITHUB_REPOSITORY.split('/')[0],
      repo: env.GITHUB_REPOSITORY.split('/')[1],
      title: issueTitle,
      body: issueBody,
      labels: ['invalid-link'],
    });

    console.log(`Issue created successfully: ${response.data.html_url}`);
  } catch (error) {
    console.error(`Failed to create issue: ${error.message}`);
  }
};

// Function to check if an issue already exists for the link
const issueExists = async (octokit, link) => {
  const { data: issues } = await octokit.rest.issues.listForRepo({
    owner: env.GITHUB_REPOSITORY.split('/')[0],
    repo: env.GITHUB_REPOSITORY.split('/')[1],
    labels: 'invalid-link',
    state: 'open',
  });

  return issues.some((issue) => issue.title.includes(link));
};

// Main function
const main = async () => {
  const octokit = new Octokit({
    auth: env.GITHUB_TOKEN,
  });

  // Read the aliases file
  fs.readFile('aliases', 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading aliases file:', err);
      return;
    }

    const aliases = data.split('\n').filter(Boolean);
    const reportPromises = aliases.map(async (line) => {
      const [alias, link] = line.split('" ', 2);
      const url = link.startsWith('http') ? link : `https://github.com/${link}`;
      return await checkLink(url);
    });

    const report = await Promise.all(reportPromises);
    let reportTable = "Link | Status code | Active\n";
    reportTable += ":-- | :-: | :-:\n";
    for (const { url, statusCode, active } of report) {
      reportTable += `${url} | ${statusCode} | ${active}\n`;

      if (statusCode !== 200) {
        if (!(await issueExists(octokit, url))) {
          await createIssue(octokit, url, statusCode); // Create issue for invalid links
        } else {
          console.log(`Issue for ${url} exists`);
        }
      }
    }

    const summaryText = `\
## 🚀 Done!

Below is the report for the link validation:

${reportTable}

**Check time**: _${new Date().toLocaleString()}_

<!-- Generated by GitHub Actions -->`;
    
    // Write report to GITHUB_STEP_SUMMARY
    fs.writeFile(env.GITHUB_STEP_SUMMARY, summaryText, (err) => {
      if (err) {
        console.error('Error writing to GITHUB_STEP_SUMMARY:', err);
      } else {
        console.log('Link validation report written to `GITHUB_STEP_SUMMARY`');
      }
    });
  });
};

main().catch((error) => {
  console.error('Error in main function:', error);
});
