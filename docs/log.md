## Error Type
Runtime TypeError

## Error Message
Cannot read properties of undefined (reading 'map')


    at Footer (src\components\Footer.tsx:87:37)
    at RootLayout (src\app\layout.tsx:40:11)

## Code Frame
  85 |             <h4 className="text-sm font-semibold">Product</h4>
  86 |             <ul className="space-y-2">
> 87 |               {FOOTER_LINKS.product.map((link) => (
     |                                     ^
  88 |                 <li key={link.href}>
  89 |                   <Link
  90 |                     href={link.href}

Next.js version: 15.5.4 (Webpack)
