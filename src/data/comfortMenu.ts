export interface ComfortAmenity {
  id: string;
  title: string;
  description: string;
  tag: string;
  icon: string;
  badge: string;
  options: string[];
}

export const COMFORT_AMENITIES: ComfortAmenity[] = [
  {
    id: 'aromatherapy',
    title: 'Aromatherapy',
    description: 'Subtle medical-grade diffuser notes of organic French lavender and sweet bergamot neutralize clinical odors instantly.',
    tag: 'Choice of 3 scents',
    icon: 'air',
    badge: '100% Organic Essential Oils',
    options: ['French Lavender', 'Sweet Bergamot', 'Eucalyptus Peppermint', 'Unscented']
  },
  {
    id: 'blankets',
    title: 'Weighted Blankets',
    description: 'Plush 12-lb and 15-lb deep pressure therapy blankets that ease nervous system tension throughout your session.',
    tag: 'Hypoallergenic cotton',
    icon: 'bedtime',
    badge: 'Deep Pressure Touch',
    options: ['12-lb Plush Weighted Blanket', '15-lb Deep Pressure Blanket', 'Light Warm Linen Throw']
  },
  {
    id: 'the-wand',
    title: 'The Wand® STA',
    description: 'Computerized syringe-free numbing that targets single teeth gently with zero stinging sensation and no drooping lips.',
    tag: 'Needle-free sensation',
    icon: 'magic_button',
    badge: 'Computer-Assisted Milestone',
    options: ['The Wand® STA Computer Numbing', 'Topical Compound Numbing Gel First', 'Nitrous Oxide Supplement']
  },
  {
    id: 'audio',
    title: 'Noise-Cancelling Audio',
    description: 'Bose QuietComfort headphones linked with Spotify podcasts, ocean soundscapes, or ceiling streaming screens (Netflix/Max).',
    tag: 'Zero drill hum',
    icon: 'headphones',
    badge: 'Acoustic Barrier',
    options: ['Bose QC45 + Ocean / Forest Binaural Beats', 'Bose QC45 + Spotify Calming Acoustic', 'Overhead Ceiling Display (Nature/Docu)', 'Your Own Phone Bluetooth']
  },
  {
    id: 'pricing',
    title: 'Transparent Pricing',
    description: 'Itemized printed estimates prior to touching a tooth. No surprise copays, hidden tray fees, or awkward checkout moments.',
    tag: '100% upfront clarity',
    icon: 'price_check',
    badge: 'Written Guarantee',
    options: ['Itemized Printed Estimate Provided First', 'Direct Insurance Pre-Calculation', 'Zero Unexpected Add-on Guarantee']
  }
];

export const TEA_OPTIONS = [
  'Organic Tulsi Chamomile (Caffeine-Free)',
  'Authentic Kashmiri Kahwa with Saffron & Cardamom',
  'Organic Peppermint & Spearmint Infusion',
  'Fresh Tender Coconut Water',
  'Unsweetened Handcrafted Ginger Masala Chai',
  'Pure Alkaline Warm Water with Lemon'
];
