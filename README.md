# JingYu Sun — Academic Homepage

Public homepage: https://sjyzds.github.io/

English academic homepage with a responsive layout, biography, research interests, education, research experience, projects and academic contact information.

## Public-content boundary

The owner authorizes paper titles, short introductions based on the abstracts and the status “Under review at ICLR 2027”. Do not add manuscript PDFs, paper download links, original paper figures, full abstracts or detailed research implementation content without a new explicit instruction from the owner. The original CV's private contact details are not published.

## Edit content

Edit content/profile.json. The research array contains topic, title (the paper title), summary and status. All fields and files in this repository are public.

## Preview locally

Run npm run build, then npm run preview using Node.js 20 or later. No package installation is needed. Changes are reflected after rebuilding and refreshing the page.

## Deploy

GitHub Pages uses the workflow in .github/workflows/pages.yml. Push to main to rebuild and deploy. dist/ is generated and ignored by Git. The fonts are served locally; license files are in public/fonts/.

## Visual design

The cosmic backdrop in public/images/cosmic-nebula.png was generated with the built-in imagegen tool. The decorative research graphics in scripts/illustrations.mjs are original SVG illustrations, not paper figures. src/cosmos.css supplies the dark theme; the small starfield enhancement respects reduced-motion preferences and pauses when the page is hidden.
