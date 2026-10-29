# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Modern Boutique Catalog Website

### 1. Project Overview

Develop a modern, elegant, and premium-looking website for a women's fashion boutique selling dresses, bags, and other women's fashion products.

The website will serve as a digital product catalog. Customers will be able to browse products, view product details, and discover the boutique's collection.

The website must include a simple admin panel where the boutique owner can manage products without writing any code.

**This is NOT an e-commerce website.**

There will be no shopping cart, checkout, payment integration, order management, or customer accounts.

### 2. Technology Stack

Use the following technologies:

- **Framework:** Next.js with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend and Database:** Supabase
- **Authentication:** Supabase Auth
- **Image Storage:** Supabase Storage
- **Icons:** Lucide React
- **Deployment:** Vercel or another compatible hosting provider

Use stable, mutually compatible package versions.

Keep the architecture simple. Avoid unnecessary libraries, abstractions, microservices, or additional backend infrastructure.

### 3. Design Direction

The website must feel like a premium independent fashion boutique rather than a generic e-commerce template.

#### Visual Identity

The design should be:

- Elegant
- Modern
- Minimalist
- Sophisticated
- Feminine without being overly decorative
- Image-focused
- Clean and spacious

Use a neutral color palette consisting primarily of:

- Warm ivory or off-white
- Black or dark charcoal
- Soft beige and muted neutral tones

Use typography that combines an elegant editorial-style heading font with a clean, highly readable sans-serif font for body text.

Use generous whitespace, refined spacing, subtle borders, and restrained animations.

Product photography must be the primary visual focus.

Avoid excessive gradients, bright colors, oversized rounded cards, unnecessary shadows, decorative icons, and generic SaaS-style components.

Do not make the interface look like a dashboard template or a marketplace.

#### Responsive Design

The website must be fully responsive and optimized for mobile devices.

The mobile experience is especially important because customers are likely to visit the website through Instagram.

Ensure that:
- Product images remain visually prominent.
- Product cards display correctly on small screens.
- Navigation is simple and intuitive.
- Product detail pages are comfortable to use on mobile.
- The admin panel can be used on both desktop and mobile.

### 4. Public Website

#### 4.1 Homepage

Create a simple, visually appealing homepage containing:

**Header**
- Boutique name or wordmark.
- Navigation links.
- A link to the product catalog.
- A link to the boutique's Instagram profile.

Keep the header minimal and elegant.

**Hero Section**
- A large, editorial-style fashion image.
- A short, elegant headline.
- A subtle call to action leading to the product catalog.

The hero section must not overwhelm the page or distract from the products.

Use a configurable image and text rather than hardcoding content throughout the application.

**Featured Products**
- Display a selection of products marked as featured.
- Show the main product image, product name, and price.
- Make each product card clickable.
- Include a link to view the complete catalog.

If there are no featured products, display the latest active products instead.

**Footer**
- Boutique name.
- Instagram link.
- A simple copyright notice.

Do not add unnecessary sections such as blogs, testimonials, brand stories, newsletters, or promotional banners.

#### 4.2 Product Catalog

Create a dedicated page displaying all active products.

Each product card must contain:
- Main product image.
- Product name.
- Price in Turkish lira (TRY).

Requirements:
- Use a clean, responsive grid layout.
- Display products in a consistent visual format.
- Use optimized images with appropriate aspect ratios.
- Include subtle hover effects on desktop.
- Allow customers to click a product to open its detail page.
- Display products in a predictable order, with recently added products appearing first.
- Provide a clear empty state if no products are available.

Add a simple category filter only if categories can be managed without significantly increasing complexity.

Avoid unnecessary filters, sorting controls, and advanced search functionality.

#### 4.3 Product Detail Page

Each product must have its own shareable URL.

Example route:

`/products/[slug]`

The product detail page must contain:

- Main product image.
- Additional product images, if available.
- Product name.
- Price in Turkish lira.
- Product description.
- A back-to-catalog navigation option.

Image gallery behavior:
- Display the main image prominently.
- Allow customers to select additional images.
- Support touch interaction on mobile.
- Keep the image gallery simple and intuitive.

If a product has no additional images, display only the main image without empty gallery placeholders.

