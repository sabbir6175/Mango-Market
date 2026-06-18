# ফ্রেশ ফুড রংপুর — React + Firebase ভার্সন

মূল WordPress সাইট (freshfoodltd.shop)-এর same to same কপি, React + Tailwind CSS দিয়ে বানানো। Order/Payment সিস্টেম WooCommerce-এর বদলে Firebase দিয়ে রিবিল্ড করা। স্টাইলিং পুরোটাই Tailwind utility classes দিয়ে করা (আলাদা .css ফাইল নেই, শুধু src/index.css-এ Tailwind import + color tokens আছে)।

## যা যা আছে

- Home page: Hero, Why Choose Us, Customer Reviews, FAQ, Pricing, Order Form (সব সেকশন একই টেক্সট/কালার সহ)
- Order Form: কোয়ান্টিটি সিলেক্টর + Billing details + Live order summary
- Thank You page: অর্ডারের পর কনফার্মেশন পেজ (WooCommerce-এর thank-you পেজের মতো)
- Admin Panel (`/admin`): Login করে সব অর্ডার দেখা, ফোন নম্বরে কল দেওয়া, status আপডেট করা (নতুন → কনফার্ম → ডেলিভারি)

## পেমেন্ট সিস্টেম কীভাবে কাজ করে

এখানে কোনো অনলাইন পেমেন্ট গেটওয়ে নেই — শুধু Cash on Delivery। অর্ডার সাবমিট হলে সরাসরি Firebase Firestore-এ সেভ হয় (status: "pending")। তুমি/ক্লায়েন্ট `/admin` থেকে লগইন করে অর্ডার দেখবে, কাস্টমারকে ফোন করে কনফার্ম করবে, আর status বদলে দেবে।

## Firebase সেটআপ করতে যা করতে হবে (একবার মাত্র)

1. https://console.firebase.google.com -এ গিয়ে নতুন প্রজেক্ট বানাও
2. Firestore Database চালু করো (Build > Firestore Database > Create database, Production mode-এ)
3. Authentication চালু করো (Build > Authentication > Sign-in method > Email/Password চালু করো)
4. Authentication > Users থেকে একটা ইউজার বানাও (ক্লায়েন্টের ইমেইল + পাসওয়ার্ড) — এটাই অ্যাডমিন লগইন হবে
5. Project Settings (⚙️ আইকন) > General > Your apps > Web app যোগ করো, সেখান থেকে firebaseConfig অবজেক্টটা কপি করো
6. সেই কনফিগ বসিয়ে দাও src/firebase/config.js ফাইলে (এখন placeholder মান বসানো আছে)

### Firestore Security Rules (জরুরি)

Firestore Console > Rules-এ গিয়ে এই rule বসাও, যাতে কেউ বাইরে থেকে অর্ডার ডেটা পড়তে না পারে, কিন্তু create করতে পারে:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow create: if true;
      allow read, update: if request.auth != null;
    }
  }
}
```

## ছবি বদলানো (জরুরি — same to same করার জন্য)

public/images/ ফোল্ডারে এখন placeholder ছবি (আম আইকন) আছে। আসল ছবি দিয়ে বদলে দিতে হবে:

- hero.svg → লোগো/হিরো ছবি (গোল লোগো)
- product.svg → প্রোডাক্ট কার্ড ছবি (আম)
- gallery.svg → "কেন আমাদের আম নিবেন" গ্যালারির ৯টা ছবি
- review.svg → কাস্টমার রিভিউ স্ক্রিনশট

নতুন ছবি .jpg/.png দিয়ে দিলে কোডে ফাইলের extension বদলে দিতে হবে (src/components/ আর src/data/products.js-এ)।

## লোকাল রান করার কমান্ড

npm install
npm run dev

## প্রোডাকশনে ডিপ্লয় করতে

npm run build

dist/ ফোল্ডার বের হবে, সেটা Vercel/Netlify/Firebase Hosting-এ আপলোড করা যাবে।

## দাম/প্রোডাক্ট বদলাতে চাইলে

src/data/products.js ফাইলে গিয়ে নাম, দাম বদলে দিলেই পুরো সাইটে আপডেট হয়ে যাবে।
