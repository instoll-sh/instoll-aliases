const fs = require('fs');
const https = require('https');
const http = require('http');
const { Octokit } = require('@octokit/core');
const { env } = require('process');

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
const createIssue = async (link, statusCode) => {
  const octokit = new Octokit({
    auth: env.GITHUB_TOKEN,
  });

  const issueTitle = `Invalid link detected: ${link}`;
  const issueBody = `An invalid link was detected during the link validation check.

**Link**: ${link}
**Status Code**: [${statusCode}](https://http.cat/${statusCode}) ❌

_Time of check: ${new Date().toISOString()}_`;

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

// Read the aliases file
fs.readFile('aliases', 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading aliases file:', err);
    return;
  }

  const aliases = data.split('\n').filter(Boolean);
  const reportPromises = aliases.map(async (line) => {
    const [alias, link] = line.split('" ', 2);
    // const link = linkPart.slice(0, -1); // Remove trailing quote

    const url = link.startsWith('http', 'https') ? link : `https://github.com/${link}`;
    return await checkLink(url);
  });

  const report = await Promise.all(reportPromises);
  let reportTable = "Link | Status code | Active\n";
  reportTable += ":-- | :-: | :-:\n";
  report.forEach(({ url, statusCode, active }) => {
    reportTable += `${url} | ${statusCode} | ${active}\n`;

    if (statusCode !== 200) {
      createIssue(url, statusCode); // Create issue for invalid links
    }
  });

  const summaryText = "## 🚀 Done!\n\nBelow is the report for the link validation:\n\n";
  const finalReport = summaryText + reportTable;

  // Write report to GITHUB_STEP_SUMMARY
  fs.writeFile(env.GITHUB_STEP_SUMMARY, finalReport, (err) => {
    if (err) {
      console.error('Error writing to GITHUB_STEP_SUMMARY:', err);
    } else {
      console.log('Link validation report written to GITHUB_STEP_SUMMARY.');
    }
  });
});
