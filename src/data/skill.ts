export const COURSES = [
  { id: 1, name: "AWS Cloud Foundation & Solution Architect", criteria: "Pursuing Diploma/Degree" },
  { id: 2, name: "Application Developer Web & Mobile", criteria: "12th, Pursuing Diploma/Degree" },
  { id: 3, name: "Fashion Designer", criteria: "SSLC" },
  { id: 4, name: "Retail Sales Executive", criteria: "SSLC" },
  { id: 5, name: "Data Entry Operator", criteria: "2nd PUC" },
  { id: 6, name: "IT Customer Care Executive", criteria: "SSLC" },
] as const;

export const MINORITY_RELIGIONS = [
  "Muslim",
  "Christian",
  "Jain",
  "Sikh",
  "Buddhist",
  "Parsi",
] as const;

export const CENTRES = [
  "VTU - SDC@Belagavi",
  "VTU - SDC@Talakal",
  "VTU - SDC@Muddenhalli",
  "VTU - NASD@Dandeli",
  "VTU - SDC@Kalaburagi",
  "VTU - SDC@Mysuru",
  "VTU - SDC@Davanagere",
  "VTU - SDC@Bengaluru",
] as const;

export const QUALIFICATIONS = [
  "SSLC",
  "12th / 2nd PUC",
  "ITI",
  "Pursuing Diploma",
  "Diploma Graduated",
  "Pursuing Degree",
  "Degree Graduated",
  "Post Graduate",
] as const;

export const KARNATAKA_DISTRICTS = [
  "Bagalkot",
  "Ballari",
  "Belagavi",
  "Bengaluru Rural",
  "Bengaluru Urban",
  "Bidar",
  "Chamarajanagar",
  "Chikkaballapur",
  "Chikkamagaluru",
  "Chitradurga",
  "Dakshina Kannada",
  "Davanagere",
  "Dharwad",
  "Gadag",
  "Hassan",
  "Haveri",
  "Kalaburagi",
  "Kodagu",
  "Kolar",
  "Koppal",
  "Mandya",
  "Mysuru",
  "Raichur",
  "Ramanagara",
  "Shivamogga",
  "Tumakuru",
  "Udupi",
  "Uttara Kannada",
  "Vijayapura",
  "Yadgir",
  "Vijayanagara"
] as const;

export const DISTRICT_TALUKS: Record<string, string[]> = {
  "Bagalkot": ["Bagalkot", "Jamkhandi", "Mudhol", "Badami", "Bilagi", "Hunagunda", "Ilkal", "Rabkavi Banhatti", "Guledgudda"],
  "Ballari": ["Ballari", "Kurugodu", "Kampli", "Sanduru", "Siraguppa"],
  "Belagavi": ["Belagavi", "Athani", "Bailhongal", "Chikkodi", "Gokak", "Khanapura", "Mudalgi", "Nippani", "Rayabaga", "Savadatti", "Ramadurga", "Kagawada", "Hukkeri", "Kitturu", "Yargatti"],
  "Bengaluru Urban": ["Bengaluru North", "Bengaluru South", "Bengaluru East", "Anekal", "Yelahanka"],
  "Bengaluru Rural": ["Devanahalli", "Doddaballapur", "Nelamangala", "Hoskote"],
  "Bidar": ["Bidar", "Humnabad", "Basavakalyan", "Bhalki", "Aurad"],
  "Chamarajanagar": ["Chamarajanagar", "Gundlupet", "Yelandur", "Kollegal", "Hanur"],
  "Chikkaballapur": ["Chikkaballapur", "Gauribidanur", "Bagepalli", "Sidlaghatta", "Chintamani", "Gudibanda"],
  "Chikkamagaluru": ["Chikkamagaluru", "Kadur", "Tarikere", "Koppa", "Mudigere", "N.R. Pura", "Sringeri"],
  "Chitradurga": ["Chitradurga", "Hiriyur", "Holalkere", "Challakere", "Hosadurga", "Molakalmuru"],
  "Dakshina Kannada": ["Mangaluru", "Puttur", "Bantwal", "Belthangady", "Sullia", "Moodabidri", "Kadaba"],
  "Davanagere": ["Davanagere", "Harihar", "Honnali", "Channagiri", "Jagalur"],
  "Dharwad": ["Dharwad", "Hubballi", "Kundgol", "Navalgund", "Annigeri", "Kalghatgi", "Alnavar"],
  "Gadag": ["Gadag", "Ron", "Shirhatti", "Nargund", "Mundargi", "Gajendragad"],
  "Hassan": ["Hassan", "Arsikere", "Sakleshpur", "Belur", "Alur", "Channarayapatna", "Holenarasipura", "Arkalgud"],
  "Haveri": ["Haveri", "Byadgi", "Hangal", "Savanur", "Shiggaon", "Ranebennur", "Hirekerur", "Rattyal"],
  "Kalaburagi": ["Kalaburagi", "Chittapur", "Sedam", "Shahabad", "Afzalpur", "Jevargi", "Aland", "Yadrami", "Kamalapur"],
  "Kodagu": ["Madikeri", "Virajpet", "Somwarpet"],
  "Kolar": ["Kolar", "Malur", "Bangarapet", "Mulbagal", "Srinivaspur", "KGF"],
  "Koppal": ["Koppal", "Gangavathi", "Kushtagi", "Yelburga", "Kanakagiri", "Karatagi", "Kuknoor"],
  "Mandya": ["Mandya", "Maddur", "Malavalli", "Srirangapatna", "Pandavapura", "Nagamangala", "Krishnarajpet"],
  "Mysuru": ["Mysuru", "Nanjangud", "Hunsur", "Periyapatna", "K.R. Nagara", "Heggadadevana Kote", "T. Narasipura", "Piriyapatna"],
  "Raichur": ["Raichur", "Manvi", "Devadurga", "Lingasugur", "Sindhanur", "Sirwar", "Maski"],
  "Ramanagara": ["Ramanagara", "Kanakapura", "Channapatna", "Magadi"],
  "Shivamogga": ["Shivamogga", "Sagara", "Hosanagara", "Soraba", "Bhadravati", "Shikaripur", "Tirthahalli"],
  "Tumakuru": ["Tumakuru", "Tiptur", "Sira", "Pavagada", "Koratagere", "Kunigal", "Gubbi", "Chikkanayakanahalli", "Madhugiri", "Turuvekere"],
  "Udupi": ["Udupi", "Kundapura", "Karkala", "Hebri", "Brahmavara", "Byndoor"],
  "Uttara Kannada": ["Karwar", "Kumta", "Sirsi", "Haliyal", "Bhatkal", "Ankola", "Dandeli", "Honnavar", "Mundgod", "Siddapur", "Yellapur", "Joida"],
  "Vijayanagara": ["Hospet", "Kampli", "Hagaribommanahalli", "Kottur", "Hadagali", "Harapanahalli"],
  "Vijayapura": ["Vijayapura", "Indi", "Sindgi", "Basavana Bagevadi", "Muddebihal", "Babaleshwar", "Talikoti", "Tikota", "Chadchan"],
  "Yadgir": ["Yadgir", "Shahapur", "Gurmitkal", "Shorapur", "Hunasagi", "Wadgera"]
};

export const WEB_LINKS = CENTRES.map((c) => ({ label: c, href: "https://vtu.ac.in/skill-development-at-vtu/" }));


