# Web Development Project 7 - _Crewmates_

Submitted by: **Olatomiwa Aluko**

This web app is a **crew management tool** that allows users to create, update, and manage a list of crewmates with customizable attributes. It provides a user-friendly interface for adding new crewmates, editing their details, and viewing a summary or detailed information about each crewmate. The app is built with modern web technologies, ensuring a seamless and responsive experience across devices.

Time spent: **40+** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **The web app contains a page that features a create form to add a new crewmate**
  - Users can name the crewmate
  - Users can set the crewmate's attributes by clicking on one of several values
- [x] **The web app includes a summary page of all the user's added crewmates**
  - The web app contains a summary page dedicated to displaying all the crewmates the user has made so far
  - The summary page is sorted by creation date such that the most recently created crewmates appear at the top
- [x] **A previously created crewmate can be updated from the list of crewmates in the summary page**
  - Each crewmate has an edit button that will take users to an update form for the relevant crewmate
  - Users can see the current attributes of their crewmate on the update form
  - After editing the crewmate's attribute values using the form, the user can immediately see those changes reflected in the update form and on the summary page
- [x] **A previously created crewmate can be deleted from the crewmate list**
  - Using the edit form detailed in the previous _crewmates can be updated_ feature, there is a button that allows users to delete that crewmate
  - After deleting a crewmate, the crewmate should no longer be visible in the summary page
- [x] **Each crewmate has a direct, unique URL link to an info page about them**
  - Clicking on a crewmate in the summary page navigates to a detail page for that crewmate
  - The detail page contains extra information about the crewmate not included in the summary page
  - Users can navigate to to the edit form from the detail page

The following **optional** features are implemented:

- [ ] A crewmate can be given a category upon creation which restricts their attribute value options
  - e.g., a Dungeons and Dragons class or a development team role (project manager, product owner, etc.)
  - User can choose a `category` option to describe their crewmate before any attributes are specified
  - Based on the category value, users are allowed to access only a subset of the possible attributes
- [ ] A section of the summary page, displays summary statistics about a user’s crew on their crew page
  - e.g., the percent of members with a certain attribute
- [ ] The summary page displays a custom “success” metric about a user’s crew which changes the look of the crewmate list
  - e.g., a pirate crew’s predicted success at commandeering a new galley

The following **additional** features are implemented:

- [ ] List anything else that you added to improve the site's functionality!

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='https://imgur.com/a/AStfKCG' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->

GIF created with [ScreenToGif](https://www.screentogif.com/) for Windows

<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

### Development Journey

This project evolved through multiple phases, each adding significant functionality:

**Phase 1-3**: Core CRUD operations with React, TypeScript, and Supabase integration
**Phase 4**: Production features including bulk operations, favorites, PWA support, and deployment optimization
**Phase 5**: Enterprise features with advanced analytics, community hub, gamification, and comprehensive settings

### Technical Challenges Overcome

1. **State Management**: Implemented efficient state management for complex features like bulk selection and real-time updates
2. **Data Visualization**: Integrated Chart.js with React for interactive analytics dashboards
3. **Performance Optimization**: Achieved optimal bundle size while maintaining rich feature set
4. **TypeScript Integration**: Maintained type safety across the entire application
5. **Responsive Design**: Created consistent user experience across all device sizes
6. **Database Design**: Structured Supabase schema for scalability and performance

### Architecture Decisions

- **Component Structure**: Modular, reusable components with clear separation of concerns
- **Routing Strategy**: Client-side routing with React Router for SPA experience
- **Styling Approach**: Utility-first CSS with Tailwind for rapid development
- **Data Layer**: Supabase for real-time database operations and authentication
- **Build Pipeline**: Vite for fast development and optimized production builds

## Installation & Setup

```bash
# Clone the repository
git clone https://github.com/tomiwaaluko/crewmates.git

# Navigate to project directory
cd crewmates

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and API key

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## License

    Copyright [2025] [Olatomiwa Aluko]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
