# Xatspace Project Documentation

## Project Overview

This project is creating an **xatspace** for the website [xat.com](https://xat.com). An xatspace is a customizable group page that uses an **xatframe** to provide custom backgrounds and styling.

## What is an Xatframe?

An xatframe is an HTML document that is embedded via iframe behind your chat or xatspace to customize the outer background. Within the embedded page, you can use any combination of HTML/CSS/JavaScript.

### Key Characteristics

- Embedded behind the xat chat interface as an iframe
- Can contain HTML, CSS, and limited JavaScript
- Used to customize the visual appearance of xat group pages
- Must be hosted on a publicly accessible URL

## Technical Requirements

### Hosting

- **Recommended**: GitHub Pages (github.io) - pre-approved and easy to setup
- **Custom domains**: Require unblocking by submitting a ticket to xat support
- Must be accessible via HTTPS
- Must be publicly accessible

### Content Restrictions

Xatframes **MUST**:
- Be suitable for viewing by all ages
- Not contain IP trackers or content that can be used to track IP addresses
- Not embed chats in an iframe
- Not contain commercial advertisements or similar content

### Implementation

To use a xatframe:
1. Create your HTML/CSS/JavaScript file
2. Host it on GitHub Pages or approved hosting
3. Add the URL to the "xatframe" field in your group or xatspace settings

## Resources

### Official Documentation

- **Xatframe Wiki**: https://wiki.xat.com/Xatframe
- **Xatspace Wiki**: https://wiki.xat.com/xatspace
- **Owner's Guide**: https://wiki.xat.com/Owners_Guide

### Example Repositories

- **Reference GitHub User**: https://github.com/birdyxs?tab=repositories
  - Contains multiple working xatframe examples
  - Good for studying structure and implementation patterns

### Community Resources

- **Forum Guide**: https://forum.xat.com/topic/14787-how-to-make-your-own-xatframe-with-github/
- **Xatframe Library**: https://forum.xat.com/topic/14357-introduction-xatframe-library/

## Project Structure

This xatspace project should include:

- `index.html` - Main xatframe HTML file
- CSS styling for the background and visual elements
- JavaScript for any interactive features (within xat's restrictions)
- Assets folder for images, fonts, etc.

## Development Guidelines

### Best Practices

1. **Keep it lightweight**: Xatframes load in the background, so optimize for performance
2. **Test responsiveness**: Ensure your design works at different resolutions
3. **Validate HTML/CSS**: Use valid, standards-compliant code
4. **Avoid tracking**: Do not include analytics or IP tracking scripts
5. **Safe JavaScript**: Only use JavaScript that doesn't violate xat's terms

### Common Patterns

- Background images/patterns
- Animated backgrounds (CSS animations)
- Custom fonts and typography
- Border decorations
- Theme switchers (light/dark modes)

## Deployment Workflow

1. Develop and test locally
2. Commit changes to GitHub repository
3. Enable GitHub Pages on the repository
4. Use the GitHub Pages URL in xat group settings
5. Test in actual xat environment
6. Iterate as needed

## Notes

- Changes to xatframes may take a few minutes to appear on xat.com due to caching
- Always test your xatframe in the actual xat environment before finalizing
- Keep backup versions of working xatframes
- Follow xat's terms of service and content guidelines
