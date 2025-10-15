# @vercel/og Reference

The package exposes an `ImageResponse` constructor, with the following parameters:

ImageResponse Interface

TypeScript

TypeScriptJavaScript

```
import { ImageResponse } from '@vercel/og'
 
new ImageResponse(
  element: ReactElement,
  options: {
    width?: number = 1200
    height?: number = 630
    emoji?: 'twemoji' | 'blobmoji' | 'noto' | 'openmoji' = 'twemoji',
    fonts?: {
      name: string,
      data: ArrayBuffer,
      weight: number,
      style: 'normal' | 'italic'
    }[]
    debug?: boolean = false
 
    // Options that will be passed to the HTTP response
    status?: number = 200
    statusText?: string
    headers?: Record<string, string>
  },
)
```

### [Main parameters](#main-parameters)

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `element` | `ReactElement` | — | The React element to generate the image from. |
| `options` | `object` | — | Options to customize the image and HTTP response. |

### [Options parameters](#options-parameters)

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `number` | `1200` | The width of the image. |
| `height` | `number` | `630` | The height of the image. |
| `emoji` | `twemoji` `blobmoji` `noto` `openmoji` `twemoji` | The emoji set to use. |  |
| `debug` | `boolean` | `false` | Debug mode flag. |
| `status` | `number` | `200` | The HTTP status code for the response. |
| `statusText` | `string` | — | The HTTP status text for the response. |
| `headers` | `Record<string, string>` | — | The HTTP headers for the response. |

### [Fonts parameters (within options)](#fonts-parameters-within-options)

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | The name of the font. |
| `data` | `ArrayBuffer` | — | The font data. |
| `weight` | `number` | — | The weight of the font. |
| `style` | `normal` `italic` | — | The style of the font. |

By default, the following headers will be included by `@vercel/og`:

included-headers

```
'content-type': 'image/png',
'cache-control': 'public, immutable, no-transform, max-age=31536000',
```

## [Supported HTML and CSS features](#supported-html-and-css-features)

