export type SamplePack = {
    id: string;
    label: string;
    resume: string;
    job: string;
};

export const RESUME_SAMPLES: SamplePack[] = [
    {
        id: "intern",
        label: "NDTIT intern → junior engineer",
        resume: `KAVEESHA BANDARA
Negombo, Sri Lanka | student@email.com | +94 77 000 0000

EDUCATION
Information Technology
Institute of Technology, University of Moratuwa | 2023 – Present

PROJECTS
Smart Bus Booking System
Full-stack web app with real-time seat availability and role-based access.
Stack: JavaScript, HTML, CSS, SQL

AREA51 Clothing Website
E-commerce site with an admin panel for product and order management.

SKILLS
Python, Java, JavaScript, HTML, CSS, SQL, Git, basic networking

EXPERIENCE
Software project work during NDTIT | 2025
Built academic and client web projects. Responsible for testing pages.`,
        job: `Junior Software Engineer (Intern / Entry)
Must have: JavaScript or TypeScript, HTML/CSS, Git, SQL basics, one web project.
Nice: React, API testing, clear written English.
You will ship small UI tasks and write test notes.`,
    },
    {
        id: "qa",
        label: "QA → SDET",
        resume: `ALEX PERERA
Colombo | alex@email.com

SUMMARY
QA engineer with 2 years of manual testing on web products.

EXPERIENCE
QA Engineer, 2024 – 2026
Wrote test cases. Logged bugs. Did regression before each release.
I was responsible for the checkout flow.

SKILLS
Manual testing, test cases, Jira, SQL SELECT, Postman basics, Java`,
        job: `SDET / QA Automation
Required: Java or JavaScript, API testing, SQL.
Preferred: Playwright or Selenium.`,
    },
    {
        id: "switch",
        label: "Career switch → analyst",
        resume: `SAM JAYASINGHE
Kandy | sam@email.com

EXPERIENCE
Marketing Coordinator, 2023 – 2026
Ran weekly reports. Built campaign sheets. Worked with the product team.

SKILLS
Excel, Google Sheets, Canva, basic SQL, written English`,
        job: `Product Analyst (junior)
Required: spreadsheets, clear writing.
Nice: SQL, basic dashboarding.`,
    },
];