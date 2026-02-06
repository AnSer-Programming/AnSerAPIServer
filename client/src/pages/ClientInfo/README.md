## Client Info Portal Routes

The portal is structured as a single-page application under `/ClientInfoReact`, with a combination of public and protected routes.

### Public Routes
- `/ClientInfoReact` or `/ClientInfoReact/Auth` â€” Login & Register page
- `/ClientInfoReact/ForgotPassword` â€” Reset password page

### Protected Routes (require login)
#### Core
- `/ClientInfoReact/StartNewClient` â€” Dashboard for new & returning clients
- `/ClientInfoReact/SiteOverview` â€” Application overview & architecture
- `/ClientInfoReact/AccountInformation` â€” View/edit account info
- `/ClientInfoReact/OnboardingComplete` â€” Confirmation after setup
- `/ClientInfoReact/ATools` â€” Admin tools page

#### Documents & Services
- `/ClientInfoReact/Documents/WelcomePacket` â€” Download welcome packet
- `/ClientInfoReact/Documents/Signed` â€” View signed documents
- `/ClientInfoReact/Documents/Upload` â€” Upload additional paperwork
- `/ClientInfoReact/ServiceChanges` â€” Request service changes

#### Reports
- `/ClientInfoReact/Reports/CallLogs` â€” Call logs & summary
- `/ClientInfoReact/Reports/Monthly` â€” Monthly service usage report

#### Support
- `/ClientInfoReact/Support/Ticket` â€” Open support ticket
- `/ClientInfoReact/Support/ContactManager` â€” Contact account manager

#### Settings
- `/ClientInfoReact/Settings/Password` â€” Change password
- `/ClientInfoReact/Settings/Notifications` â€” Notification preferences
- `/ClientInfoReact/Settings/Users` â€” Manage authorized users

#### Onboarding Wizard
- `/ClientInfoReact/NewFormWizard/...` â€” Step-by-step onboarding wizard

#### Fallback
- Any unmatched wizard route redirects to the start screen.