If a product becomes inactive or is deleted, its public detail page must no longer display the product.

Provide an appropriate not-found page for unavailable products.

#### 4.4 Contact and Social Media

Include a configurable Instagram profile link in the header and footer.

The link must be editable through a central configuration file.

Do not embed Instagram posts or build an Instagram feed integration.

Do not implement checkout, shopping carts, payment systems, or order forms.

### 5. Admin Panel

Create a separate, protected admin interface.

Suggested routes:

- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]/edit`

The admin panel must be functional, simple, and easy to understand for a non-technical boutique owner.

#### 5.1 Authentication

Use Supabase Auth for administrator authentication.

Requirements:
- Email and password login.
- Protected admin routes.
- Logout functionality.
- Redirect unauthenticated users to the login page.
- No public admin registration.
- Only explicitly authorized administrators may create, edit, or delete products.

Create the initial administrator account through a secure setup process.

Never expose Supabase service-role credentials in frontend code.

Do not rely solely on hiding admin pages in the frontend. Enforce authorization through Supabase Row Level Security (RLS).

#### 5.2 Admin Dashboard

Create a minimal dashboard displaying:

- Total number of products.
- Number of active products.
- A shortcut to add a new product.
- A list or table of recently added products.

Avoid charts, analytics, revenue statistics, customer statistics, or other features unrelated to product catalog management.

#### 5.3 Product Management

The admin must be able to:

- Create a product.
- Edit an existing product.
- Delete a product.
- Activate or deactivate a product.
- View all products in a manageable list.

Each product must support the following fields:

| Field | Required | Description |
|---|---|---|
| Name | Yes | Product name |
| Slug | Yes | Unique URL identifier, generated from the name |
| Description | No | Product description |
| Price | Yes | Product price in TRY |
| Main Image | Yes | Primary product image |
| Additional Images | No | Optional product gallery |
| Category | No | Optional product category |
| Featured | No | Whether the product appears in the featured section |
| Active | Yes | Whether the product is visible publicly |
| Created At | Automatic | Creation timestamp |
| Updated At | Automatic | Last update timestamp |

The product form must include clear validation and helpful error messages.

Price must be a valid non-negative amount.

The product name, slug, and main image must be validated before saving.

The slug should be generated automatically but remain editable when appropriate. Ensure that slugs are unique.

Use a consistent Turkish-friendly slug format. For example:

`Krem Renkli Şık Elbise` → `krem-renkli-sik-elbise`

If a slug already exists, automatically generate a unique alternative.

#### 5.4 Image Upload

Product image management is a core requirement.

Use Supabase Storage to store product images.

The administrator must be able to:

- Upload a main image.
- Upload multiple additional images.
- Preview uploaded images.
- Change the main image.
- Remove additional images.
- Replace existing images when editing a product.

Requirements:
- Accept common image formats such as JPEG, PNG, and WebP.
- Validate file types and sizes.
- Show upload progress where practical.
- Display clear upload errors.
- Optimize image delivery for the public website.
- Use persistent storage rather than browser-local storage.

Use a dedicated storage bucket for product images.

Public product images may be served through a public bucket. However, upload, replacement, and deletion operations must be restricted to authorized administrators.

Avoid leaving orphaned files in storage when images are replaced or products are deleted.

When editing a product, do not delete images that are still referenced by that product.

### 6. Supabase Architecture

Keep the backend simple and use Supabase for the following:

1. PostgreSQL database for product data.
2. Supabase Auth for administrator authentication.
3. Supabase Storage for product images.

Create the necessary database schema and SQL migration files in the repository.

The initial schema should contain a `products` table with fields corresponding to the product model defined above.

Use PostgreSQL's `numeric` type for prices rather than floating-point types.

Store additional image paths as a PostgreSQL text array or another simple, appropriate structure.

Create appropriate indexes and constraints for product slugs and public catalog queries.

#### Security Requirements

Implement Row Level Security on all relevant tables.

Public visitors must be able to read active products only.

Unauthenticated visitors must not be able to create, modify, or delete products.

Only authorized administrators may manage products.

Do not assume that any authenticated user is an administrator. Use an explicit authorization mechanism that cannot be bypassed by ordinary users modifying their own profile metadata.

Protect storage operations using appropriate Supabase Storage policies.

Use environment variables for configuration.

Required environment variables should include:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Use the current Supabase publishable-key conventions if appropriate for the selected SDK version.

If a service-role key is required for a specific server-side operation, keep it server-side and never expose it to the browser.

Never commit secrets to GitHub.

Provide an `.env.example` file containing placeholder values only.

### 7. User Experience

The application must provide clear feedback for all important actions.

Implement:
- Loading states.
- Empty states.
- Error states.
- Form validation.
- Success notifications.
- Delete confirmation dialogs.
- Image upload feedback.
- A custom 404 page.

Use appropriate loading indicators when fetching products.

Prevent accidental duplicate submissions.

After creating, editing, or deleting a product, update the admin interface appropriately.

Ensure that public catalog pages reflect product changes without requiring a manual database operation or redeployment.

Use server-side rendering or an appropriate data-fetching and caching strategy for public product pages. Revalidate cached content after product changes where applicable.

### 8. Performance and SEO

The website must load quickly, especially on mobile devices.

Requirements:
- Use Next.js image optimization where compatible with the selected hosting provider.
- Set appropriate image dimensions and aspect ratios to prevent layout shifts.
- Lazy-load non-critical images.
- Optimize image sizes.
- Avoid unnecessary client-side JavaScript.
- Use semantic HTML.
- Provide appropriate page titles and meta descriptions.
- Generate product-specific metadata.
- Support Open Graph metadata for product sharing.
- Use readable product URLs.

Product detail URLs should be suitable for sharing through Instagram messages and other social platforms.

### 9. Out of Scope

Do not implement the following:

- Shopping cart.
- Checkout.
- Online payment integration.
- Order management.
- Customer registration.
- Customer accounts.
- Inventory tracking.
- Stock quantity management.
- Shipping management.
- Coupon codes.
- Reviews and ratings.
- Wishlist functionality.
- Email marketing.
- Blog or editorial content management.
- Advanced analytics.
- Multi-vendor functionality.
- Complex product variants.
- AI product recommendations.

Keep the application focused on product presentation and straightforward product management.

### 10. Deployment and Setup

The project must be easy to configure and deploy.

Provide:

- A complete README.
- Installation instructions.
- Environment variable instructions.
- Supabase project setup instructions.
- Database migration SQL files.
- Storage bucket configuration.
- Authentication and administrator setup instructions.
- Deployment instructions.
- Instructions for creating the initial admin account.

The application must not depend on manually inserting product records into the database.

All product management must be possible through the admin interface.

Ensure that a fresh installation can be configured by following the README.

Do not hardcode development credentials or rely on local-only data.

### 11. Definition of Done

The project is considered complete when all of the following conditions are met:

1. The public homepage displays a polished boutique design.
2. Customers can browse active products.
3. Each product has a working detail page.
4. Main and additional product images display correctly.
5. The administrator can securely log in.
6. The administrator can create products through the UI.
7. The administrator can upload and manage product images.
8. The administrator can edit product names, descriptions, prices, and images.
9. The administrator can activate and deactivate products.
10. The administrator can delete products.
11. Changes are persisted in Supabase.
12. Unauthorized visitors cannot modify products.
13. Inactive and deleted products are not publicly accessible.
14. The website works on desktop and mobile.
15. The project can be deployed using the documented setup process.
16. No payment or order functionality is present.
17. No secrets are exposed in client-side code or committed to the repository.

### 12. Implementation Instructions for the AI Coding Agent

Build the application as a complete, working project rather than a visual prototype.

Before implementing:
- Define the project structure.
- Design the database schema.
- Plan authentication and authorization.
- Establish the image storage strategy.
- Define the public and admin routes.

Then implement the application in logical stages.

Prioritize a polished visual design, a reliable product management workflow, and secure Supabase integration.

Do not add features beyond this specification without a clear technical necessity.

Do not leave core functionality as mock data, placeholder buttons, or TODO comments.

Use realistic development seed data only when necessary, and ensure that it is separate from production data.

Test the complete workflow: log in, create a product, upload images, edit the product, deactivate it, reactivate it, and delete it.

The final result should be a small, maintainable, elegant boutique catalog website that can be operated by a non-technical business owner.