import siteConfig from "../../assets/siteConfig.json";

const messages = {
  seo: {
    defaultTitle:
      "Bike Repair Atlanta | Tune-Ups & Bicycle Service | Basement Bike Mechanic",
    defaultDescription:
      "Shop-based Atlanta bike repair and tune-ups by appointment. Drop off at 2272 Melinda Dr NE — optional pickup and return within 5 miles. All work done at my basement workshop; no on-site mobile repairs. Text or book online.",
    privacyTitle: "Privacy Policy | Basement Bike Mechanic",
    privacyDescription:
      "How Basement Bike Mechanic collects and uses contact information for bicycle repair services. No spam; we never sell your data.",
    termsTitle: "Terms of Service | Basement Bike Mechanic",
    termsDescription:
      "Terms for SMS messaging, bicycle repair services, estimates, and liability at Basement Bike Mechanic in Atlanta.",
    bikesTitle: "Used Bikes for Sale in Atlanta | Basement Bike Mechanic",
    bikesDescription:
      "Browse quality used bicycles for sale from Basement Bike Mechanic in Atlanta. Contact us about availability and pricing.",
    bookTitle: "Book a Repair | Basement Bike Mechanic",
    bookDescription:
      "Request a bike repair with Basement Bike Mechanic in Atlanta. Fill out the form to book your service and get SMS updates on your repair.",
  },
  nav: {
    home: "Home",
    about: "About",
    bikesForSale: "Bikes for Sale",
    bookNow: "Book now",
    main: "Main",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    language: "Language",
    english: "English",
    spanish: "Español",
  },
  footer: {
    backToHome: "Back to home",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
  },
  home: {
    heroTitle: "Atlanta Bike Repair & Bicycle Tune-Ups",
    disclaimer:
      "Disclaimer: I do not offer on-site mobile repair services. All work is done at my basement workshop in Atlanta.",
    reviewsHeading: "What Customers Are Saying",
    aboutHeading: "About",
    aboutP1:
      "I grew up in Roswell, GA where bikes were just part of life — I rode everywhere and developed a real passion for cycling. I'm especially into mountain biking, and I love the trails in northern Georgia. That love of bikes never went away.",
    aboutP2:
      "A couple years ago I turned that lifelong passion into Basement Bike Mechanic. The name is literal: I work out of my basement in Atlanta, one appointment at a time — all shop-based repair, not mobile or on-site service. Working by reservation isn't just a scheduling preference — it means every bike gets real, focused attention instead of being rushed through a shop queue.",
    aboutP3:
      "When you drop your bike off with me, I'm the one working on it, start to finish. No handoffs, no shortcuts. Just an Atlanta cyclist who takes care of other people's bikes the same way he takes care of his own.",
    maintenanceHeading: "Regular Maintenance",
    tuneUpImageAlt:
      "Mechanic performing bicycle tune-up and bike repair service in Atlanta",
    tabTuneUps: "Tune Ups",
    tabServices: "Services",
    contactText: "Text:",
    contactEmail: "Email:",
    contactLocation: "Location:",
    mapTitle:
      "Map showing Basement Bike Mechanic location at 2272 Melinda Dr NE, Atlanta GA 30345",
    smsHeading: "SMS Communication",
    smsP1:
      "We send SMS updates from Basement Bike Mechanic related to active bike repairs, including booking confirmations, service progress, and pickup notifications.",
    smsP2:
      "Customers opt in by submitting a repair request form on our website and checking the optional SMS consent checkbox. This checkbox is displayed during the booking process and must be selected to receive messages.",
    smsP3:
      "Message frequency varies. Message & data rates may apply. Reply STOP to opt out, HELP for help. No marketing messages are sent.",
    smsViewOur: "View our",
    smsAnd: "and",
    smsTermsOfService: "Terms of Service",
  },
  mobileTuneUp: {
    chooseLabel: "Choose a tune-up",
    detailsOpen: "Details open",
    tapToView: "Tap to view details",
  },
  bikes: {
    pageTitle: "Used Bikes for Sale in Atlanta",
    introP1Prefix: "Browse our current used bike listings. Availability can change quickly — for the most up-to-date info, text",
    introP1Middle: "or email",
    introP2:
      "Looking for something specific (road, commuter, mountain, or ebike)? Reach out and we'll help you find a good fit.",
    loadingLabel: "Loading bikes for sale",
    loadingHint: "Loading bikes for sale…",
    loadError:
      "We couldn't load the bike listings right now. Please refresh the page or contact us at",
    noBikes:
      "No bikes are currently listed for sale. Check back soon or contact us at",
    inquireSuffix: " to inquire about availability.",
    loadErrorSuffix: ".",
    tileAlt: "{{name}} used bike for sale in Atlanta",
    close: "Close",
    prev: "← Prev",
    next: "Next →",
    contactMe: "Contact Me",
    imageAlt: "{{name}} - image {{index}}",
    jsonLdName: "Used Bikes for Sale in Atlanta",
    jsonLdListName: "Used bikes for sale in Atlanta",
  },
  privacy: {
    title: "Privacy Policy",
    intro:
      "At Basement Bike Mechanic, your privacy matters. We only collect contact information that you voluntarily provide when seeking bicycle repair services. This page describes how we handle your phone number and ensure your data stays secure.",
    optInTitle: "1. Opting In to SMS",
    optInP1: "SMS consent is collected through the repair request booking form on our website. To opt in, you must:",
    optInLi1: "Enter your phone number in the booking form.",
    optInLi2: "Check the optional SMS consent checkbox before submitting.",
    optInP2:
      'The checkbox reads: "By checking this box, you are allowing Basement Bike Mechanic to send you repair-related SMS messages, including booking confirmations, service updates, and pickup notifications. No marketing texts. Message frequency varies. Message & data rates may apply. Reply STOP to opt out and HELP for help."',
    optInP3:
      "Checking this box is optional. If you do, you allow Basement Bike Mechanic to send SMS updates related to your bicycle repair.",
    useTitle: "2. Use of Your Contact Information",
    useP1: "Your phone number is used solely for operational purposes related to bicycle repair:",
    useLi1: "Answering inquiries and providing quotes.",
    useLi2: "Updating you on repair status.",
    useLi3: "Notifying when your bike is ready for pickup.",
    useLi4: "Discussing parts, estimates, and technical issues discovered during service.",
    optOutTitle: "3. SMS Opt-Out",
    optOutP:
      "You may opt out of SMS messages at any time by replying STOP to any message. Reply HELP for assistance. After opting out, you will no longer receive SMS updates from us. Standard message and data rates may apply.",
    noSpamTitle: "4. No-Spam and Data Sharing Policy",
    noSpamP1: "We respect your inbox and will never:",
    noSpamLi1: "Send marketing messages, newsletters, or promotional blasts.",
    noSpamLi2: "Sell, share, or lease your information to third parties.",
    noSpamP2: "Your contact details remain private and are used only by our shop.",
    questionsPrefix: "If you have questions about this policy, please",
    emailUs: "email us",
  },
  terms: {
    title: "Terms and Conditions",
    intro:
      "Welcome to Basement Bike Mechanic. By using our bicycle repair services and communication channels, you agree to the following terms. Please read them carefully.",
    smsTitle: "1. SMS Messaging Terms",
    smsP1:
      "By providing your mobile number and checking the optional SMS consent checkbox in our booking form, you allow Basement Bike Mechanic to send SMS updates regarding your bicycle repair. This includes:",
    smsLi1: "Booking confirmations and appointment reminders.",
    smsLi2: "Repair status updates and progress notifications.",
    smsLi3: "Estimates, parts availability, and technical findings.",
    smsLi4: "Pickup notifications when your bike is ready.",
    smsP2:
      "No marketing messages will be sent. Message frequency varies based on your repair. Standard message and data rates may apply.",
    consentTitle: "2. Consent and Opt-Out",
    consentP1:
      "SMS consent is collected via the repair request booking form at basementbikemechanic.com. When submitting a booking:",
    consentLi1: "You enter your phone number.",
    consentLi2: "You may check the optional SMS consent checkbox to receive text updates.",
    consentP2:
      'The checkbox states: "By checking this box, you are allowing Basement Bike Mechanic to send you repair-related SMS messages, including booking confirmations, service updates, and pickup notifications. No marketing texts. Message frequency varies. Message & data rates may apply. Reply STOP to opt out and HELP for help."',
    consentP3Prefix:
      "Checking this box is optional. To opt out at any time, reply STOP to any message, text HELP for assistance, or contact us at",
    consentP3Suffix:
      ". Carriers are not liable for delayed or undelivered messages.",
    servicesTitle: "3. Services and Estimates",
    servicesP:
      "Quotes and estimates are subject to change based on our inspection. We will communicate any additional findings or costs before proceeding. Payment is due upon completion of service unless otherwise agreed in writing.",
    liabilityTitle: "4. Limitation of Liability",
    liabilityP:
      "Basement Bike Mechanic provides repair services in good faith. We are not liable for pre-existing damage, wear, or defects beyond our control. Our liability is limited to the cost of the service provided. Bicycles and personal property are left at your own risk while in our care.",
    generalTitle: "5. General Terms",
    generalP1:
      "We reserve the right to modify these terms. Continued use of our services after changes constitutes acceptance. If you have questions about these terms, please",
    emailUs: "email us",
  },
  book: {
    successTitle: "Request submitted",
    successBody:
      "We received your booking request and sent it to BikeOps. We'll review it and follow up soon.",
    trackStatus: "Track your repair status",
    pageTitle: "Book a Repair",
    intro:
      "Fill out the form below to request service. All repairs happen at my basement workshop — drop your bike off at the shop, or choose collection within 5 miles for pickup and return. Your booking will be sent directly into BikeOps, and the SMS consent message is shown here in the form before you submit.",
    firstName: "First name *",
    lastName: "Last name *",
    email: "Email *",
    phone: "Phone *",
    address: "Address",
    addressPlaceholder: "Optional street address",
    smsConsent:
      "By checking this box, you are allowing Basement Bike Mechanic to send you repair-related SMS messages, including booking confirmations, service updates, and pickup notifications. No marketing texts. Message frequency varies. Message and data rates may apply. Reply STOP to opt out and HELP for help. View our",
    termsLink: "Terms and Conditions",
    privacyLink: "Privacy Policy",
    bikeDetails: "Bike details",
    lookingUpBikes: "Looking up your saved bikes...",
    savedBikes: "Saved bikes",
    savedBikesFor: "Saved bikes for {{name}}",
    eBike: "E-bike",
    standardBike: "Standard bike",
    bikeTypeAuto: "Bike type auto-detected",
    bike: "Bike",
    bikeN: "Bike {{n}}",
    remove: "Remove",
    make: "Make *",
    model: "Model",
    type: "Type",
    autoDetect: "Auto-detect from make/model",
    addAnotherBike: "Add another bike",
    collectionPricingHint:
      "Collection service pricing is applied in BikeOps automatically when the booking is accepted.",
    requestedServices: "Requested services",
    deliveryOption: "Delivery option",
    dropOffAtShop: "Drop-off at shop",
    collectionService: "Collection service",
    preferredCollectionPickup: "Preferred collection pickup date",
    preferredDropOff: "Preferred drop-off date",
    preferredCollectionReturn: "Preferred collection return date",
    preferredPickup: "Preferred pickup date",
    time: "Time",
    optional: "(optional)",
    optionalOnly: "Optional",
    selectDate: "Select a date",
    selectTime: "Select a time",
    datesOptionalTitle: "Dates and times are optional.",
    datesOptionalBody:
      "Leave them blank if you're not sure yet, or skip the time if you're flexible on when you drop off or pick up.",
    collectionAddress: "Collection address",
    collectionAddressPlaceholder: "Street, city, ZIP",
    checkingCollection:
      "Checking whether this address is within our 5-mile collection area…",
    verifyAddressError:
      "We couldn't verify the address right now. Collection is only available within 5 miles.",
    collectionUnavailable: "Collection isn't available for this address.",
    milesAway: "It's about {{miles}} mi away.",
    collectWithin: "We collect within {{radius}} mi of the shop.",
    collectionAvailable:
      "Good news — this address is within our {{radius}}-mile collection area.",
    collectionWindowStart: "Collection window start",
    collectionWindowEnd: "Collection window end",
    collectionHelper:
      "Collection service is available within 5 miles of the shop. If you prefer drop-off instead, choose the shop option above.",
    notesLabel: "Anything else we should know?",
    notesPlaceholder: "Describe the issue, timing, or anything helpful for intake.",
    submitting: "Submitting request...",
    bookNow: "Book now",
    servicesLoadError:
      "Couldn't load services from BikeOps. Please refresh and try again. If you use an ad blocker or privacy tool, try disabling it for this site.",
    checkingAddress: "Checking collection address… please try again in a moment.",
    outsideRadius:
      "That address is outside our 5-mile collection radius. Please choose drop-off instead.",
    verifyFailed: "We couldn't verify that collection address. Please double-check it.",
    submitFailed: "Unable to submit booking. Please try again.",
    connectionFailed:
      "Unable to submit booking. Please check your connection and try again.",
  },
  bookPicker: {
    matchingServices: "Matching services",
    chooseServices: "Choose your services",
    checkEach: "Check each one you need",
    filterByType: "Filter services by type",
    searchPlaceholder: "Or search by name…",
    searchLabel: "Search services by name",
    loadingServices: "Loading services…",
    noServices: "No services match your search.",
    selectedCount: "{{count}} selected",
    selectedCountOne: "1 selected",
    noneSelected: "None selected yet",
    showAll: "Show all",
    showLess: "Show less",
    intro:
      "Tap a category or search to find services, then check every repair or maintenance item you want on this visit.",
    step1: "Step 1:",
    narrowList: "Narrow the list (optional)",
    clear: "Clear",
    step2Prefix: "Step 2:",
    searchResults: "{{count}} result",
    searchResultsPlural: "{{count}} results",
    servicesSelected: "{{count}} service selected",
    showAllServices: "Show all {{count}} services",
    mostRequested: "Most requested",
    moreServices: "More services",
    noServicesHint:
      "No services match your search. Try a different category or clear the search.",
    quickPick: {
      tuneUp: "Tune-up",
      brakes: "Brakes",
      flatTire: "Flat / tire",
      wheels: "Wheels",
      ebike: "E-bike",
    },
  },
};

const locale = { messages, siteConfig };

export default locale;
