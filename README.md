# Resilience for Africa's Future

A modern, responsive website for an NGO focused on sustainable development and community resilience across Africa.

## Project Overview

This project is a complete multi-page static website featuring:

- **Modern Design**: Earth-toned color palette with elegant typography (Playfair Display + Inter)
- **Responsive Layout**: Mobile-first approach with smooth animations
- **Accessibility**: WCAG compliant with semantic HTML and ARIA attributes
- **Performance**: Optimized images, lazy loading, and service worker caching
- **Production Ready**: Configured for Firebase Hosting deployment

### Pages Included

- **Home**: Hero section, impact numbers, services overview, featured projects
- **Services**: Detailed breakdown of all 6 service areas with rich content
- **Projects**: Filterable project gallery with progress indicators
- **About**: Organization story, timeline, team members, partners
- **Blog & Events**: Tabbed interface for news and upcoming events
- **Contact**: Contact form with validation and office information

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Firebase CLI](https://firebase.google.com/docs/cli)

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd resilience-for-africa
```

2. Install Firebase tools:
```bash
npm install -g firebase-tools
```

3. Start local development server:
```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx serve public

# Or using Firebase
firebase serve
```

4. Open your browser to `http://localhost:8000` (or the port shown)

### Project Structure

```
resilience-for-africa/
├── public/                   # Website root
│   ├── assets/
│   │   ├── icons/           # Service icons (SVG)
│   │   └── images/          # Logo, photos, placeholders
│   ├── css/
│   │   └── main.css         # All styles (consolidated)
│   ├── scripts/
│   │   └── main.js          # All JavaScript functionality
│   ├── index.html           # Homepage
│   ├── services.html        # Services page
│   ├── projects.html        # Projects page
│   ├── about.html           # About page
│   ├── blog.html            # Blog & Events page
│   ├── contact.html         # Contact page
│   ├── 404.html             # Error page
│   └── sw.js                # Service worker
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
├── storage.rules            # Storage security rules
└── README.md               # This file
```

## Deployment to Firebase Hosting

### Initial Setup

1. Login to Firebase:
```bash
firebase login
```

2. Initialize Firebase (if not already done):
```bash
firebase init
```
   - Select "Hosting", "Firestore", and "Storage"
   - Choose existing project or create new one
   - Set "public" as public directory
   - Configure as multi-page app (not SPA)

3. Deploy:
```bash
firebase deploy
```

### Continuous Deployment

For production use, consider setting up GitHub Actions or Firebase CI/CD.

## Features

### Design & Functionality

- **Responsive Design**: Works on all device sizes
- **Smooth Animations**: Scroll-triggered animations with reduced motion support
- **Interactive Elements**: Hover effects, modal dialogs, form validation
- **Progressive Enhancement**: Works without JavaScript
- **Offline Support**: Service worker caches key resources

### Accessibility

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader friendly
- **Keyboard Navigation**: All interactive elements accessible
- **Focus Management**: Visible focus indicators
- **Color Contrast**: Meets WCAG AA standards

### Performance

- **Optimized Images**: Lazy loading with proper alt texts
- **Minimal JavaScript**: Vanilla JS, no heavy frameworks
- **Efficient CSS**: Custom properties and modern selectors
- **Caching Strategy**: Service worker with intelligent caching

## Customization

### Content

Replace placeholder content in HTML files:
- Update text content and Lorem ipsum
- Replace placeholder images in `/assets/images/`
- Update contact information and social links

### Styling

Main CSS variables in `/css/main.css`:
- `--color-primary`: Main brand color (default: forest green)
- `--color-secondary`: Secondary brand color
- `--font-heading`: Heading font (default: Playfair Display)
- `--font-body`: Body font (default: Inter)

### Functionality

Form handling in `/scripts/main.js`:
- Update form submission handlers
- Configure analytics integration
- Add payment processing integration

## Integration Notes

### Form Handling

The contact form includes client-side validation but needs server-side processing:

1. **Firebase Functions**: Recommended for Firebase hosting
2. **Formspree**: Simple third-party service
3. **Netlify Forms**: If hosting on Netlify
4. **Custom Backend**: Your own server endpoint

### Analytics

Add Google Analytics or similar:
```html
<!-- Add to <head> of each page -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
```

### Payment Processing

For donations, integrate with:
- Stripe for credit card processing
- PayPal for alternative payments
- Local payment processors for African markets

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions  
- Safari: Latest 2 versions
- Mobile: iOS Safari, Chrome Mobile

IE11 and older browsers are not supported.

## License

MIT License - see LICENSE file for details.

## Support

For technical issues or customization requests, please contact the development team or create an issue in the repository.
