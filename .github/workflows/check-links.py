import os
import requests

# Read the aliases file
with open('aliases', 'r') as file:
    aliases = file.readlines()

report = []
for line in aliases:
    alias, link = line.strip().split('" ', maxsplit=1)

    if link.startswith(('http://', 'https://')):
        url = link
    else:
        url = f'https://github.com/{link}'

    try:
        response = requests.head(url, allow_redirects=True)
        status_code = response.status_code
        active = '✅' if status_code == 200 else '❌'
    except requests.RequestException:
        status_code = 'Error'
        active = '❌'

    report.append(f"{url} | {status_code} | {active}")

report_table = "Link | Status code | Active\n"
report_table += ":-- | :-: | :-:\n"
report_table += "\n".join(report)

# Write report to gh_step_summary
with open(os.getenv('GITHUB_STEP_SUMMARY'), 'w') as summary_file:
    summary_file.write(report_table)