Refer to [Satori's documentation](https://github.com/vercel/satori#documentation) for a list of supported HTML and CSS features.

By default, `@vercel/og` only has the Noto Sans font included. If you need to use other fonts, you can pass them in the `fonts` option. View the [custom font example](/docs/recipes/using-custom-font) for more details.

## [Acknowledgements](#acknowledgements)

*   [Twemoji](https://github.com/twitter/twemoji)
*   [Google Fonts](https://fonts.google.com) and [Noto Sans](https://www.google.com/get/noto/)
*   [Resvg](https://github.com/RazrFalcon/resvg) and [Resvg.js](https://github.com/yisibl/resvg-js)


# Open Graph (OG) Image Generation

To assist with generating dynamic [Open Graph (OG)](https://ogp.me/) images, you can use the Vercel `@vercel/og` library to compute and generate social card images using [Vercel Functions](/docs/functions).

## [Benefits](#benefits)

*   Performance: With a small amount of code needed to generate images, [functions](/docs/functions) can be started almost instantly. This allows the image generation process to be fast and recognized by tools like the [Open Graph Debugger](https://en.rakko.tools/tools/9/)
*   Ease of use: You can define your images using HTML and CSS and the library will dynamically generate images from the markup
*   Cost-effectiveness: `@vercel/og` automatically adds the correct headers to cache computed images at the edge, helping reduce cost and recomputation

## [Supported features](#supported-features)

*   Basic CSS layouts including flexbox and absolute positioning
*   Custom fonts, text wrapping, centering, and nested images
*   Ability to download the subset characters of the font from Google Fonts
*   Compatible with any framework and application deployed on Vercel
*   View your OG image and other metadata before your deployment goes to production through the [Open Graph](/docs/deployments/og-preview) tab

## [Runtime support](#runtime-support)

Vercel OG image generation is supported on the [Node.js runtime](/docs/functions/runtimes/node-js).

Local resources can be loaded directly using `fs.readFile`. Alternatively, `fetch` can be used to load remote resources.

og.js

```
const fs = require('fs').promises;
 
const loadLocalImage = async () => {
  const imageData = await fs.readFile('/path/to/image.png');
  // Process image data
};
```

### [Runtime caveats](#runtime-caveats)

There are limitations when using `vercel/og` with the Next.js Pages Router and the Node.js runtime. Specifically, this combination does not support the `return new Response(…)` syntax. The table below provides a breakdown of the supported syntaxes for different configurations.

| Configuration | Supported Syntax | Notes |
| --- | --- | --- |
| `pages/` + Edge runtime | `return new Response(…)` | Fully supported. |
| `app/` + Node.js runtime | `return new Response(…)` | Fully supported. |
| `app/` + Edge runtime | `return new Response(…)` | Fully supported. |
| `pages/` + Node.js runtime | Not supported | Does not support `return new Response(…)` syntax with `vercel/og`. |

## [Usage](#usage)

### [Requirements](#requirements)

*   Install Node.js 22 or newer by visiting [nodejs.org](https://nodejs.org)
*   Install `@vercel/og` by running the following command inside your project directory. This isn't required for Next.js App Router projects, as the package is already included:

pnpmyarnnpmbun

```
pnpm i @vercel/og
```

*   For Next.js implementations, make sure you are using Next.js v12.2.3 or newer
*   Create API endpoints that you can call from your front-end to generate the images. Since the HTML code for generating the image is included as one of the parameters of the `ImageResponse` function, the use of `.jsx` or `.tsx` files is recommended as they are designed to handle this kind of syntax
*   To avoid the possibility of social media providers not being able to fetch your image, it is recommended to add your OG image API route(s) to `Allow` inside your `robots.txt` file. For example, if your OG image API route is `/api/og/`, you can add the following line:
    
    robots.txt
    
    ```
    Allow: /api/og/*
    ```
    
    If you are using Next.js, review [robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#static-robotstxt) to learn how to add or generate a `robots.txt` file.

### [Getting started](#getting-started)

Get started with an example that generates an image from static text using Next.js by setting up a new app with the following command:

pnpmyarnnpmbun

```
pnpm create next-app
```

Create an API endpoint by adding `route.tsx` under the `app/api/og` directory in the root of your project.

Then paste the following code:

Next.js (/app)Next.js (/pages)Other frameworks

app/api/og/route.tsx

TypeScript

TypeScriptJavaScript

```
import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.
 
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        👋 Hello
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```

If you're not using a framework, you must either add `"type": "module"` to your `package.json` or change your JavaScript Functions' file extensions from `.js` to `.mjs`

Run the following command:

pnpmyarnnpmbun

```
pnpm dev
```

Then, browse to `http://localhost:3000/api/og`. You will see the following image:

![](/vc-ap-vercel-docs/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fconcepts%2Ffunctions%2Fog-image%2Fog-language.png&w=3840&q=75)

### [Consume the OG route](#consume-the-og-route)

Deploy your project to obtain a publicly accessible path to the OG image API endpoint. You can find an example deployment at [https://og-examples.vercel.sh/api/static](https://og-examples.vercel.sh/api/static).

Then, based on the [Open Graph Protocol](https://ogp.me/#metadata), create the web content for your social media post as follows:

*   Create a `<meta>` tag inside the `<head>` of the webpage
*   Add the `property` attribute with value `og:image` to the `<meta>` tag
*   Add the `content` attribute with value as the absolute path of the `/api/og` endpoint to the `<meta>` tag

With the example deployment at [https://og-examples.vercel.sh/api/static](https://og-examples.vercel.sh/api/static), use the following code:

index.js

```
<head>
  <title>Hello world</title>
  <meta
    property="og:image"
    content="https://og-examples.vercel.sh/api/static"
  />
</head>
```

Every time you create a new social media post, you need to update the API endpoint with the new content. However, if you identify which parts of your `ImageResponse` will change for each post, you can then pass those values as parameters of the endpoint so that you can use the same endpoint for all your posts.

In the examples below, we explore using parameters and including other types of content with `ImageResponse`.

## [Examples](#examples)

*   [Dynamic title](/docs/og-image-generation/examples#dynamic-title): Passing the image title as a URL parameter
*   [Dynamic external image](/docs/og-image-generation/examples#dynamic-external-image): Passing the username as a URL parameter to pull an external profile image for the image generation
*   [Emoji](/docs/og-image-generation/examples#emoji): Using emojis to generate the image
*   [SVG](/docs/og-image-generation/examples#svg): Using SVG embedded content to generate the image
*   [Custom font](/docs/og-image-generation/examples#custom-font): Using a custom font available in the file system to style your image title
*   [Tailwind CSS](/docs/og-image-generation/examples#tailwind-css): Using Tailwind CSS (Experimental) to style your image content
*   [Internationalization](/docs/og-image-generation/examples#internationalization): Using other languages in the text for generating your image
*   [Secure URL](/docs/og-image-generation/examples#secure-url): Encrypting parameters so that only certain values can be passed to generate your image

## [Technical details](#technical-details)

*   Recommended OG image size: 1200x630 pixels
*   `@vercel/og` uses [Satori](https://github.com/vercel/satori) and Resvg to convert HTML and CSS into PNG
*   `@vercel/og` [API reference](/docs/og-image-generation/og-image-api)

## [Limitations](#limitations)

*   Only `ttf`, `otf`, and `woff` font formats are supported. To maximize the font parsing speed, `ttf` or `otf` are preferred over `woff`
*   Only flexbox (`display: flex`) and a subset of CSS properties are supported. Advanced layouts (`display: grid`) will not work. See [Satori](https://github.com/vercel/satori)'s documentation for more details on supported CSS properties
*   Maximum bundle size of 500KB. The bundle size includes your JSX, CSS, fonts, images, and any other assets. If you exceed the limit, consider reducing the size of any assets or fetching at runtime


# Open Graph (OG) Image Generation

To assist with generating dynamic [Open Graph (OG)](https://ogp.me/) images, you can use the Vercel `@vercel/og` library to compute and generate social card images using [Vercel Functions](/docs/functions).

## [Benefits](#benefits)

*   Performance: With a small amount of code needed to generate images, [functions](/docs/functions) can be started almost instantly. This allows the image generation process to be fast and recognized by tools like the [Open Graph Debugger](https://en.rakko.tools/tools/9/)
*   Ease of use: You can define your images using HTML and CSS and the library will dynamically generate images from the markup
*   Cost-effectiveness: `@vercel/og` automatically adds the correct headers to cache computed images at the edge, helping reduce cost and recomputation

## [Supported features](#supported-features)

*   Basic CSS layouts including flexbox and absolute positioning
*   Custom fonts, text wrapping, centering, and nested images
*   Ability to download the subset characters of the font from Google Fonts
*   Compatible with any framework and application deployed on Vercel
*   View your OG image and other metadata before your deployment goes to production through the [Open Graph](/docs/deployments/og-preview) tab

## [Runtime support](#runtime-support)

Vercel OG image generation is supported on the [Node.js runtime](/docs/functions/runtimes/node-js).

Local resources can be loaded directly using `fs.readFile`. Alternatively, `fetch` can be used to load remote resources.

og.js

```
const fs = require('fs').promises;
 
const loadLocalImage = async () => {
  const imageData = await fs.readFile('/path/to/image.png');
  // Process image data
};
```

### [Runtime caveats](#runtime-caveats)

There are limitations when using `vercel/og` with the Next.js Pages Router and the Node.js runtime. Specifically, this combination does not support the `return new Response(…)` syntax. The table below provides a breakdown of the supported syntaxes for different configurations.

| Configuration | Supported Syntax | Notes |
| --- | --- | --- |
| `pages/` + Edge runtime | `return new Response(…)` | Fully supported. |
| `app/` + Node.js runtime | `return new Response(…)` | Fully supported. |
| `app/` + Edge runtime | `return new Response(…)` | Fully supported. |
| `pages/` + Node.js runtime | Not supported | Does not support `return new Response(…)` syntax with `vercel/og`. |

## [Usage](#usage)

### [Requirements](#requirements)

*   Install Node.js 22 or newer by visiting [nodejs.org](https://nodejs.org)
*   Install `@vercel/og` by running the following command inside your project directory. This isn't required for Next.js App Router projects, as the package is already included:

pnpmyarnnpmbun

```
pnpm i @vercel/og
```

*   For Next.js implementations, make sure you are using Next.js v12.2.3 or newer
*   Create API endpoints that you can call from your front-end to generate the images. Since the HTML code for generating the image is included as one of the parameters of the `ImageResponse` function, the use of `.jsx` or `.tsx` files is recommended as they are designed to handle this kind of syntax
*   To avoid the possibility of social media providers not being able to fetch your image, it is recommended to add your OG image API route(s) to `Allow` inside your `robots.txt` file. For example, if your OG image API route is `/api/og/`, you can add the following line:
    
    robots.txt
    
    ```
    Allow: /api/og/*
    ```
    
    If you are using Next.js, review [robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#static-robotstxt) to learn how to add or generate a `robots.txt` file.

### [Getting started](#getting-started)

Get started with an example that generates an image from static text using Next.js by setting up a new app with the following command:

pnpmyarnnpmbun

```
pnpm create next-app
```

Create an API endpoint by adding `route.tsx` under the `app/api/og` directory in the root of your project.

Then paste the following code:

Next.js (/app)Next.js (/pages)Other frameworks

app/api/og/route.tsx

TypeScript

TypeScriptJavaScriptPython

```
import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.
 
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        👋 Hello
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```

If you're not using a framework, you must either add `"type": "module"` to your `package.json` or change your JavaScript Functions' file extensions from `.js` to `.mjs`

Run the following command:

pnpmyarnnpmbun

```
pnpm dev
```

Then, browse to `http://localhost:3000/api/og`. You will see the following image:

![](/vc-ap-vercel-docs/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fconcepts%2Ffunctions%2Fog-image%2Fog-language.png&w=3840&q=75)

### [Consume the OG route](#consume-the-og-route)

Deploy your project to obtain a publicly accessible path to the OG image API endpoint. You can find an example deployment at [https://og-examples.vercel.sh/api/static](https://og-examples.vercel.sh/api/static).

Then, based on the [Open Graph Protocol](https://ogp.me/#metadata), create the web content for your social media post as follows:

*   Create a `<meta>` tag inside the `<head>` of the webpage
*   Add the `property` attribute with value `og:image` to the `<meta>` tag
*   Add the `content` attribute with value as the absolute path of the `/api/og` endpoint to the `<meta>` tag

With the example deployment at [https://og-examples.vercel.sh/api/static](https://og-examples.vercel.sh/api/static), use the following code:

index.js

```
<head>
  <title>Hello world</title>
  <meta
    property="og:image"
    content="https://og-examples.vercel.sh/api/static"
  />
</head>
```

Every time you create a new social media post, you need to update the API endpoint with the new content. However, if you identify which parts of your `ImageResponse` will change for each post, you can then pass those values as parameters of the endpoint so that you can use the same endpoint for all your posts.

In the examples below, we explore using parameters and including other types of content with `ImageResponse`.

## [Examples](#examples)

*   [Dynamic title](/docs/og-image-generation/examples#dynamic-title): Passing the image title as a URL parameter
*   [Dynamic external image](/docs/og-image-generation/examples#dynamic-external-image): Passing the username as a URL parameter to pull an external profile image for the image generation
*   [Emoji](/docs/og-image-generation/examples#emoji): Using emojis to generate the image
*   [SVG](/docs/og-image-generation/examples#svg): Using SVG embedded content to generate the image
*   [Custom font](/docs/og-image-generation/examples#custom-font): Using a custom font available in the file system to style your image title
*   [Tailwind CSS](/docs/og-image-generation/examples#tailwind-css): Using Tailwind CSS (Experimental) to style your image content
*   [Internationalization](/docs/og-image-generation/examples#internationalization): Using other languages in the text for generating your image
*   [Secure URL](/docs/og-image-generation/examples#secure-url): Encrypting parameters so that only certain values can be passed to generate your image

## [Technical details](#technical-details)

*   Recommended OG image size: 1200x630 pixels
*   `@vercel/og` uses [Satori](https://github.com/vercel/satori) and Resvg to convert HTML and CSS into PNG
*   `@vercel/og` [API reference](/docs/og-image-generation/og-image-api)

## [Limitations](#limitations)

*   Only `ttf`, `otf`, and `woff` font formats are supported. To maximize the font parsing speed, `ttf` or `otf` are preferred over `woff`
*   Only flexbox (`display: flex`) and a subset of CSS properties are supported. Advanced layouts (`display: grid`) will not work. See [Satori](https://github.com/vercel/satori)'s documentation for more details on supported CSS properties
*   Maximum bundle size of 500KB. The bundle size includes your JSX, CSS, fonts, images, and any other assets. If you exceed the limit, consider reducing the size of any assets or fetching at runtime


# @vercel/og Reference

The package exposes an `ImageResponse` constructor, with the following parameters:

ImageResponse Interface

TypeScript

TypeScriptJavaScript

```
import { ImageResponse } from '@vercel/og'
 
new ImageResponse(
  element: ReactElement,
  options: {
    width?: number = 1200
    height?: number = 630
    emoji?: 'twemoji' | 'blobmoji' | 'noto' | 'openmoji' = 'twemoji',
    fonts?: {
      name: string,
      data: ArrayBuffer,
      weight: number,
      style: 'normal' | 'italic'
    }[]
    debug?: boolean = false
 
    // Options that will be passed to the HTTP response
    status?: number = 200
    statusText?: string
    headers?: Record<string, string>
  },
)
```

### [Main parameters](#main-parameters)

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `element` | `ReactElement` | — | The React element to generate the image from. |
| `options` | `object` | — | Options to customize the image and HTTP response. |

### [Options parameters](#options-parameters)

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `number` | `1200` | The width of the image. |
| `height` | `number` | `630` | The height of the image. |
| `emoji` | `twemoji` `blobmoji` `noto` `openmoji` `twemoji` | The emoji set to use. |  |
| `debug` | `boolean` | `false` | Debug mode flag. |
| `status` | `number` | `200` | The HTTP status code for the response. |
| `statusText` | `string` | — | The HTTP status text for the response. |
| `headers` | `Record<string, string>` | — | The HTTP headers for the response. |

### [Fonts parameters (within options)](#fonts-parameters-within-options)

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | The name of the font. |
| `data` | `ArrayBuffer` | — | The font data. |
| `weight` | `number` | — | The weight of the font. |
| `style` | `normal` `italic` | — | The style of the font. |

By default, the following headers will be included by `@vercel/og`:

included-headers

```
'content-type': 'image/png',
'cache-control': 'public, immutable, no-transform, max-age=31536000',
```

## [Supported HTML and CSS features](#supported-html-and-css-features)

Refer to [Satori's documentation](https://github.com/vercel/satori#documentation) for a list of supported HTML and CSS features.

By default, `@vercel/og` only has the Noto Sans font included. If you need to use other fonts, you can pass them in the `fonts` option. View the [custom font example](/docs/recipes/using-custom-font) for more details.

## [Acknowledgements](#acknowledgements)

*   [Twemoji](https://github.com/twitter/twemoji)
*   [Google Fonts](https://fonts.google.com) and [Noto Sans](https://www.google.com/get/noto/)
*   [Resvg](https://github.com/RazrFalcon/resvg) and [Resvg.js](https://github.com/yisibl/resvg-js)


# OG Image Generation Examples

## [Dynamic title](#dynamic-title)

Create an api route with `route.tsx` in `/app/api/og/` and paste the following code:

Next.js (/app)Next.js (/pages)Other frameworks

app/api/og/route.tsx

TypeScript

TypeScriptJavaScript

```
import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.
 
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
 
    // ?title=<title>
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'My default title';
 
    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: 'black',
            backgroundSize: '150px 150px',
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              justifyItems: 'center',
            }}
          >
            <img
              alt="Vercel"
              height={200}
              src="data:image/svg+xml,%3Csvg width='116' height='100' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M57.5 0L115 100H0L57.5 0z' /%3E%3C/svg%3E"
              style={{ margin: '0 30px' }}
              width={232}
            />
          </div>
          <div
            style={{
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              color: 'white',
              marginTop: 30,
              padding: '0 120px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
```

## [Dynamic external image](#dynamic-external-image)

Create an api route with `route.tsx` in `/app/api/og/` and paste the following code:

Next.js (/app)Next.js (/pages)Other frameworks

app/api/og/route.tsx

TypeScript

TypeScriptJavaScript

```
import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  if (!username) {
    return new ImageResponse(<>Visit with &quot;?username=vercel&quot;</>, {
      width: 1200,
      height: 630,
    });
  }
 
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 60,
          color: 'black',
          background: '#f6f6f6',
          width: '100%',
          height: '100%',
          paddingTop: 50,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          width="256"
          height="256"
          src={`https://github.com/${username}.png`}
          style={{
            borderRadius: 128,
          }}
        />
        <p>github.com/{username}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```

## [Emoji](#emoji)

Create an api route with `route.tsx` in `/app/api/og/` and paste the following code:

Next.js (/app)Next.js (/pages)Other frameworks

app/api/og/route.tsx

TypeScript

TypeScriptJavaScript

```
import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.
 
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        👋, 🌎
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent' and 'fluentFlat'
      // Default to 'twemoji'
      emoji: 'twemoji',
    },
  );
}
```

## [SVG](#svg)

Create an api route with `route.tsx` in `/app/api/og/` and paste the following code:

Next.js (/app)Next.js (/pages)Other frameworks

app/api/og/route.tsx

TypeScript

TypeScriptJavaScript

```
import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.
 
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <svg fill="black" viewBox="0 0 284 65">
          <path d="M141.68 16.25c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm117.14-14.5c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm-39.03 3.5c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9v-46h9zM37.59.25l36.95 64H.64l36.95-64zm92.38 5l-27.71 48-27.71-48h10.39l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10v14.8h-9v-34h9v9.2c0-5.08 5.91-9.2 13.2-9.2z" />
        </svg>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```

## [Custom font](#custom-font)

Create an api route with `route.tsx` in `/app/api/og/` and paste the following code:

Next.js (/app)Next.js (/pages)Other frameworks

app/api/og/route.tsx

TypeScript

TypeScriptJavaScript

```
import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.
 
async function loadGoogleFont (font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)
 
  if (resource) {
    const response = await fetch(resource[1])
    if (response.status == 200) {
      return await response.arrayBuffer()
    }
  }
 
  throw new Error('failed to load font data')
}
 
export async function GET() {
  const text = 'Hello world!'
 
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: 'white',
          height: '100%',
          width: '100%',
          fontSize: 100,
          fontFamily: 'Geist',
          paddingTop: '100px',
          paddingLeft: '50px',
        }}
      >
        {text}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Geist',
          data: await loadGoogleFont('Geist', text),
          style: 'normal',
        },
      ],
    },
  );
}
```

## [Tailwind CSS](#tailwind-css)

Create an api route with `route.tsx` in `/app/api/og/` and paste the following code:

Next.js (/app)Next.js (/pages)Other frameworks

app/api/og/route.tsx

TypeScript

TypeScriptJavaScript

```
import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.
 
export async function GET() {
  return new ImageResponse(
    (
      // Modified based on https://tailwindui.com/components/marketing/sections/cta-sections
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <div tw="bg-gray-50 flex">
          <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
            <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
              <span>Ready to dive in?</span>
              <span tw="text-indigo-600">Start your free trial today.</span>
            </h2>
            <div tw="mt-8 flex md:mt-0">
              <div tw="flex rounded-md shadow">
                <a
                  href="#"
                  tw="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white"
                >
                  Get started
                </a>
              </div>
              <div tw="ml-3 flex rounded-md shadow">
                <a
                  href="#"
                  tw="flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```

## [Internationalization](#internationalization)

Create an api route with `route.tsx` in `/app/api/og/` and paste the following code:

Next.js (/app)Next.js (/pages)Other frameworks

app/api/og/route.tsx

TypeScript

TypeScriptJavaScript

```
import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.
 
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        👋 Hello 你好 नमस्ते こんにちは สวัสดีค่ะ 안녕 добрий день Hallá
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```

## [Secure URL](#secure-url)

Next.js (/app)Next.js (/pages)Other frameworks

app/api/encrypted/route.tsx

TypeScript

TypeScriptJavaScript

```
import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.
 
const key = crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode('my_secret'),
  { name: 'HMAC', hash: { name: 'SHA-256' } },
  false,
  ['sign'],
);
 
function toHex(arrayBuffer: ArrayBuffer) {
  return Array.prototype.map
    .call(new Uint8Array(arrayBuffer), (n) => n.toString(16).padStart(2, '0'))
    .join('');
}
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
 
  const id = searchParams.get('id');
  const token = searchParams.get('token');
 
  const verifyToken = toHex(
    await crypto.subtle.sign(
      'HMAC',
      await key,
      new TextEncoder().encode(JSON.stringify({ id })),
    ),
  );
 
  if (token !== verifyToken) {
    return new Response('Invalid token.', { status: 401 });
  }
 
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1>Card generated, id={id}.</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```

Create the dynamic route `[id]/page` under `/app/encrypted` and paste the following code:

Next.js (/app)Next.js (/pages)Other frameworks

app/encrypted/\[id\]/page.tsx

TypeScript

TypeScriptJavaScript

```
// This page generates the token to prevent generating OG images with random parameters (`id`).
import { createHmac } from 'node:crypto';
 
function getToken(id: string): string {
  const hmac = createHmac('sha256', 'my_secret');
  hmac.update(JSON.stringify({ id: id }));
  const token = hmac.digest('hex');
  return token;
}
 
interface PageParams {
  params: {
    id: string;
  };
}
 
export default function Page({ params }: PageParams) {
  console.log(params);
  const { id } = params;
  const token = getToken(id);
 
  return (
    <div>
      <h1>Encrypted Open Graph Image.</h1>
      <p>Only /a, /b, /c with correct tokens are accessible:</p>
      <a
        href={`/api/encrypted?id=${id}&token=${token}`}
        target="_blank"
        rel="noreferrer"
      >
        <code>
          /api/encrypted?id={id}&token={token}
        </code>
      </a>
    </div>
  );
}
```