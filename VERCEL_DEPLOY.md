# Vercel Deployment Guide

## ✅ Build Status
Build is now successful and ready for deployment!

## 🚀 Deploy to Vercel

### Option 1: Deploy via CLI (Recommended)

```bash
cd /Users/vinh/my-app
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Import your GitHub repository: `Avnsmith/modern-web-app`
3. Vercel will auto-detect Next.js configuration
4. Add environment variables (see below)
5. Deploy!

## 🔐 Environment Variables

**IMPORTANT**: You must add these environment variables in Vercel Dashboard:

1. Go to your project settings → Environment Variables
2. Add the following:

### Required Variables:

```
NEXT_PUBLIC_WALLETCONNECT_ID=demo
RPC_URL=https://sepolia.infura.io/v3/50cd28072c734af894341e362fcc0263
PRIVATE_KEY=0x6b1cd23e464d50f7bdaea9431613c69f20d2cf55b817483798d4909481e2cd41
CHAIN_ID=11155111
NEXT_PUBLIC_TIPS_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

### Security Notes:

- ⚠️ **PRIVATE_KEY** is sensitive - only add in Vercel environment variables
- Never commit `.env.local` to git (already in `.gitignore`)
- Vercel encrypts environment variables automatically

## 📋 Deployment Checklist

- [x] Build passes locally (`pnpm build`)
- [x] All TypeScript errors fixed
- [x] All ESLint warnings resolved
- [ ] Environment variables added in Vercel
- [ ] Deploy to production
- [ ] Test live deployment
- [ ] Verify Sepolia transactions work

## 🔍 Post-Deployment

After deployment:

1. **Test the app**: Visit your Vercel URL
2. **Connect wallet**: Use MetaMask with Sepolia network
3. **Send test tip**: Verify real Sepolia transaction
4. **Check logs**: Monitor Vercel function logs for errors

## 📊 Monitoring

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Function Logs**: Check API route logs in Vercel dashboard
- **Analytics**: Enable Vercel Analytics for usage tracking

## 🐛 Troubleshooting

**Build fails:**
- Check Vercel build logs
- Verify all dependencies are in `package.json`
- Ensure Node.js version is compatible (18+)

**Environment variables not working:**
- Redeploy after adding variables
- Check variable names match exactly
- Verify no typos in values

**Transactions failing:**
- Check wallet has Sepolia ETH
- Verify RPC_URL is correct
- Check PRIVATE_KEY is valid
- Review Vercel function logs

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Project URL: Will be provided after deployment
- Sepolia Etherscan: https://sepolia.etherscan.io/

