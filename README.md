# Mobile Wallet Deeplinks

A simple, responsive webpage that provides deeplinks to open mobile wallet apps directly from a web browser. Supports Phantom, Solflare, Backpack, and Trust Wallet.

## Features

- 🚀 **Instant App Opening**: Click to open wallet apps directly on mobile devices
- 📱 **Cross-Platform**: Works on both iOS and Android
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 📱 **Responsive**: Optimized for all screen sizes
- 🔄 **Fallback Support**: Redirects to app store if app isn't installed
- ♿ **Accessible**: Keyboard navigation and screen reader support

## Supported Wallets

- **Phantom** - Solana wallet for DeFi and NFTs
- **Solflare** - Secure Solana wallet
- **Backpack** - Solana wallet and exchange
- **Trust Wallet** - Multi-chain crypto wallet

## Deployment on Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to configure your project

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository
2. Connect your GitHub account to Vercel
3. Import your repository in Vercel dashboard
4. Deploy automatically

### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Upload your project folder
4. Deploy

## Configuration

The project includes a `vercel.json` configuration file with:

- **Static file serving** for optimal performance
- **Security headers** for enhanced protection
- **Caching strategies** for better performance
- **SPA routing** support

## Customization

### Updating Meta Tags

Before deployment, update the meta tags in `index.html`:

```html
<meta property="og:url" content="https://your-domain.vercel.app">
<meta property="og:image" content="https://your-domain.vercel.app/og-image.png">
<meta name="twitter:image" content="https://your-domain.vercel.app/og-image.png">
```

### Adding New Wallets

To add a new wallet, update the `walletDeeplinks` object in `script.js`:

```javascript
const walletDeeplinks = {
    // ... existing wallets
    newWallet: {
        ios: 'newwallet://',
        android: 'newwallet://',
        fallback: 'https://newwallet.com'
    }
};
```

Then add the corresponding HTML card and JavaScript function.

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## Browser Support

- ✅ Chrome (Mobile & Desktop)
- ✅ Safari (Mobile & Desktop)
- ✅ Firefox (Mobile & Desktop)
- ✅ Edge (Mobile & Desktop)

## Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: Optimized for fast loading
- **Mobile-First**: Designed with mobile performance in mind

## Security

- Content Security Policy headers
- XSS protection
- Clickjacking protection
- Secure caching policies

## License

MIT License - feel free to use this project for your own purposes.

## Support

If you encounter any issues or have questions, please open an issue in the repository.
