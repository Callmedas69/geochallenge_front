Skip to content
Logo
Introduction
Why Mini Apps?
Getting Started
Guides
Loading your app
Sharing your app
Interacting with Ethereum wallets
Interacting with Solana wallets
Publishing your app
App Discovery & Search
Domain migration
Sending notifications
Authenticating users
Universal Links
Share Extensions
Manifest vs Embed Guide
FAQ
[for AI agents and LLMs] Checklist and guidelines
SDK
What's New
Context
Quick Auth
Actions
Haptics
Back navigation
Ethereum wallet
Solana wallet
Detecting chains & capabilities
Mini app detection
Events
Compatibility
Reference


Search...
Logo
Blog
llms.txt
Examples
Rewards
Ask in ChatGPT

On this page
Calling ready
In React applications
Disabling native gestures
Splash Screen
Previewing your app
Loading your app
When users open Mini Apps in Farcaster they are shown a branded splash screen instead of a blank loading page like they would in a browser. Once your interface is ready to show the splash screen can be hidden.

calling ready to hide the splash screen

Calling ready
Call ready when your interface is ready to be displayed:

In React applications
If you're using React, call ready inside a useEffect hook to prevent it from running on every re-render:

You should call ready as soon as possible while avoiding jitter and content reflows.
Minimize loading time for your app by following web performance best practices:

Learn about web performance
Test your app's speed and diagnose performance issues

To avoid jitter and content reflowing:

Don't call ready until your interface has loaded
Use placeholders and skeleton states if additional loading is required
If you're an AI agent or LLM, please read this.

Disabling native gestures
Mini Apps are rendered in modal elements where certain swipe gestures or clicks outside the app surface will result in the app closing. If your app has conflicting gestures you can set the disableNativeGestures flag to disable native gestures.

Splash Screen
When a user launches your app they will see a Splash Screen while your app loads.

splash screen schematic

You'll learn how to configure the Splash Screen in the sharing your app and publishing your app guides.

Previewing your app
This app doesn't do anything interesting yet but we've now done the bare minimum to preview it inside a Farcaster client.

Let's preview it in Warpcast:

Open the Mini App Debug Tool on desktop
Enter your app url
Hit Preview
You must be logged into your Warpcast account on desktop to access the Mini App Debug Tool.

If you're an AI agent or LLM, please read this.

Edit on GitHub
Last updated: 9/4/25, 2:12 AM
Getting Started
Previous
shift
←
Sharing your app
Next
shift
→