## Client Info Portal Routes

The portal is structured as a single-page application under `/ClientInfoReact`, with a combination of public and protected routes.

### Public Routes
- `/ClientInfoReact` or `/ClientInfoReact/Auth` — Login & Register page
- `/ClientInfoReact/ForgotPassword` — Reset password page

### Protected Routes (require login)
#### Core
- `/ClientInfoReact/StartNewClient` — Dashboard for new & returning clients
- `/ClientInfoReact/SiteOverview` — Application overview & architecture
- `/ClientInfoReact/AccountInformation` — View/edit account info
- `/ClientInfoReact/OnboardingComplete` — Confirmation after setup
- `/ClientInfoReact/ATools` — Admin tools page

#### Documents & Services
- `/ClientInfoReact/Documents/WelcomePacket` — Download welcome packet
- `/ClientInfoReact/Documents/Signed` — View signed documents
- `/ClientInfoReact/Documents/Upload` — Upload additional paperwork
- `/ClientInfoReact/ServiceChanges` — Request service changes

#### Reports
- `/ClientInfoReact/Reports/CallLogs` — Call logs & summary
- `/ClientInfoReact/Reports/Monthly` — Monthly service usage report

#### Support
- `/ClientInfoReact/Support/Ticket` — Open support ticket
- `/ClientInfoReact/Support/ContactManager` — Contact account manager

#### Settings
- `/ClientInfoReact/Settings/Password` — Change password
- `/ClientInfoReact/Settings/Notifications` — Notification preferences
- `/ClientInfoReact/Settings/Users` — Manage authorized users

#### Onboarding Wizard
- `/ClientInfoReact/NewFormWizard/...` — Step-by-step onboarding wizard

#### 🪪 Fallback
- Any other route → 404 NotFound page
