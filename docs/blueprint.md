# **App Name**: ScienceConnect

## Core Features:

- Admin Authentication & Access Control: Secure administrative login via Firebase Auth for Super Admins and Content Managers, ensuring restricted access to sensitive /admin routes based on assigned roles.
- Dynamic Content Management: A comprehensive content management system (CMS) for admins to create, edit, and delete Articles, Events, and Publications, featuring a rich text editor, featured images, and metadata for SEO.
- Media & File Library: Admins can upload and manage images and PDF documents to Firebase Storage, as well as embed YouTube video links, with seamless integration into various content types.
- Public Website Presentation: A fully responsive public-facing website that elegantly displays all dynamic content (articles, events, publications, media) and static pages ('Qui sommes-nous', 'Objectifs') with a focus on SEO and accessibility.
- Interactive Contact Form with AI Assistant: A secure contact form for user inquiries. An AI tool suggests relevant FAQ answers from the site's content as users type their messages, with messages stored in Firestore and email dispatch via a Firebase function.
- Homepage Configuration & Section Manager: Admins can dynamically customize and manage key sections of the homepage, including the hero banner, mission statements, and featured announcements, with control over section visibility.
- Firestore Database Management: Backend management and retrieval of all application data, including users, articles, events, publications, media, homepage sections, and contact messages, stored in structured Firestore collections with createdAt, updatedAt, and createdBy timestamps.

## Style Guidelines:

- Primary color: Deep, authoritative Dark Blue (#0B3C5D), symbolizing academic rigor, trust, and institutional professionalism. This color serves as a strong foundation for the visual identity.
- Accent color: Rich Gold (#D4AF37), utilized sparingly to highlight critical actions, calls to action, and key informational elements, creating an elegant contrast that signifies quality and excellence.
- Background color: Pristine White (#FFFFFF), chosen for its clean, minimal, and highly accessible nature, providing an uncluttered canvas that enhances content readability and reinforces a modern aesthetic.
- Headline and Body Font: 'Inter' (sans-serif), selected for its versatility, exceptional readability across all screen sizes, and modern, objective appearance, ideal for an academic and institutional context.
- Utilize minimalist, line-art style icons that integrate seamlessly with the clean and modern design. Icons should be clear, intuitive, and contribute to the site's overall professional academic aesthetic without being visually heavy.
- The site will feature a modern, responsive grid system, facilitating an organized presentation of content, complemented by a card-based layout for dynamic elements like articles and events to ensure clear visual separation and hierarchy.
- A prominent sticky header incorporating a clean Navbar with intuitive dropdown menus for efficient navigation across all sections of the site. The layout is completed with an elegant and functional footer containing essential information.
- Subtle animated transitions will be employed for page loading and content changes, ensuring a smooth and fluid user experience. This includes smooth scrolling effects and clear, non-intrusive toast notifications for user feedback.