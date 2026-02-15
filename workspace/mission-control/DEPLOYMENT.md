# Deployment Guide

## Production Build

### Build the application
```bash
npm run build
```

This creates an optimized production build in `.next/`

### Start production server
```bash
npm start
```

Server runs on `http://localhost:3000` by default.

## Environment Variables

Create `.env.local` for local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production, set:
```env
NEXT_PUBLIC_API_URL=https://your-domain.com
NODE_ENV=production
```

## Deployment Platforms

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t mission-control .
docker run -p 3000:3000 mission-control
```

### Traditional Server
1. Build: `npm run build`
2. Copy `.next/`, `public/`, `node_modules/`, `package.json` to server
3. Run: `npm start`
4. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "mission-control" -- start
   pm2 save
   pm2 startup
   ```

## Performance Optimizations

### Current Build Stats
- Home page: ~87 kB (First Load JS)
- All pages: Static pre-rendered
- API routes: Serverless functions

### Recommendations
1. **Images**: Use Next.js `<Image>` component for optimization
2. **Fonts**: Already optimized with `next/font`
3. **Caching**: Configure Cache-Control headers for static assets
4. **CDN**: Deploy to edge network (Vercel, Cloudflare)

## Monitoring

### Health Check Endpoint
Add to `app/api/health/route.ts`:
```typescript
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
}
```

### Logging
Consider adding:
- Sentry for error tracking
- Analytics (Vercel Analytics, Google Analytics)
- Performance monitoring (Web Vitals)

## Security

### Headers
Add to `next.config.js`:
```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### API Protection
For production APIs:
1. Add authentication middleware
2. Rate limiting
3. CORS configuration
4. Input validation

## Scaling

### Horizontal Scaling
- Deploy multiple instances behind load balancer
- Use Redis for shared session state
- Database connection pooling

### Caching Strategy
1. Static pages: Cache at CDN
2. API responses: Implement Redis cache
3. Browser caching: Set appropriate headers

## Backup & Recovery

### Database Backups
If using a database:
- Automated daily backups
- Point-in-time recovery
- Disaster recovery plan

### Code Versioning
- Git tags for releases
- Semantic versioning
- Rollback procedures

## Maintenance

### Updates
```bash
# Check outdated packages
npm outdated

# Update dependencies
npm update

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

### Build Verification
Before deploying:
1. Run `npm run build` locally
2. Test production build: `npm start`
3. Run test suite: `./test.sh`
4. Check for console errors
5. Verify all pages load

## Troubleshooting

### Build Fails
- Clear `.next/` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node -v` (should be 18+)

### Runtime Errors
- Check browser console
- Inspect server logs
- Verify environment variables
- Check API endpoint responses

### Performance Issues
- Analyze bundle size: `npm run build` shows stats
- Use Chrome DevTools Lighthouse
- Enable production mode: `NODE_ENV=production`
