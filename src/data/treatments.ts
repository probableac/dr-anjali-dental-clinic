import { Treatment } from '../types';

export const TREATMENTS: Treatment[] = [
  {
    id: 'preventative-cleaning',
    name: 'Preventative Ultrasonic Care & Airflow Polishing',
    category: 'Preventative',
    turnaround: '45–60 min',
    priceStarting: 1500,
    priceNote: 'or Cashless Corporate TPA',
    description: 'Swiss EMS Airflow biofilm polishing, gentle warm-water ultrasonic scaling, and biological remineralization with zero scraping discomfort.',
    gentleFeature: 'Warm water ultrasonic tips + zero-scrape Swiss technology. DCI sterile protocols.',
    icon: 'dentistry',
    isPopular: true
  },
  {
    id: 'invisalign-aligners',
    name: 'Invisalign® & Clear Orthodontic Aligners',
    category: 'Cosmetic',
    turnaround: '4–9 Mos',
    priceStarting: 65000,
    priceNote: '(₹2,999/mo 0% Bajaj EMI)',
    description: 'Custom digital alignment using iTero 3D scanning. No gooey impression trays, discreet aesthetics, and accelerated bite balancing.',
    gentleFeature: 'Digital infrared scans replace messy impressions.',
    icon: 'align_horizontal_center',
    isPopular: true
  },
  {
    id: 'same-day-crowns',
    name: 'Same-Day CAD/CAM Zirconia Crowns',
    category: 'Restorative',
    turnaround: 'Same-Day (2.5 hrs)',
    priceStarting: 7500,
    priceNote: 'per tooth / insurance eligible',
    description: 'Milled in-studio using precision 3D CAD/CAM robotics. Walk in with a damaged tooth, leave with a durable monolithic zirconia restoration.',
    gentleFeature: 'No temporary crowns, no second visits, computerized Wand numbing.',
    icon: 'precision_manufacturing',
    isPopular: true
  },
  {
    id: 'emergency-pain-relief',
    name: 'Emergency Pain Relief & Rapid Triage',
    category: 'Emergency',
    turnaround: 'Immediate Priority',
    priceStarting: 650,
    priceNote: 'flat triage & medicament',
    description: 'Severe toothache, cracked molar, or lost filling? We reserve immediate daily emergency blocks for immediate pain cessation in Noida.',
    gentleFeature: 'Instant diagnosis, calm soothing room, gentle priority anesthesia.',
    icon: 'emergency',
    priority: true
  },
  {
    id: 'calm-consultation',
    name: 'Tea & Chat Calm Consult with Dr. Anjali',
    category: 'Preventative',
    turnaround: '30 min',
    priceStarting: 500,
    priceNote: 'adjusted against treatment',
    description: 'A 100% judgment-free conversation in our private lounge. Zero scraping, no dental probes, just warm herbal tea and a safe, clear care roadmap.',
    gentleFeature: 'Ideal for those with dental anxiety who have avoided care for years.',
    icon: 'sentiment_calm',
    isPopular: true
  },
  {
    id: 'biocompatible-fillings',
    name: 'Biocompatible Composite Tooth-Colored Restorations',
    category: 'Restorative',
    turnaround: '30–45 min',
    priceStarting: 1800,
    priceNote: 'per surface',
    description: 'BPA-free, shade-matched microhybrid resin bonded with microscopic precision to preserve healthy natural enamel.',
    gentleFeature: 'The Wand STA single-tooth numbing with zero drooping lip feeling.',
    icon: 'health_and_safety'
  },
  {
    id: 'sedation-dentistry',
    name: 'Nitrous Oxide Conscious Relaxation (Laughing Gas)',
    category: 'Sedation',
    turnaround: 'Custom',
    priceStarting: 2500,
    priceNote: 'add-on to any service',
    description: 'Mild inhalation sedation allowing you to relax pleasantly and comfortably through your dental procedure. Completely wears off in 5 minutes.',
    gentleFeature: 'Administered under strict DCI and NABH patient monitoring protocols.',
    icon: 'bedtime',
    isPopular: true
  },
  {
    id: 'porcelain-veneers',
    name: 'Handcrafted E-Max Porcelain Veneers',
    category: 'Cosmetic',
    turnaround: '2 Visits',
    priceStarting: 12000,
    priceNote: 'per tooth',
    description: 'Ultra-thin, micro-layered ceramic facings designed to restore symmetry, brightness, and natural optical depth.',
    gentleFeature: 'Minimally-invasive prep preserving 90%+ natural tooth enamel.',
    icon: 'auto_awesome'
  },
  {
    id: 'gentle-root-canal',
    name: 'Microscopic Single-Sitting Rotary Root Canal (RCT)',
    category: 'Restorative',
    turnaround: '60 min',
    priceStarting: 4500,
    priceNote: 'includes digital apex locators',
    description: 'High-tech 3D apex navigation and sonic irrigation that cleans and seals root canals painlessly with zero surgical trauma.',
    gentleFeature: '99% of patients report zero pain and fell asleep during treatment.',
    icon: 'healing'
  },
  {
    id: 'in-office-whitening',
    name: 'Spa Teeth Whitening (Philips Zoom / Laser)',
    category: 'Cosmetic',
    turnaround: '45 min',
    priceStarting: 8500,
    priceNote: 'includes sensitivity serum',
    description: 'Gentle LED activation with desensitizing potassium nitrate and organic remineralizing paste for 6–8 shades brighter smile.',
    gentleFeature: 'Zero post-treatment zinger sensitivity guaranteed.',
    icon: 'flare'
  },
  {
    id: 'gum-rejuvenation',
    name: 'Biolase Laser Periodontal Therapy',
    category: 'Preventative',
    turnaround: '40 min',
    priceStarting: 3500,
    priceNote: 'per quadrant',
    description: 'Diode laser deep disinfection targeting gum pockets and bleeding gums without scalpels or painful sutures.',
    gentleFeature: 'Promotes rapid tissue regeneration and fresh breath naturally.',
    icon: 'spa'
  },
  {
    id: 'night-guard-bruxism',
    name: 'Custom 3D Night Guards (Bruxism & TMJ)',
    category: 'Preventative',
    turnaround: '2 Days',
    priceStarting: 3800,
    priceNote: 'dual-layer hybrid',
    description: 'Custom-milled oral orthotics engineered to relieve morning jaw tension, clenching, and tooth wear.',
    gentleFeature: 'Soft inner comfort lining with rigid protective outer shell.',
    icon: 'shield'
  },
  {
    id: 'dental-implants',
    name: 'Computer-Guided Biological Dental Implants',
    category: 'Restorative',
    turnaround: '3–4 Mos',
    priceStarting: 28000,
    priceNote: 'Nobel Biocare / Straumann',
    description: '3D CBCT guided surgical placement for permanent, lifelike tooth replacement with lifelong bone integration.',
    gentleFeature: 'Computer-guided keyhole technique for painless quick healing.',
    icon: 'build_circle'
  },
  {
    id: 'wisdom-tooth-removal',
    name: 'Atraumatic Piezosurgical Wisdom Tooth Extraction',
    category: 'Restorative',
    turnaround: '45 min',
    priceStarting: 3500,
    priceNote: 'per tooth / sedation avail',
    description: 'Gentle piezosurgical extraction preserving surrounding bone and nerve architecture with PRF natural platelet healing.',
    gentleFeature: 'Platelet-rich fibrin plugs speed recovery by 50%.',
    icon: 'medical_information'
  },
  {
    id: 'oral-cancer-screening',
    name: 'Velscope® Fluorescence Screening & Mucosal Exam',
    category: 'Preventative',
    turnaround: '10 min',
    priceStarting: 850,
    priceNote: 'complimentary with full checkup',
    description: 'Non-invasive optical wavelength tissue scanning to detect mucosal cellular abnormalities early.',
    gentleFeature: 'Completely painless blue light scan takes 2 minutes.',
    icon: 'biotech'
  },
  {
    id: 'enamel-microabrasion',
    name: 'White Spot & Fluorosis Removal (Icon® Resin)',
    category: 'Cosmetic',
    turnaround: '45 min',
    priceStarting: 2200,
    priceNote: 'drill-free infiltration',
    description: 'Removes developmental fluorosis white spots without drilling away healthy enamel using Icon resin infiltration.',
    gentleFeature: 'Drill-free, shot-free cosmetic color harmonization.',
    icon: 'water_drop'
  },
  {
    id: 'sleep-apnea-therapy',
    name: 'Oral Sleep Appliance for Snoring & Mild OSA',
    category: 'Restorative',
    turnaround: '2 Visits',
    priceStarting: 18000,
    priceNote: 'custom titrated',
    description: 'Compact, whisper-quiet alternative to bulky CPAP machines that keeps airways open comfortably.',
    gentleFeature: 'Custom titrated for comfortable breathing all night.',
    icon: 'air'
  },
  {
    id: 'microbial-salivary-testing',
    name: 'Oral Microbiome Saliva DNA Testing',
    category: 'Preventative',
    turnaround: '10 min',
    priceStarting: 3200,
    priceNote: 'lab results in 4 days',
    description: 'Comprehensive genomic analysis of your oral flora to prevent caries and periodontal decay before it starts.',
    gentleFeature: 'Simple 30-second swish test provides personalized wellness plan.',
    icon: 'science'
  }
];
