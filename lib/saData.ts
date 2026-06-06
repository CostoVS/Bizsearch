export interface Province {
  id: string;
  name: string;
  code: string;
}

export interface CityTown {
  id: string;
  name: string;
  provinceId: string;
  suburbs: string[];
}

export const PROVINCES: Province[] = [
  { id: 'gauteng', name: 'Gauteng', code: 'GP' },
  { id: 'western-cape', name: 'Western Cape', code: 'WC' },
  { id: 'kwazulu-natal', name: 'KwaZulu-Natal', code: 'KZN' },
  { id: 'eastern-cape', name: 'Eastern Cape', code: 'EC' },
  { id: 'free-state', name: 'Free State', code: 'FS' },
  { id: 'limpopo', name: 'Limpopo', code: 'LP' },
  { id: 'mpumalanga', name: 'Mpumalanga', code: 'MP' },
  { id: 'north-west', name: 'North West', code: 'NW' },
  { id: 'northern-cape', name: 'Northern Cape', code: 'NC' },
];

export const CITIES_AND_TOWNS: CityTown[] = [
  // ==========================================
  // GAUTENG PROVINCE (GP)
  // ==========================================
  {
    id: 'johannesburg',
    name: 'Johannesburg',
    provinceId: 'gauteng',
    suburbs: [
      'Sandton', 'Randburg', 'Rosebank', 'Soweto', 'Midrand', 'Melville', 'Parkhurst', 'Fourways', 
      'Bryanston', 'Houghton', 'Northcliff', 'Linden', 'Greenside', 'Parkview', 'Auckland Park', 
      'Roodepoort', 'Kensington', 'Bedfordview', 'Emmarentia', 'Saxonwold', 'Melrose', 'Hyde Park', 
      'Illovo', 'Sunninghill', 'Douglasdale', 'Lonehill', 'Rivonia', 'Woodmead', 'Cyrildene', 
      'Orange Grove', 'Norwood', 'Yeoville', 'Hillbrow', 'Braamfontein', 'Fordsburg', 'Newtown', 
      'Marshalltown', 'Southgate', 'Ormonde', 'Glenvista', 'Mulbarton', 'Mondeor', 'Klipriviersberg',
      'Rosettenville', 'Turffontein', 'Booysens', 'Selby', 'Jeppestown', 'Bruma', 'Malvern', 'Brixton',
      'Orange Farm', 'Vlakfontein', 'Ennerdale', 'Lenasia', 'Eldorado Park', 'Kliptown'
    ],
  },
  {
    id: 'pretoria',
    name: 'Pretoria',
    provinceId: 'gauteng',
    suburbs: [
      'Pretoria CBD', 'Hatfield', 'Brooklyn', 'Arcadia', 'Menlyn', 'Lynnwood', 'Waterkloof', 'Silver Lakes', 
      'Faerie Glen', 'Garsfontein', 'Moreleta Park', 'Sunnyside', 'Muckleneuk', 'Lukasrand', 'Groenkloof', 
      'Nieuw Muckleneuk', 'Maroelana', 'Hazelwood', 'Menlo Park', 'Ashlea Gardens', 'Constantia Park', 
      'Elardus Park', 'Wingate Park', 'Rietvalleirand', 'Colbyn', 'Queenswood', 'Kilner Park', 'Waverley', 
      'Rietfontein', 'Gezina', 'Capital Park', 'Pretoria West', 'Danville', 'Proclamation Hill', 
      'Pretoria North', 'Annlin', 'Sinoville', 'Montana', 'Magalieskruin', 'Wonderboom', 'Olievenhoutbosch',
      'Laudium', 'Erasmia'
    ],
  },
  {
    id: 'centurion',
    name: 'Centurion',
    provinceId: 'gauteng',
    suburbs: [
      'Irene', 'Eldoraigne', 'Wierda Park', 'Rooihuiskraal', 'Lyttelton', 'Clubview', 'Zwartkop', 
      'Pierre van Ryneveld', 'Laudium', 'Valhalla', 'Erasmia', 'Heuwelsig', 'Amberfield', 'The Reeds',
      'Raslouw', 'Stone Ridge', 'Monavoni', 'Copperleaf'
    ],
  },
  {
    id: 'boksburg',
    name: 'Boksburg',
    provinceId: 'gauteng',
    suburbs: ['Sunward Park', 'Beyers Park', 'Impala Park', 'Boksburg South', 'Atlasville', 'Parkdene', 'Bardene', 'Windmill Park', 'Dawn Park', 'Reiger Park'],
  },
  {
    id: 'benoni',
    name: 'Benoni',
    provinceId: 'gauteng',
    suburbs: ['Farrarmere', 'Rynfield', 'Northmead', 'Lakefield', 'Morehill', 'Benoni Western', 'Davon', 'Daveyton', 'Wattville', 'Actonville'],
  },
  {
    id: 'kempton-park',
    name: 'Kempton Park',
    provinceId: 'gauteng',
    suburbs: ['Aston Manor', 'Van Riebeeck Park', 'Norkem Park', 'Glen Marais', 'Birchleigh', 'Allen Grove', 'Terenure', 'Bredell', 'Pomona', 'Elandsfontein'],
  },
  {
    id: 'springs',
    name: 'Springs',
    provinceId: 'gauteng',
    suburbs: ['Selection Park', 'Wright Park', 'Strubenvale', 'Casseldale', 'Geduld', 'Petersfield', 'KwaThema', 'Bakerton', 'Nuffield'],
  },
  {
    id: 'germiston',
    name: 'Germiston',
    provinceId: 'gauteng',
    suburbs: ['Lambton', 'Primrose', 'Elspark', 'Dinwiddie', 'Hazel Park', 'Wadesville', 'Delville', 'Katlehong', 'Tshongweni', 'Sunrise-on-Sea'],
  },
  {
    id: 'alberton',
    name: 'Alberton',
    provinceId: 'gauteng',
    suburbs: ['Brackenhurst', 'Brackendowns', 'Meyersdal', 'New Redruth', 'Alberante', 'Randhart', 'Verwoerdpark', 'Thokoza', 'Alrode', 'Mayberry Park'],
  },
  {
    id: 'edenvale',
    name: 'Edenvale',
    provinceId: 'gauteng',
    suburbs: ['Dunvegan', 'Greenstone Hill', 'Dowerglen', 'Edenglen', 'Marais Steyn Park', 'Illiondale', 'Hurlyvale', 'Modderfontein'],
  },
  {
    id: 'brakpan',
    name: 'Brakpan',
    provinceId: 'gauteng',
    suburbs: ['Dalview', 'Brenthurst', 'Sherwood Gardens', 'Kenleaf', 'Anzac', 'Tsakane', 'Sallies Village', 'Brakpan North'],
  },
  {
    id: 'nigel',
    name: 'Nigel',
    provinceId: 'gauteng',
    suburbs: ['Ferryvale', 'Nigel Central', 'Alra Park', 'Mackenzieville', 'Duduza', 'Charterston', 'Nigel South'],
  },
  {
    id: 'midrand',
    name: 'Midrand',
    provinceId: 'gauteng',
    suburbs: ['Halfway House', 'Kyalami', 'Noordwyk', 'Vorna Valley', 'Carlswald', 'Crowthorne', 'Glen Austin', 'Clayville', 'Waterfall City'],
  },
  {
    id: 'vanderbijlpark',
    name: 'Vanderbijlpark',
    provinceId: 'gauteng',
    suburbs: ['CE 1 to 5', 'SE 1 to 10', 'CW 1 to 6', 'NW 7', 'Bophelong', 'Vanderbijlpark Central', 'Boipatong'],
  },
  {
    id: 'vereeniging',
    name: 'Vereeniging',
    provinceId: 'gauteng',
    suburbs: ['Three Rivers', 'Arcon Park', 'Falcon Ridge', 'Sharpeville', 'Vereeniging Central', 'Bedworth Park', 'Roshnee', 'Sebokeng', 'Evaton'],
  },
  {
    id: 'meyerton',
    name: 'Meyerton',
    provinceId: 'gauteng',
    suburbs: ['Golf Park', 'Meyerton Central', 'Rothdene', 'Henley on Klip', 'Riversdale GP', 'Kookrus', 'Midvaal'],
  },
  {
    id: 'krugersdorp',
    name: 'Krugersdorp',
    provinceId: 'gauteng',
    suburbs: ['Noordheuwel', 'Kenmare', 'Monument', 'Mindalore', 'Krugersdorp West', 'Kagiso', 'Mogale CBD', 'Chamdor', 'Silverfields'],
  },
  {
    id: 'randfontein',
    name: 'Randfontein',
    provinceId: 'gauteng',
    suburbs: ['Greenhills', 'Helikon Park', 'Homelake', 'Randgate', 'Toekomsrus', 'Mohlakeng', 'Aureus'],
  },
  {
    id: 'westonaria',
    name: 'Westonaria',
    provinceId: 'gauteng',
    suburbs: ['Westonaria Central', 'Glenharvie', 'Borwa', 'Bekkersdal', 'Hillshaven', 'Venterspost'],
  },
  {
    id: 'carletonville',
    name: 'Carletonville',
    provinceId: 'gauteng',
    suburbs: ['Carletonville Central', 'Oberholzer', 'Welverdiend', 'Khutsong', 'Westfields', 'Kokosi', 'Greenspark'],
  },
  {
    id: 'heidelberg',
    name: 'Heidelberg',
    provinceId: 'gauteng',
    suburbs: ['Town Centre', 'Overkruin', 'Jordaanpark', 'Rensburg', 'Shalimar Ridge', 'Ratanda', 'Jameson Park'],
  },
  {
    id: 'bronkhorstspruit',
    name: 'Bronkhorstspruit',
    provinceId: 'gauteng',
    suburbs: ['Town Centre', 'Erasmus', 'Cultura Park', 'Rithabiseng', 'Ekangala', 'Zithobeni', 'Val de Grace'],
  },
  {
    id: 'cullinan',
    name: 'Cullinan',
    provinceId: 'gauteng',
    suburbs: ['Town Centre', 'Rayton', 'Refilwe', 'Petra Diamond Mine Area', 'De Wagensdrift'],
  },
  {
    id: 'muldersdrift',
    name: 'Muldersdrift',
    provinceId: 'gauteng',
    suburbs: ['Muldersdrift Central', 'Nooitgedacht', 'Swartkop', 'Kromdraai', 'Zwartkop', 'Lanseria Rural'],
  },
  {
    id: 'soshanguve',
    name: 'Soshanguve',
    provinceId: 'gauteng',
    suburbs: ['Soshanguve East', 'Block TT', 'Block H', 'Block F', 'Block K', 'Block BB', 'Block CC', 'Soshanguve South'],
  },
  {
    id: 'mamelodi',
    name: 'Mamelodi',
    provinceId: 'gauteng',
    suburbs: ['Mamelodi East', 'Mamelodi West', 'Nellmapius', 'Mahube Valley', 'Denlyn Area', 'Stanza Bopape'],
  },
  {
    id: 'tembisa',
    name: 'Tembisa',
    provinceId: 'gauteng',
    suburbs: ['Clayville', 'Oakmoor', 'Kempton West Fringe', 'Winnie Mandela', 'Tembisa Central', 'Ecaleni', 'Khatlampeng'],
  },
  {
    id: 'hammanskraal',
    name: 'Hammanskraal',
    provinceId: 'gauteng',
    suburbs: ['Temba', 'Babelegi Shopping Area', 'Carousel View', 'Kekana Gardens', 'Hammanskraal West'],
  },
  {
    id: 'devon',
    name: 'Devon',
    provinceId: 'gauteng',
    suburbs: ['Devon Central', 'Impumelelo', 'Devon Agricultural Land'],
  },
  {
    id: 'lanseria',
    name: 'Lanseria',
    provinceId: 'gauteng',
    suburbs: ['Lanseria Airport Area', 'Blair Atholl', 'Monaghan Farm'],
  },

  // ==========================================
  // WESTERN CAPE PROVINCE (WC)
  // ==========================================
  {
    id: 'cape-town',
    name: 'Cape Town',
    provinceId: 'western-cape',
    suburbs: [
      'City Bowl', 'Gardens', 'Oranjezicht', 'Vredehoek', 'Tamboerskloof', 'Camps Bay', 'Sea Point', 
      'Green Point', 'Claremont', 'Rondebosch', 'Somerset West', 'Hout Bay', 
      'Milnerton', 'Simon\'s Town', 'Clifton', 'Bantry Bay', 'Fresnaye', 'Mouille Point', 
      'Three Anchor Bay', 'Woodstock', 'Salt River', 'Observatory', 'Mowbray', 'Rosebank', 'Newlands', 
      'Kenilworth', 'Wynberg', 'Plumstead', 'Diep River', 'Bergvliet', 'Meadowridge', 'Tokai', 
      'Constantia', 'Bishopscourt', 'Llandudno', 'Noordhoek', 'Kommetjie', 'Scarborough', 'Fish Hoek', 
      'Kalk Bay', 'St James', 'Muizenberg', 'Lakeside', 'Table View', 'Bloubergstrand', 'Parklands', 
      'Sunningdale', 'Melkbosstrand', 'Parow', 'Goodwood', 'Elsies River', 'Athlone', 'Mitchells Plain', 
      'Khayelitsha', 'Gugulethu', 'Langa', 'Nyanga', 'Blue Downs', 'Eerste River', 'Ottery', 'Grassy Park'
    ],
  },
  {
    id: 'bellville',
    name: 'Bellville',
    provinceId: 'western-cape',
    suburbs: ['Welgemoed', 'Boston', 'Kenridge Bellville', 'Oakdale', 'Loevenstein', 'Chrismar', 'Bellville West', 'Stikland', 'Bellville South'],
  },
  {
    id: 'durbanville',
    name: 'Durbanville',
    provinceId: 'western-cape',
    suburbs: ['Aurora', 'Eversdal', 'Sonstraal', 'Kenridge Durbanville', 'D\'Urbanvale', 'Vierlanden', 'Pinehurst', 'Graanendal'],
  },
  {
    id: 'brackenfell',
    name: 'Brackenfell',
    provinceId: 'western-cape',
    suburbs: ['Vredekloof', 'Protea Heights', 'Brackenfell Central', 'Marlborough Park', 'Ruwari', 'Ferndale WC'],
  },
  {
    id: 'kraaifontein',
    name: 'Kraaifontein',
    provinceId: 'western-cape',
    suburbs: ['Langeberg Ridge', 'Peerless Park', 'Kraaifontein CBD', 'Belmont Park', 'Scottsdene', 'Wallacedene'],
  },
  {
    id: 'kuils-river',
    name: 'Kuils River',
    provinceId: 'western-cape',
    suburbs: ['Stellenbosch Arterial Area', 'Soneike', 'Haasendal', 'Zevenwacht', 'Brandwood', 'Highbury'],
  },
  {
    id: 'somerset-west',
    name: 'Somerset West',
    provinceId: 'western-cape',
    suburbs: ['Heldervue', 'Spanish Farm', 'Erinvale', 'Somerset West CBD', 'Bridge Water', 'Bakkershoogte'],
  },
  {
    id: 'strand',
    name: 'Strand',
    provinceId: 'western-cape',
    suburbs: ['Goedehoop', 'Greenways', 'Strand Beachfront', 'Onverwacht', 'Strand Central', 'Lwandle'],
  },
  {
    id: 'gordons-bay',
    name: 'Gordon\'s Bay',
    provinceId: 'western-cape',
    suburbs: ['Anchor Bay', 'Harbour Island', 'Mountainside', 'Gordon\'s Bay Central', 'Temperance Town'],
  },
  {
    id: 'stellenbosch',
    name: 'Stellenbosch',
    provinceId: 'western-cape',
    suburbs: [
      'Town Centre', 'Mostertsdrift', 'Idas Valley', 'Klapmuts', 'Technopark', 'Brandwacht', 
      'Paradyskloof', 'Die Boord', 'Welgevonden', 'Kayamandi', 'Jamestown', 'Plankenbrug'
    ],
  },
  {
    id: 'paarl',
    name: 'Paarl',
    provinceId: 'western-cape',
    suburbs: ['Paarl Central', 'Val de Vie Estate', 'Northern Paarl', 'Courtrai', 'Groenheuwel', 'Dal Josaphat', 'Lemoenkloof', 'Mbekweni'],
  },
  {
    id: 'wellington',
    name: 'Wellington',
    provinceId: 'western-cape',
    suburbs: ['Town Centre', 'Bovlei', 'Bainskloof Road Area', 'Newton', 'Berg-en-Dal'],
  },
  {
    id: 'franschhoek',
    name: 'Franschhoek',
    provinceId: 'western-cape',
    suburbs: ['Town Centre', 'Franschhoek Park', 'Robertsvlei', 'Groendal', 'La Motte'],
  },
  {
    id: 'george',
    name: 'George',
    provinceId: 'western-cape',
    suburbs: ['Heatherlands', 'Blanco', 'Thembalethu', 'Pacaltsdorp', 'Denneoord', 'Kingswood Golf Estate', 'George CBD', 'Loerie Park', 'Herolds Bay'],
  },
  {
    id: 'knysna',
    name: 'Knysna',
    provinceId: 'western-cape',
    suburbs: ['Knysna Waterfront', 'The Heads', 'Leisure Isle', 'Brenton on Sea', 'Belvidere', 'Knysna Heights', 'Hornlee', 'Rheenendal'],
  },
  {
    id: 'mossel-bay',
    name: 'Mossel Bay',
    provinceId: 'western-cape',
    suburbs: ['Hartenbos', 'Diaz Strand', 'Da Nova', 'Linkside', 'Heiderand', 'Mossel Bay Town', 'Dana Bay', 'Tergniet', 'Groot Brak River', 'Klein Brak River'],
  },
  {
    id: 'plettenberg-bay',
    name: 'Plettenberg Bay',
    provinceId: 'western-cape',
    suburbs: ['Beacon Isle', 'Robberg Side', 'Whale Rock', 'Keurboomstrand', 'River Club', 'Poortjies Central', 'Natures Valley', 'Wittedrift'],
  },
  {
    id: 'wilderness',
    name: 'Wilderness',
    provinceId: 'western-cape',
    suburbs: ['Wilderness Beach', 'Wilderness Heights', 'Kleinkrantz', 'Wilderness East'],
  },
  {
    id: 'sedgefield',
    name: 'Sedgefield',
    provinceId: 'western-cape',
    suburbs: ['Myoli Beach', 'Sedgefield Town', 'Cola Beach', 'Groenvlei', 'Smutsville'],
  },
  {
    id: 'hermanus',
    name: 'Hermanus',
    provinceId: 'western-cape',
    suburbs: [
      'Westcliff', 'Voelklip', 'Sandbaai', 'Onrus', 'Eastcliff', 'Fernkloof', 'Mount Pleasant', 
      'Zwelihle', 'Hawston', 'Fisherhaven', 'Hemel-en-Aarde'
    ],
  },
  {
    id: 'kleinmond',
    name: 'Kleinmond',
    provinceId: 'western-cape',
    suburbs: ['Kleinmond Town', 'Heuningklip', 'Palmiet', 'Betty\'s Bay', 'Pringle Bay', 'Rooiels'],
  },
  {
    id: 'saldanha',
    name: 'Saldanha',
    provinceId: 'western-cape',
    suburbs: ['Saldanha Heights', 'Diazville', 'Parklands Saldanha', 'Bluewater Bay Saldanha'],
  },
  {
    id: 'langebaan',
    name: 'Langebaan',
    provinceId: 'western-cape',
    suburbs: ['Country Club Langebaan', 'Mykonos Langebaan', 'Paradise Beach Langebaan', 'Langebaan Town', 'Mykonos'],
  },
  {
    id: 'vredenburg',
    name: 'Vredenburg',
    provinceId: 'western-cape',
    suburbs: ['Louwville', 'Witteklip', 'Vredenburg Central'],
  },
  {
    id: 'paternoster',
    name: 'Paternoster',
    provinceId: 'western-cape',
    suburbs: ['Paternoster Village', 'Bekbaai', 'Mosselbank'],
  },
  {
    id: 'st-helena-bay',
    name: 'St Helena Bay',
    provinceId: 'western-cape',
    suburbs: ['Britannia Bay', 'Shelley Point', 'Sandy Point', 'St Helena Village', 'Jacobsbaai'],
  },
  {
    id: 'velddrif',
    name: 'Velddrif',
    provinceId: 'western-cape',
    suburbs: ['Laaiplek', 'Port Owen', 'Velddrif Town', 'Noordhoek Velddrif', 'Dwarskersbos'],
  },
  {
    id: 'darling',
    name: 'Darling',
    provinceId: 'western-cape',
    suburbs: ['Darling Town', 'Green Wattle', 'Darling North'],
  },
  {
    id: 'yzerfontein',
    name: 'Yzerfontein',
    provinceId: 'western-cape',
    suburbs: ['Yzerfontein Town', 'Pearl Bay'],
  },
  {
    id: 'oudtshoorn',
    name: 'Oudtshoorn',
    provinceId: 'western-cape',
    suburbs: ['Oudtshoorn Central', 'Wesbank', 'Toekomsrus', 'Bridgton', 'Dysselsdorp'],
  },
  {
    id: 'beaufort-west',
    name: 'Beaufort West',
    provinceId: 'western-cape',
    suburbs: ['Beaufort West Central', 'Hillside', 'Rustdene', 'Mandlenkosi', 'Nelspoort', 'Merweville'],
  },
  {
    id: 'ceres',
    name: 'Ceres',
    provinceId: 'western-cape',
    suburbs: ['Ceres Town', 'Bella Vista', 'Nduli', 'Prince Alfred Hamlet', 'Op-die-Berg'],
  },
  {
    id: 'worcester',
    name: 'Worcester',
    provinceId: 'western-cape',
    suburbs: ['Worcester Central', 'Langerug', 'Paglande', 'Brandwacht Worcester', 'Zwelethemba', 'De Doorns', 'Touws River'],
  },
  {
    id: 'robertson',
    name: 'Robertson',
    provinceId: 'western-cape',
    suburbs: ['Robertson Town', 'Nkqubela', 'Moreson', 'Ashton', 'Bonnievale', 'McGregor'],
  },
  {
    id: 'montagu',
    name: 'Montagu',
    provinceId: 'western-cape',
    suburbs: ['Montagu West', 'Montagu Central', 'Ashbury'],
  },
  {
    id: 'prince-albert',
    name: 'Prince Albert',
    provinceId: 'western-cape',
    suburbs: ['Prince Albert Town', 'Noordeinde', 'Leeu-Gamka', 'Klaarstroom'],
  },
  {
    id: 'swellendam',
    name: 'Swellendam',
    provinceId: 'western-cape',
    suburbs: ['Swellendam Town', 'Buffeljagsrivier', 'Suurbraak', 'Barrydale', 'Malgas', 'Infanta'],
  },
  {
    id: 'gansbaai',
    name: 'Gansbaai',
    provinceId: 'western-cape',
    suburbs: ['Gansbaai Town', 'De Kelders', 'Perlemoenbaai', 'Birkenhead', 'Kleinbaai', 'Franskraal', 'Pearly Beach', 'Baardskeerdersbos'],
  },
  {
    id: 'bredasdorp',
    name: 'Bredasdorp',
    provinceId: 'western-cape',
    suburbs: ['Bredasdorp Town', 'Napier Town', 'Elim Village'],
  },
  {
    id: 'struisbaai',
    name: 'Struisbaai',
    provinceId: 'western-cape',
    suburbs: ['Struisbaai Town', 'L\'Agulhas', 'Struisbaai North'],
  },
  {
    id: 'arniston',
    name: 'Arniston',
    provinceId: 'western-cape',
    suburbs: ['Waenhuiskrans', 'Arniston Village', 'Arniston Coastal Precinct'],
  },
  {
    id: 'caledon',
    name: 'Caledon',
    provinceId: 'western-cape',
    suburbs: ['Caledon Town', 'Myddleton', 'Tesselaarsdal', 'Botriver', 'Grabouw', 'Villiersdorp'],
  },
  {
    id: 'greyton',
    name: 'Greyton',
    provinceId: 'western-cape',
    suburbs: ['Greyton Village', 'Genadendal Village', 'Bosmanskloof'],
  },
  {
    id: 'malmesbury',
    name: 'Malmesbury',
    provinceId: 'western-cape',
    suburbs: ['Malmesbury Town', 'Riebeek Kasteel', 'Riebeek West', 'Abbotsdale', 'Darling'],
  },
  {
    id: 'moorreesburg',
    name: 'Moorreesburg',
    provinceId: 'western-cape',
    suburbs: ['Moorreesburg Town', 'Moorreesburg Rural', 'Koringberg'],
  },
  {
    id: 'clanwilliam',
    name: 'Clanwilliam',
    provinceId: 'western-cape',
    suburbs: ['Clanwilliam Town', 'Lambert\'s Bay', 'Graafwater', 'Leipoldtville', 'Elands Bay', 'Wupperthal'],
  },
  {
    id: 'citrusdal',
    name: 'Citrusdal',
    provinceId: 'western-cape',
    suburbs: ['Citrusdal Town', 'Cederberg Rural'],
  },
  {
    id: 'vredendal',
    name: 'Vredendal',
    provinceId: 'western-cape',
    suburbs: ['Vredendal Town', 'Klawer', 'Lutzville', 'Vanrhynsdorp', 'Bitterfontein', 'Nuwerus', 'Strandfontein', 'Doringbaai', 'Ebenhaeser'],
  },
  {
    id: 'riversdale',
    name: 'Riversdale',
    provinceId: 'western-cape',
    suburbs: ['Riversdale Town', 'Albertinia Town', 'Still Bay (Stilbaai)', 'Gouritsmond', 'Heidelberg WC', 'Witsand'],
  },
  {
    id: 'ladismith',
    name: 'Ladismith',
    provinceId: 'western-cape',
    suburbs: ['Ladismith Town', 'Zoar', 'Amalienstein', 'Vanwyksdorp'],
  },
  {
    id: 'calitzdorp',
    name: 'Calitzdorp',
    provinceId: 'western-cape',
    suburbs: ['Calitzdorp Town', 'Calitzdorp Spa', 'Gamkapoort'],
  },
  {
    id: 'laingsburg',
    name: 'Laingsburg',
    provinceId: 'western-cape',
    suburbs: ['Laingsburg Town', 'Matjiesfontein'],
  },
  {
    id: 'piketberg',
    name: 'Piketberg',
    provinceId: 'western-cape',
    suburbs: ['Piketberg Town', 'Aurora WC', 'Redelinghuys'],
  },
  {
    id: 'porterville',
    name: 'Porterville',
    provinceId: 'western-cape',
    suburbs: ['Porterville Town', 'Dasklip Pass Area'],
  },
  {
    id: 'hopefield',
    name: 'Hopefield',
    provinceId: 'western-cape',
    suburbs: ['Hopefield Town', 'Hopefield Rural'],
  },

  // ==========================================
  // KWAZULU-NATAL PROVINCE (KZN)
  // ==========================================
  {
    id: 'durban',
    name: 'Durban / eThekwini',
    provinceId: 'kwazulu-natal',
    suburbs: [
      'Umhlanga Rocks', 'Umhlanga Ridge', 'Durban North', 'La Lucia', 'Berea', 'Glenwood', 'Morningside', 'Westville', 'Pinetown', 
      'Chatsworth', 'Amanzimtoti', 'Ballito', 'Phoenix', 'Inanda', 'Ntuzuma', 'KwaMashu', 
      'Umlazi', 'Mobeni', 'Jacobs', 'Bluff', 'Yellowwood Park', 'Queensburgh', 'Hillcrest', 
      'Kloof', 'Gillitts', 'Assagay', 'Bothas Hill', 'Waterfall', 'New Germany', 'Reservoir Hills', 
      'Sydenham', 'Overport', 'Musgrave', 'Windermere', 'Greyville', 'Point', 'Warner Beach', 
      'Mount Edgecombe', 'Salt Rock', 'Chaka\'s Rock', 'Shaka\'s Head', 'Tongaat', 'Verulam', 'Camperdown',
      'Cato Ridge', 'Hammarsdale', 'Kingsburgh', 'Umkomaas', 'Klaarwater'
    ],
  },
  {
    id: 'pietermaritzburg',
    name: 'Pietermaritzburg',
    provinceId: 'kwazulu-natal',
    suburbs: [
      'Athlone', 'Hilton', 'Howick', 'Scottsville', 'Pelham', 'Chase Valley', 'Montrose', 
      'Wembley', 'Hayfields', 'Cleland', 'Lincoln Meade', 'Imbali', 'Edendale', 'Woodlands', 'Mooi River',
      'Nottingham Road', 'Rosetta'
    ],
  },
  {
    id: 'howick',
    name: 'Howick',
    provinceId: 'kwazulu-natal',
    suburbs: ['Howick Central', 'Merrivale', 'Howick West', 'Mpophomeni', 'Midmar Dam Area', 'Tweedie'],
  },
  {
    id: 'richards-bay',
    name: 'Richards Bay',
    provinceId: 'kwazulu-natal',
    suburbs: ['Meerensee', 'Arboretum', 'Veldenvlei', 'Birdswood', 'Brackenham', 'Richards Bay CBD', 'Kwambonambi'],
  },
  {
    id: 'empangeni',
    name: 'Empangeni',
    provinceId: 'kwazulu-natal',
    suburbs: ['Empangeni Central', 'Ngwelezane', 'Esikhawini', 'Empangeni Hills', 'Kuleka Estate', 'Felixton'],
  },
  {
    id: 'margate',
    name: 'Margate',
    provinceId: 'kwazulu-natal',
    suburbs: ['Margate Beach', 'Shelly Beach', 'Uvongo', 'Ramsgate', 'Manaba Beach', 'Southbroom', 'Marina Beach', 'San Lameer'],
  },
  {
    id: 'port-shepstone',
    name: 'Port Shepstone',
    provinceId: 'kwazulu-natal',
    suburbs: ['Port Shepstone Central', 'Hibberdene', 'Southbroom', 'Port Edward KZN', 'San Lameer', 'Albersville', 'Umtentweni', 'Mtwalume'],
  },
  {
    id: 'newcastle',
    name: 'Newcastle',
    provinceId: 'kwazulu-natal',
    suburbs: ['Newcastle Central', 'Amajuba Park', 'Hutten Heights', 'Pioneer Park', 'Signal Hill', 'Madadeni', 'Osizweni', 'Schuinshoogte'],
  },
  {
    id: 'ladysmith',
    name: 'Ladysmith',
    provinceId: 'kwazulu-natal',
    suburbs: ['Ladysmith Central', 'Limit Hill', 'Danskraal', 'Steadville', 'Ezakheni', 'Bergville', 'Winterton', 'Colenso'],
  },
  {
    id: 'dundee',
    name: 'Dundee',
    provinceId: 'kwazulu-natal',
    suburbs: ['Dundee Central', 'Sibongile Town', 'Glencoe Central', 'Hattingspruit', 'Waschbank', 'Pomeroy', 'Nqutu'],
  },
  {
    id: 'vryheid',
    name: 'Vryheid',
    provinceId: 'kwazulu-natal',
    suburbs: ['Town Centre', 'Bhekuzulu', 'Lakeside', 'Vryheid East', 'Paulpietersburg Corner', 'Utrecht', 'Dannhauser'],
  },
  {
    id: 'kokstad',
    name: 'Kokstad',
    provinceId: 'kwazulu-natal',
    suburbs: ['Kokstad Town', 'Shayamoya', 'Bhongweni', 'Franklin', 'Matatiele Border Area', 'Swartberg'],
  },
  {
    id: 'ixopo',
    name: 'Ixopo',
    provinceId: 'kwazulu-natal',
    suburbs: ['Ixopo Town', 'Fairview', 'Stuartstown', 'Donnybrook', 'Creighton', 'Bulwer'],
  },
  {
    id: 'richmond-kzn',
    name: 'Richmond (KZN)',
    provinceId: 'kwazulu-natal',
    suburbs: ['Richmond Town', 'Patheni', 'Richmond West', 'Byrnetown'],
  },
  {
    id: 'scottburgh',
    name: 'Scottburgh',
    provinceId: 'kwazulu-natal',
    suburbs: ['Scottburgh Central', 'Park Rynie', 'Pennington', 'Umzinto', 'Clansthal', 'Ifafa Beach', 'Sezela'],
  },
  {
    id: 'stanger',
    name: 'KwaDukuza (Stanger)',
    provinceId: 'kwazulu-natal',
    suburbs: ['Stanger Central', 'Shayamoya Stanger', 'Glenhills', 'Groutville', 'Blythedale Beach', 'Zinkwazi Beach', 'Shakas Kraal', 'Umhlali', 'Mandeni', 'Tugela Mouth'],
  },
  {
    id: 'eshowe',
    name: 'Eshowe',
    provinceId: 'kwazulu-natal',
    suburbs: ['Eshowe Town', 'King Dinizulu', 'Gezinsila', 'Gingindlovu Village', 'Melmoth', 'Nkandla'],
  },
  {
    id: 'mtunzini',
    name: 'Mtunzini',
    provinceId: 'kwazulu-natal',
    suburbs: ['Mtunzini Town', 'Zini Estate', 'Gingindlovu'],
  },
  {
    id: 'ulundi',
    name: 'Ulundi',
    provinceId: 'kwazulu-natal',
    suburbs: ['Ulundi Town', 'B-North', 'Unit A', 'Mpungamhlophe', 'Mahlabathini', 'Nongoma', 'Babanango'],
  },
  {
    id: 'greytown',
    name: 'Greytown',
    provinceId: 'kwazulu-natal',
    suburbs: ['Greytown Town', 'Enhlalakahle', 'Kranskop Village', 'Muden', 'Maphumulo'],
  },
  {
    id: 'underberg',
    name: 'Underberg',
    provinceId: 'kwazulu-natal',
    suburbs: ['Underberg Village', 'Himeville', 'Bushman\'s Nek', 'Drakensberg Gardens', 'Coleford', 'Boston KZN'],
  },
  {
    id: 'port-edward',
    name: 'Port Edward',
    provinceId: 'kwazulu-natal',
    suburbs: ['Port Edward Town', 'Munster', 'Leisure Bay', 'Glenmore Beach'],
  },
  {
    id: 'mtubatuba',
    name: 'Mtubatuba',
    provinceId: 'kwazulu-natal',
    suburbs: ['Mtubatuba Town', 'St Lucia Village', 'Riverview', 'Dukuduku Forest Area', 'Hluhluwe', 'Sodwana Bay'],
  },
  {
    id: 'estcourt',
    name: 'Estcourt',
    provinceId: 'kwazulu-natal',
    suburbs: ['Estcourt Central', 'Wembezi', 'Colita', 'Trenchtown', 'Weenen'],
  },
  {
    id: 'pongola',
    name: 'uPhongolo (Pongola)',
    provinceId: 'kwazulu-natal',
    suburbs: ['Pongola Central', 'Ncotshane', 'Pongolapoort'],
  },
  {
    id: 'paulpietersburg',
    name: 'Paulpietersburg',
    provinceId: 'kwazulu-natal',
    suburbs: ['Paulpietersburg Central', 'Dumbe', 'Bilanyoni'],
  },
  {
    id: 'harding',
    name: 'Harding',
    provinceId: 'kwazulu-natal',
    suburbs: ['Harding Central', 'Izingolweni'],
  },
  {
    id: 'manguzi',
    name: 'Manguzi',
    provinceId: 'kwazulu-natal',
    suburbs: ['Manguzi Central', 'Kosi Bay', 'Kwangwanase', 'Mbazwana'],
  },
  {
    id: 'jozini',
    name: 'Jozini',
    provinceId: 'kwazulu-natal',
    suburbs: ['Jozini Town', 'Jozini Dam', 'Ingwavuma'],
  },

  // ==========================================
  // EASTERN CAPE PROVINCE (EC)
  // ==========================================
  {
    id: 'gqeberha',
    name: 'Gqeberha (Port Elizabeth)',
    provinceId: 'eastern-cape',
    suburbs: [
      'Summerstrand', 'Walmer', 'Mill Park', 'Newton Park', 'Humewood', 'Lorraine', 'Kabega Park', 
      'Mount Croix', 'Parsonsvlei', 'Cotswold', 'Richmond Hill', 'Gqeberha CBD', 'Korsten', 'Motherwell', 
      'Ibhayi', 'Bluewater Bay', 'Lovemore Heights', 'Sherwood', 'Charlo', 'Mount Pleasant', 'Uitenhage (Kariega)',
      'Alicedale', 'Alexandria', 'Patensie', 'Loerie'
    ],
  },
  {
    id: 'east-london',
    name: 'East London',
    provinceId: 'eastern-cape',
    suburbs: [
      'Beacon Bay', 'Nahoon', 'Vincent', 'Gonubie', 'Amalinda', 'Berea', 'Selborne', 'Dorchester Heights', 
      'Abbotsford', 'Cambridge', 'Stirling', 'Quigney', 'West Bank', 'Mdantsane', 'Kidds Beach', 'Berlin', 'Karei'
    ],
  },
  {
    id: 'bisho',
    name: 'Bhisho',
    provinceId: 'eastern-cape',
    suburbs: ['Bhisho Central', 'Tyutyu', 'Bhisho View', 'Zwelitsha'],
  },
  {
    id: 'king-williams-town',
    name: 'King William\'s Town',
    provinceId: 'eastern-cape',
    suburbs: ['KWT Central', 'Schornville', 'Breidbach', 'Ginsberg', 'Sweetwaters', 'Keiskammahoek', 'Debe Nek'],
  },
  {
    id: 'jeffreys-bay',
    name: 'Jeffreys Bay',
    provinceId: 'eastern-cape',
    suburbs: ['Wavecrest', 'Kabeljous', 'Aston Bay', 'Paradise Beach', 'Jeffreys Bay Central', 'Gamtoos Mouth'],
  },
  {
    id: 'st-francis-bay',
    name: 'St Francis Bay',
    provinceId: 'eastern-cape',
    suburbs: ['Cape St Francis', 'Santareme', 'St Francis Port', 'St Francis Canals', 'Oyster Bay'],
  },
  {
    id: 'humansdorp',
    name: 'Humansdorp',
    provinceId: 'eastern-cape',
    suburbs: ['Humansdorp Central', 'Kruisfontein', 'Kwanzomgile', 'Boskloof', 'Kareedouw', 'Joubertina', 'Louterwater'],
  },
  {
    id: 'mthatha',
    name: 'Mthatha',
    provinceId: 'eastern-cape',
    suburbs: ['Fortgale', 'Southernwood', 'Northcrest', 'Mthatha Central', 'Ngangelizwe', 'Libode', 'Ngqeleni', 'Mqanduli'],
  },
  {
    id: 'port-st-johns',
    name: 'Port St Johns',
    provinceId: 'eastern-cape',
    suburbs: ['Port St Johns Town', 'First Beach', 'Second Beach', 'Agate Terrace'],
  },
  {
    id: 'coffee-bay',
    name: 'Coffee Bay',
    provinceId: 'eastern-cape',
    suburbs: ['Coffee Bay Village', 'Hole in the Wall', 'Mapuzi'],
  },
  {
    id: 'makhanda',
    name: 'Makhanda (Grahamstown)',
    provinceId: 'eastern-cape',
    suburbs: ['Grahamstown Central', 'Kingswood', 'Somerset Heights', 'West Hill', 'Rhodes Hill', 'Joza', 'Fingo Village', 'Riebeek East', 'Alicedale'],
  },
  {
    id: 'graaff-reinet',
    name: 'Graaff-Reinet',
    provinceId: 'eastern-cape',
    suburbs: ['Graaff-Reinet Town', 'Umasizakhe', 'Kroonvale', 'Adendorp', 'Horseshoe', 'Nieu-Bethesda', 'Aberdeen'],
  },
  {
    id: 'queenstown',
    name: 'Queenstown (Komani)',
    provinceId: 'eastern-cape',
    suburbs: ['Komani Central', 'Mlungisi', 'Ezibeleni', 'Westbourne', 'Sunnyside', 'Bergsig', 'Cala', 'Lady Frere', 'Sterkstroom', 'Tarkastad', 'Whittlesea'],
  },
  {
    id: 'aliwal-north',
    name: 'Aliwal North',
    provinceId: 'eastern-cape',
    suburbs: ['Aliwal North Town', 'Dukathole', 'Joe Gqabi', 'Lady Grey', 'Barkly East', 'Burgersdorp', 'Jamestown', 'Sterkspruit'],
  },
  {
    id: 'port-alfred',
    name: 'Port Alfred',
    provinceId: 'eastern-cape',
    suburbs: ['Port Alfred Town', 'East Beach', 'West Beach', 'Royal Alfred Marina', 'Bathurst', 'Alexandria'],
  },
  {
    id: 'kenton-on-sea',
    name: 'Kenton-on-Sea',
    provinceId: 'eastern-cape',
    suburbs: ['Kenton Central', 'Bushmans River Mouth', 'Merry Hill', 'Cannon Rocks', 'Boknes'],
  },
  {
    id: 'somerset-east',
    name: 'Somerset East',
    provinceId: 'eastern-cape',
    suburbs: ['Somerset East Town', 'Clevedon', 'Francis', 'Westview', 'Cookhouse', 'Pearston', 'Bedford'],
  },
  {
    id: 'stutterheim',
    name: 'Stutterheim',
    provinceId: 'eastern-cape',
    suburbs: ['Stutterheim Town', 'Amabele', 'Kubusi', 'Cathcart Central', 'Tsomo', 'Komga'],
  },
  {
    id: 'fort-beaufort',
    name: 'Fort Beaufort',
    provinceId: 'eastern-cape',
    suburbs: ['Fort Beaufort Town', 'Healdtown', 'Bhofolo', 'Alice Town', 'Lovedale', 'Seymour', 'Hogsback'],
  },
  {
    id: 'kirkwood',
    name: 'Kirkwood',
    provinceId: 'eastern-cape',
    suburbs: ['Kirkwood Town', 'Bontrug', 'Moses Mabida', 'Addo Village', 'Patensie Town', 'Sunland'],
  },
  {
    id: 'cradock',
    name: 'Cradock',
    provinceId: 'eastern-cape',
    suburbs: ['Cradock Central', 'Lingelihle', 'Michausdal', 'Cradock Heights', 'Middelburg EC', 'Hofmeyr'],
  },
  {
    id: 'butterworth',
    name: 'Butterworth',
    provinceId: 'eastern-cape',
    suburbs: ['Butterworth Central', 'Ibika', 'Msobomvu', 'Mthente', 'Dutywa Central', 'Centane', 'Nqamakwe'],
  },
  {
    id: 'willowmore',
    name: 'Willowmore',
    provinceId: 'eastern-cape',
    suburbs: ['Willowmore Town', 'Steytlerville', 'Klipplaat'],
  },
  {
    id: 'lusikisiki',
    name: 'Lusikisiki',
    provinceId: 'eastern-cape',
    suburbs: ['Lusikisiki Central', 'Flagstaff', 'Bizana', 'Ntabankulu'],
  },
  {
    id: 'maclear',
    name: 'Maclear',
    provinceId: 'eastern-cape',
    suburbs: ['Maclear Town', 'Ugie', 'Mount Fletcher', 'Rhodes'],
  },
  {
    id: 'mount-frere',
    name: 'Mount Frere',
    provinceId: 'eastern-cape',
    suburbs: ['Mount Frere Central', 'Mount Ayliff', 'Tabankulu', 'Cedarville'],
  },
  {
    id: 'ngcobo',
    name: 'Ngcobo (Engcobo)',
    provinceId: 'eastern-cape',
    suburbs: ['Ngcobo Central', 'Cofimvaba', 'Tsomo'],
  },

  // ==========================================
  // FREE STATE PROVINCE (FS)
  // ==========================================
  {
    id: 'bloemfontein',
    name: 'Bloemfontein',
    provinceId: 'free-state',
    suburbs: [
      'Westdene', 'Brandwag', 'Langenhovenpark', 'Bayswater', 'Dan Pienaar', 'Fichardtpark', 'Ehrlichpark', 
      'Universitas', 'Helicon Heights', 'Wild Olive', 'Pentagon Park', 'Noordhoek', 'Hilton', 'Heidedal', 
      'Mangaung', 'Ehrlich Park', 'Phahameng', 'Botshabelo', 'Thaba Nchu', 'Soutpan', 'Dealesville'
    ],
  },
  {
    id: 'welkom',
    name: 'Welkom',
    provinceId: 'free-state',
    suburbs: ['Riebeeckstad', 'Bedelia', 'Dagbreek', 'Naudeville', 'Welkom Central', 'St Helena', 'Bronville', 'Hennenman', 'Ventersburg', 'Virginia', 'Odendaalsrus', 'Allanridge'],
  },
  {
    id: 'kroonstad',
    name: 'Kroonstad',
    provinceId: 'free-state',
    suburbs: ['Kroonstad Central', 'Panorama Kroonstad', 'Maokeng', 'Tuinhof', 'Morewag', 'Steynsrus'],
  },
  {
    id: 'sasolburg',
    name: 'Sasolburg',
    provinceId: 'free-state',
    suburbs: ['Sasolburg Central', 'Vaaltriangle Area', 'Naledi', 'Zamdela', 'Deneysville', 'Oranjeville', 'Vaalpark'],
  },
  {
    id: 'phuthaditjhaba',
    name: 'Phuthaditjhaba',
    provinceId: 'free-state',
    suburbs: ['Phuthaditjhaba Central', 'Setsing', 'Bluegumbush', 'Qwaqwa Boundary', 'Golden Gate Highlands', 'Kestell'],
  },
  {
    id: 'bethlehem',
    name: 'Bethlehem',
    provinceId: 'free-state',
    suburbs: ['Bethlehem Town', 'Morelig', 'Bohlokong', 'Panorama Bethlehem', 'Eureka', 'Jordania', 'Paul Roux', 'Fouriesburg'],
  },
  {
    id: 'harrismith',
    name: 'Harrismith',
    provinceId: 'free-state',
    suburbs: ['Harrismith Town', 'Kings Hill', 'Intabazwe', 'Tshiame', 'Warden Central', 'Warden'],
  },
  {
    id: 'ficksburg',
    name: 'Ficksburg',
    provinceId: 'free-state',
    suburbs: ['Ficksburg Town', 'Meqheleng', 'Caledonspoort Border'],
  },
  {
    id: 'ladybrand',
    name: 'Ladybrand',
    provinceId: 'free-state',
    suburbs: ['Ladybrand Town', 'Manyatseng', 'Clocolan', 'Marquard', 'Excelsior', 'Hobhouse', 'Tweespruit'],
  },
  {
    id: 'parys',
    name: 'Parys',
    provinceId: 'free-state',
    suburbs: ['Parys Town', 'Tumahole', 'Vaal River Estate', 'Vredefort Town Area', 'Vredefort'],
  },
  {
    id: 'clarens',
    name: 'Clarens',
    provinceId: 'free-state',
    suburbs: ['Clarens Village', 'Swartland Clarens', 'Mount Rouge', 'Clarens Golf Estate', 'Larola'],
  },
  {
    id: 'heilbron',
    name: 'Heilbron',
    provinceId: 'free-state',
    suburbs: ['Heilbron Town', 'Phiritona', 'Frankfort Town FS', 'Villiers Town Area', 'Koppies'],
  },
  {
    id: 'frankfort',
    name: 'Frankfort',
    provinceId: 'free-state',
    suburbs: ['Frankfort Town', 'Namahadi', 'Villiers Town', 'Qalabotjha', 'Tweeling', 'Cornelia'],
  },
  {
    id: 'bothaville',
    name: 'Bothaville',
    provinceId: 'free-state',
    suburbs: ['Bothaville Town', 'Kgotsong', 'Meyerhof', 'Viljoenskroon Town', 'Viljoenskroon'],
  },
  {
    id: 'senekal',
    name: 'Senekal',
    provinceId: 'free-state',
    suburbs: ['Senekal Town', 'Matwabeng', 'Paul Roux Village', 'Rosendal Village FS', 'Arlington'],
  },
  {
    id: 'jagersfontein',
    name: 'Jagersfontein',
    provinceId: 'free-state',
    suburbs: ['Jagersfontein Town', 'Itumeleng', 'Fauresmith Town', 'Fauresmith'],
  },
  {
    id: 'philippolis',
    name: 'Philippolis',
    provinceId: 'free-state',
    suburbs: ['Philippolis Town', 'Pompiesstad', 'Waterkloof FS', 'Springfontein'],
  },
  {
    id: 'brandfort',
    name: 'Brandfort',
    provinceId: 'free-state',
    suburbs: ['Brandfort Town', 'Phahameng', 'Winburg Town', 'Winburg', 'Theunissen'],
  },
  {
    id: 'bultfontein',
    name: 'Bultfontein',
    provinceId: 'free-state',
    suburbs: ['Bultfontein Town', 'Hoopstad', 'Hertzogville', 'Wesselsbron'],
  },
  {
    id: 'boshof',
    name: 'Boshof',
    provinceId: 'free-state',
    suburbs: ['Boshof Town', 'Jacobsdal', 'Koffiefontein', 'Petrusburg'],
  },
  {
    id: 'dewetsdorp',
    name: 'Dewetsdorp',
    provinceId: 'free-state',
    suburbs: ['Dewetsdorp Town', 'Wepener', 'Van Stadensrus', 'Zastron', 'Rouxville', 'Smithfield', 'Bethulie'],
  },
  {
    id: 'vrede',
    name: 'Vrede',
    provinceId: 'free-state',
    suburbs: ['Vrede Town', 'Memel', 'Cornelia Vrede'],
  },
  {
    id: 'reitz',
    name: 'Reitz',
    provinceId: 'free-state',
    suburbs: ['Reitz Town', 'Petrus Steyn', 'Lindley', 'Arlington Reitz'],
  },

  // ==========================================
  // LIMPOPO PROVINCE (LP)
  // ==========================================
  {
    id: 'polokwane',
    name: 'Polokwane',
    provinceId: 'limpopo',
    suburbs: [
      'Flora Park', 'Bendor', 'Welgelegen', 'Nirvana', 'Seshego', 'Polokwane Central', 'Penina Park', 
      'Broadlands', 'Eduan Park', 'Woodlands', 'Ivydale', 'Mankweng'
    ],
  },
  {
    id: 'tzaneen',
    name: 'Tzaneen',
    provinceId: 'limpopo',
    suburbs: ['Aquapark', 'Arboretum', 'Flora Park Tzaneen', 'Tzaneen Central', 'Medipark', 'Golden Acres', 'Nkowankowa', 'Haenertsburg', 'Duiwelskloof (Modjadjiskloof)', 'Kgapane', 'Leydsdorp'],
  },
  {
    id: 'giyani',
    name: 'Giyani',
    provinceId: 'limpopo',
    suburbs: ['Giyani Central', 'Homu Block', 'Section A', 'Section F', 'Kremetart', 'Malamulele'],
  },
  {
    id: 'bela-bela',
    name: 'Bela-Bela',
    provinceId: 'limpopo',
    suburbs: ['Warmbaths Central', 'Sondela Nature Reserve', 'Bospoort Bela', 'Bela Township', 'Radium', 'Pienaarsrivier'],
  },
  {
    id: 'modimolle',
    name: 'Modimolle',
    provinceId: 'limpopo',
    suburbs: ['Modimolle Central', 'Nylstroom Boundary', 'Phagameng Modimolle', 'Vaalkop', 'Mabatlane (Vaaltwater)'],
  },
  {
    id: 'mokopane',
    name: 'Mokopane',
    provinceId: 'limpopo',
    suburbs: ['Mokopane Central', 'Chroompark', 'Akasia Mokopane', 'Mahwelereng', 'Potgietersrus Area', 'Roedtan'],
  },
  {
    id: 'thohoyandou',
    name: 'Thohoyandou',
    provinceId: 'limpopo',
    suburbs: ['Thohoyandou Central', 'Sibasa', 'Shayandima', 'Malamulele', 'Elim Area Limpopo', 'Mutale'],
  },
  {
    id: 'louis-trichardt',
    name: 'Louis Trichardt',
    provinceId: 'limpopo',
    suburbs: ['Louis Trichardt Central', 'Makhado East', 'Tshikota', 'Elim', 'Valdezia', 'Makhado', 'Bandelierkop', 'Waterpoort'],
  },
  {
    id: 'phalaborwa',
    name: 'Phalaborwa',
    provinceId: 'limpopo',
    suburbs: ['Phalaborwa Central', 'Namakgale', 'Lulekani', 'Gravelotte', 'Leydsdorp'],
  },
  {
    id: 'musina',
    name: 'Musina',
    provinceId: 'limpopo',
    suburbs: ['Musina Central', 'Nancefield', 'Messina Border', 'Beitbridge Outskirts', 'Alldays'],
  },
  {
    id: 'lephalale',
    name: 'Lephalale',
    provinceId: 'limpopo',
    suburbs: ['Onverwacht', 'Lephalale Town', 'Marapong', 'Steenbokpan', 'Ellisras Precinct', 'Ellisras'],
  },
  {
    id: 'hoedspruit',
    name: 'Hoedspruit',
    provinceId: 'limpopo',
    suburbs: ['Wildlife Estate', 'Raptors View', 'Hoedspruit Town Centre', 'Kampersrus', 'Klaserie', 'Ofcolaco'],
  },
  {
    id: 'thabazimbi',
    name: 'Thabazimbi',
    provinceId: 'limpopo',
    suburbs: ['Thabazimbi Central', 'Regorogile', 'Ipelegeng', 'Northam Town Area', 'Northam', 'Amandelbult'],
  },
  {
    id: 'burgersfort',
    name: 'Burgersfort',
    provinceId: 'limpopo',
    suburbs: ['Burgersfort Town', 'Steelpoort Town', 'Jane Furse Area', 'Apel', 'Prakise', 'Jane Furse', 'Steelpoort', 'Ohrigstad'],
  },
  {
    id: 'mookgophong',
    name: 'Mookgophong (Naboomspruit)',
    provinceId: 'limpopo',
    suburbs: ['Naboomspruit Central', 'Roedtan Township', 'Mookgophong Township'],
  },
  {
    id: 'lebowakgomo',
    name: 'Lebowakgomo',
    provinceId: 'limpopo',
    suburbs: ['Zone A', 'Zone B', 'Zone F', 'Zone S', 'Ga-Mphahlele', 'Zion City Moria'],
  },

  // ==========================================
  // MPUMALANGA PROVINCE (MP)
  // ==========================================
  {
    id: 'mbombela',
    name: 'Mbombela (Nelspruit)',
    provinceId: 'mpumalanga',
    suburbs: ['Steiltes', 'West Acres', 'Sonheuwel', 'Nelspruit Central', 'Vintonia', 'Stonehenge', 'Elawini', 'Safubi', 'Karino', 'Kanyamazane', 'Kabokweni'],
  },
  {
    id: 'white-river',
    name: 'White River',
    provinceId: 'mpumalanga',
    suburbs: ['White River Central', 'Colts Hill', 'Kingsview', 'Uplands', 'Hillsview', 'White River Country Estate'],
  },
  {
    id: 'barberton',
    name: 'Barberton',
    provinceId: 'mpumalanga',
    suburbs: ['Barberton Town', 'Emjindini', 'Spearville', 'Rimers Creek', 'Badplaas (eManozana)'],
  },
  {
    id: 'emalahleni',
    name: 'Emalahleni (Witbank)',
    provinceId: 'mpumalanga',
    suburbs: ['Reyno Ridge', 'Del Judor', 'Klipfontein', 'Witbank Central', 'Model Park', 'Ben Fleur', 'Kriel', 'Ogies'],
  },
  {
    id: 'middelburg-mp',
    name: 'Middelburg',
    provinceId: 'mpumalanga',
    suburbs: ['Middelburg Central', 'Aerorand', 'Kanonkop', 'Mineralia', 'Mhluzi', 'Eastdene', 'Groblersdal', 'Marble Hall', 'Hendrina'],
  },
  {
    id: 'secunda',
    name: 'Secunda',
    provinceId: 'mpumalanga',
    suburbs: ['Secunda Central', 'Trichardt', 'Evander', 'Embalenhle', 'Kinross', 'Bethal'],
  },
  {
    id: 'standerton',
    name: 'Standerton',
    provinceId: 'mpumalanga',
    suburbs: ['Standerton Central', 'Sakhile', 'Stanfield Hill', 'Kosmospark', 'Meyerville'],
  },
  {
    id: 'lydenburg',
    name: 'Lydenburg',
    provinceId: 'mpumalanga',
    suburbs: ['Lydenburg Central', 'Sabie Town Area', 'Graskop Area', 'Mashishing', 'Ohrigstad'],
  },
  {
    id: 'sabie',
    name: 'Sabie',
    provinceId: 'mpumalanga',
    suburbs: ['Sabie Town', 'Simile', 'Mount Sheba', 'Harmony Hill'],
  },
  {
    id: 'graskop',
    name: 'Graskop',
    provinceId: 'mpumalanga',
    suburbs: ['Graskop Town', 'Pilgrim\'s Rest Village', 'Blyde Canyon Area', 'Pilgrim\'s Rest'],
  },
  {
    id: 'hazyview',
    name: 'Hazyview',
    provinceId: 'mpumalanga',
    suburbs: ['Hazyview Central', 'Perry\'s Bridge', 'Hazyview Country Estate', 'Shabalala'],
  },
  {
    id: 'ermelo',
    name: 'Ermelo',
    provinceId: 'mpumalanga',
    suburbs: ['Ermelo Town', 'Wesselton', 'Cassim Park', 'Piet Retief Corner', 'eMkhondo Area', 'Breyten', 'Chrissiesmeer', 'Davel'],
  },
  {
    id: 'piet-retief',
    name: 'Piet Retief (eMkhondo)',
    provinceId: 'mpumalanga',
    suburbs: ['Piet Retief Town', 'eMkhondo', 'Kempville Town', 'Ethandukukhanya', 'Amsterdam'],
  },
  {
    id: 'dullstroom',
    name: 'Dullstroom',
    provinceId: 'mpumalanga',
    suburbs: ['Dullstroom Town', 'Dunkeld Estate', 'Walkersons', 'Belfast Town Area', 'Siyathuthuka'],
  },
  {
    id: 'belfast',
    name: 'Belfast',
    provinceId: 'mpumalanga',
    suburbs: ['Belfast Town', 'Siyathuthuka', 'Machadodorp Town', 'Waterval Boven / Emgwenya', 'Machadodorp (eTokoza)'],
  },
  {
    id: 'komatipoort',
    name: 'Komatipoort',
    provinceId: 'mpumalanga',
    suburbs: ['Komatipoort Town', 'Marloth Park', 'Malelane Town Area', 'Hectorspruit Area', 'Lebombo'],
  },
  {
    id: 'malelane',
    name: 'Malelane',
    provinceId: 'mpumalanga',
    suburbs: ['Malelane Town', 'Malelane Estate', 'Hectorspruit', 'Kaapmuiden', 'Kamaqhekeza'],
  },
  {
    id: 'kriel',
    name: 'Kriel',
    provinceId: 'mpumalanga',
    suburbs: ['Ga-Nala Central', 'Thubelihle', 'Kriel Residential'],
  },
  {
    id: 'balfour',
    name: 'Balfour',
    provinceId: 'mpumalanga',
    suburbs: ['Balfour Town', 'Siyathemba', 'Balfour West', 'Heidelberg Border'],
  },
  {
    id: 'volksrust',
    name: 'Volksrust',
    provinceId: 'mpumalanga',
    suburbs: ['Volksrust Town', 'Vukuzakhe', 'Wakkerstroom', 'Amersfoort', 'Perdekop'],
  },
  {
    id: 'delmas',
    name: 'Delmas',
    provinceId: 'mpumalanga',
    suburbs: ['Delmas Central', 'Botleng', 'Eloff', 'Sundra'],
  },
  {
    id: 'siyabuswa',
    name: 'Siyabuswa',
    provinceId: 'mpumalanga',
    suburbs: ['Siyabuswa Central', 'Tweefontein'],
  },

  // ==========================================
  // NORTH WEST PROVINCE (NW)
  // ==========================================
  {
    id: 'rustenburg',
    name: 'Rustenburg',
    provinceId: 'north-west',
    suburbs: ['Safari Gardens', 'Cashan', 'Geelhoutpark', 'Waterfall East', 'Rustenburg Central', 'Boitekong', 'Phokeng', 'Kloofsig', 'Marikana', 'Mogwase'],
  },
  {
    id: 'potchefstroom',
    name: 'Potchefstroom',
    provinceId: 'north-west',
    suburbs: ['Bult', 'Grimbeek Park', 'Dassierand', 'Potch Central', 'Baillie Park', 'van der Hoff Park', 'Ikageng', 'Miederpark', 'Ventersdorp'],
  },
  {
    id: 'klerksdorp',
    name: 'Klerksdorp',
    provinceId: 'north-west',
    suburbs: ['Wilkoppies', 'Doringkruin', 'Flamwood', 'Klerksdorp Central', 'Meiringspark', 'Jouberton', 'Hartebeesfontein'],
  },
  {
    id: 'orkney',
    name: 'Orkney',
    provinceId: 'north-west',
    suburbs: ['Orkney Town', 'Kanana', 'Vaal Reefs', 'Stilfontein Town', 'Stilfontein'],
  },
  {
    id: 'stilfontein',
    name: 'Stilfontein',
    provinceId: 'north-west',
    suburbs: ['Stilfontein Town', 'Khuma', 'Stilfontein Hills'],
  },
  {
    id: 'mahikeng',
    name: 'Mahikeng (Mafikeng)',
    provinceId: 'north-west',
    suburbs: ['Mafikeng Central', 'Golf View', 'Libertas', 'Mmabatho', 'Danville NW', 'Imperial Reserve', 'Morokweng'],
  },
  {
    id: 'vryburg',
    name: 'Vryburg',
    provinceId: 'north-west',
    suburbs: ['Vryburg Town', 'Huhudi', 'Kismet Park', 'Schweizer-Reneke Central Town', 'Stella', 'Reivilo', 'Ganyesa', 'Pomfret'],
  },
  {
    id: 'brits',
    name: 'Brits',
    provinceId: 'north-west',
    suburbs: ['Brits Town', 'Elandsrand', 'Letlhabile', 'Oukasie', 'Brits Industrial', 'Babelegi'],
  },
  {
    id: 'hartbeespoort',
    name: 'Hartbeespoort',
    provinceId: 'north-west',
    suburbs: ['Kosmos', 'Melodie', 'Ifafi', 'Meerhof', 'Pecanwood Estate', 'Caribbean Beach Club', 'Broederstroom'],
  },
  {
    id: 'lichtenburg',
    name: 'Lichtenburg',
    provinceId: 'north-west',
    suburbs: ['Lichtenburg Town', 'Blydeville NorthWest', 'Boikhutso', 'Coligny Town NW', 'Coligny', 'Sannieshof'],
  },
  {
    id: 'zeerust',
    name: 'Zeerust',
    provinceId: 'north-west',
    suburbs: ['Zeerust Town', 'Ikageng Zeerust', 'Shalimar Park', 'Woodaspan Local', 'Groot Marico', 'Madikwe'],
  },
  {
    id: 'schweizer-reneke',
    name: 'Schweizer-Reneke',
    provinceId: 'north-west',
    suburbs: ['Schweizer-Reneke Central', 'Ipelegeng', 'Charon', 'Amalia'],
  },
  {
    id: 'wolmaransstad',
    name: 'Wolmaransstad',
    provinceId: 'north-west',
    suburbs: ['Wolmaransstad Town', 'Tswelelang', 'Leeudoringstad', 'Makwassie'],
  },
  {
    id: 'ventersdorp',
    name: 'Ventersdorp',
    provinceId: 'north-west',
    suburbs: ['Ventersdorp Town', 'Tshing', 'Toevlug'],
  },
  {
    id: 'christiana',
    name: 'Christiana',
    provinceId: 'north-west',
    suburbs: ['Christiana Town', 'Utlwanang', 'Christiana Retail Area'],
  },
  {
    id: 'bloemhof',
    name: 'Bloemhof',
    provinceId: 'north-west',
    suburbs: ['Bloemhof Town', 'Coverdale', 'Boitumelong'],
  },
  {
    id: 'delareyville',
    name: 'Delareyville',
    provinceId: 'north-west',
    suburbs: ['Delareyville Town', 'Molaolwaneng'],
  },
  {
    id: 'koster',
    name: 'Koster',
    provinceId: 'north-west',
    suburbs: ['Koster Town', 'Reagile', 'Swartruggens', 'Derby'],
  },
  {
    id: 'taung',
    name: 'Taung',
    provinceId: 'north-west',
    suburbs: ['Taung Town', 'Pudimoe', 'Pamier NorthWest'],
  },

  // ==========================================
  // NORTHERN CAPE PROVINCE (NC)
  // ==========================================
  {
    id: 'kimberley',
    name: 'Kimberley',
    provinceId: 'northern-cape',
    suburbs: ['Belgravia', 'Hadison Park', 'Royldene', 'Monument Heights', 'Beaconsfield', 'Kimberley Central', 'Galeshewe', 'Carters Glen', 'Roodepan', 'Ritchie', 'Modderrivier', 'Warrenton'],
  },
  {
    id: 'upington',
    name: 'Upington',
    provinceId: 'northern-cape',
    suburbs: ['Keidebees', 'Upington Central', 'Webbish', 'Rosedale', 'Oasis Upington', 'Blydeville Upington', 'Kanoneiland', 'Augrabies', 'Groblershoop'],
  },
  {
    id: 'kakamas',
    name: 'Kakamas',
    provinceId: 'northern-cape',
    suburbs: ['Kakamas Town', 'Kakamas North', 'Langverwag', 'Keimoes Town Corner', 'Riemvasmaak'],
  },
  {
    id: 'keimoes',
    name: 'Keimoes',
    provinceId: 'northern-cape',
    suburbs: ['Keimoes Town', 'Lennetsville', 'Kenhardt Area', 'Kenhardt'],
  },
  {
    id: 'kathu',
    name: 'Kathu',
    provinceId: 'northern-cape',
    suburbs: ['Kathu Central', 'Kathu Forest', 'Sishen Mine Residential', 'Sesheng', 'Debeng', 'Olifantshoek'],
  },
  {
    id: 'kuruman',
    name: 'Kuruman',
    provinceId: 'northern-cape',
    suburbs: ['Kuruman Central', 'Wrenchville', 'Mothibistad', 'Kuruman Hills', 'Hotazel'],
  },
  {
    id: 'springbok',
    name: 'Springbok',
    provinceId: 'northern-cape',
    suburbs: ['Springbok Central', 'Bergsig Springbok', 'Okiep Town', 'Nababeep Namaqualand', 'Port Nolloth Area', 'Garies Town', 'Concordia', 'Carolsberg', 'Kamieskroon', 'Steinkopf'],
  },
  {
    id: 'port-nolloth',
    name: 'Port Nolloth',
    provinceId: 'northern-cape',
    suburbs: ['Port Nolloth Town', 'McDougalls Bay', 'Nollothville', 'Alexander Bay', 'Kleinzee', 'Hondeklip Bay'],
  },
  {
    id: 'de-aar',
    name: 'De Aar',
    provinceId: 'northern-cape',
    suburbs: ['De Aar Town', 'Nonzwakazi', 'Sunrise', 'Britstown Central', 'Philipstown Central', 'Hanover Town', 'Britstown', 'Philipstown', 'Hanover'],
  },
  {
    id: 'colesberg',
    name: 'Colesberg',
    provinceId: 'northern-cape',
    suburbs: ['Colesberg Town', 'Lowryville', 'Kuyasa', 'Norvalspont Area', 'Noupoort Central', 'Noupoort'],
  },
  {
    id: 'calvinia',
    name: 'Calvinia',
    provinceId: 'northern-cape',
    suburbs: ['Calvinia Town', 'Hantam Nature Reserve Area', 'Akkerendam Calvinia', 'Williston Village', 'Brandvlei Local', 'Loeriesfontein Town', 'Nieuwoudtville', 'Brandvlei', 'Williston'],
  },
  {
    id: 'sutherland',
    name: 'Sutherland',
    provinceId: 'northern-cape',
    suburbs: ['Sutherland Town', 'Sneeuberg observatory', 'Fraserburg Town Area', 'Fraserburg'],
  },
  {
    id: 'carnarvon',
    name: 'Carnarvon',
    provinceId: 'northern-cape',
    suburbs: ['Carnarvon Town', 'Bonteheuwel NC', 'SKA Telescope area', 'Vosburg Town Area', 'Vosburg'],
  },
  {
    id: 'victoria-west',
    name: 'Victoria West',
    provinceId: 'northern-cape',
    suburbs: ['Victoria West Town', 'Dawn View Victoria', 'Richmond Town NC Area', 'Loxton Village NC', 'Hutchinson'],
  },
  {
    id: 'prieska',
    name: 'Prieska',
    provinceId: 'northern-cape',
    suburbs: ['Prieska Town', 'eThembeni', 'Copperton Town Reserve', 'Marydale Village', 'Niekerkshoop', 'Marydale'],
  },
  {
    id: 'richmond-nc',
    name: 'Richmond (NC)',
    provinceId: 'northern-cape',
    suburbs: ['Richmond Town NC', 'Sinton', 'Merriman area'],
  },
  {
    id: 'loxton',
    name: 'Loxton',
    provinceId: 'northern-cape',
    suburbs: ['Loxton Village', 'Loxton Heights'],
  },
  {
    id: 'hartswater',
    name: 'Hartswater',
    provinceId: 'northern-cape',
    suburbs: ['Hartswater Town', 'Bonita Park', 'Pamier', 'Jan Kempdorp Town', 'Vaalharts Irrigation Area', 'Jan Kempdorp'],
  },
  {
    id: 'barkly-west',
    name: 'Barkly West',
    provinceId: 'northern-cape',
    suburbs: ['Barkly West Town', 'Mataleng', 'Windsorton', 'Campbell NC', 'Delportshoop', 'Griekwastad', 'Douglas'],
  },
  {
    id: 'postmasburg',
    name: 'Postmasburg',
    provinceId: 'northern-cape',
    suburbs: ['Postmasburg Central', 'Lime Acres', 'Danielskuil'],
  },
  {
    id: 'brandvlei',
    name: 'Brandvlei',
    provinceId: 'northern-cape',
    suburbs: ['Brandvlei Central', 'Brandvlei North'],
  },
  {
    id: 'hopetown',
    name: 'Hopetown',
    provinceId: 'northern-cape',
    suburbs: ['Hopetown Town', 'Petrusville', 'Strydenburg'],
  },
  {
    id: 'orania',
    name: 'Orania',
    provinceId: 'northern-cape',
    suburbs: ['Orania Central', 'Orania Extension', 'Vanderkloof'],
  }
];

export const CATEGORIES = [
  // --- MEDICAL & HEALTH ---
  { id: 'health', name: 'Medical & Health (General)', icon: 'HeartPulse', color: 'text-emerald-500 bg-emerald-50' },
  { id: 'dental', name: 'Dental Care & Orthodontics', icon: 'Smile', color: 'text-emerald-600 bg-emerald-50' },
  { id: 'pharmacy', name: 'Pharmacies & Dispensaries', icon: 'Pill', color: 'text-teal-500 bg-teal-50' },
  { id: 'therapy-mental', name: 'Therapy, Counseling & Psychiatry', icon: 'Brain', color: 'text-violet-500 bg-violet-50' },
  { id: 'holistic-wellness', name: 'Holistic & Alternative Medicine', icon: 'Leaf', color: 'text-emerald-700 bg-emerald-50' },
  { id: 'elder-care', name: 'Elder Care & Frail Care Facilities', icon: 'Users', color: 'text-stone-600 bg-stone-50' },

  // --- PROFESSIONAL & SPECIALIZED SERVICES ---
  { id: 'services', name: 'Professional Consulting', icon: 'Briefcase', color: 'text-blue-500 bg-blue-50' },
  { id: 'legal', name: 'Legal Services & Notaries', icon: 'Scale', color: 'text-slate-700 bg-slate-50' },
  { id: 'accounting-tax', name: 'Accounting, Bookkeeping & Tax', icon: 'Calculator', color: 'text-indigo-600 bg-indigo-50' },
  { id: 'finance-insurance', name: 'Finance, Banking & Insurance', icon: 'Coins', color: 'text-green-500 bg-green-50' },
  { id: 'security-services', name: 'Guarding & Security Systems', icon: 'ShieldCheck', color: 'text-teal-600 bg-teal-50' },
  { id: 'pest-control', name: 'Pest Control & Fumigation', icon: 'Bug', color: 'text-amber-700 bg-amber-50' },
  { id: 'locksmith', name: 'Locksmiths & Key Cutting', icon: 'Key', color: 'text-orange-500 bg-orange-50' },
  { id: 'debt-collection', name: 'Debt Collection & Recoveries', icon: 'TrendingDown', color: 'text-rose-600 bg-rose-50' },
  { id: 'translation-writing', name: 'Translation, Editing & Copywriting', icon: 'PenTool', color: 'text-rose-500 bg-rose-50' },
  { id: 'printing-signage', name: 'Printers, Signage & Copiers', icon: 'Printer', color: 'text-violet-600 bg-violet-50' },

  // --- MECHANICAL, AUTOMOTIVE & VEHICLES ---
  { id: 'automotive', name: 'Auto Repair & Mechanical', icon: 'Car', color: 'text-indigo-500 bg-indigo-50' },
  { id: 'panel-beating', name: 'Panel Beating & Spray Painting', icon: 'Hammer', color: 'text-blue-600 bg-blue-50' },
  { id: 'car-dealerships', name: 'Car Dealerships & Sales', icon: 'Tag', color: 'text-cyan-500 bg-cyan-50' },
  { id: 'trucking-logistics', name: 'Logistics, Transport & Storage', icon: 'Truck', color: 'text-sky-500 bg-sky-50' },
  { id: 'maritime-marine', name: 'Maritime & Marine Services', icon: 'Anchor', color: 'text-blue-700 bg-blue-50' },
  { id: 'aviation-drones', name: 'Aviation, Flight Schools & Drones', icon: 'Plane', color: 'text-indigo-700 bg-indigo-50' },

  // --- TRADES, CONSTRUCTION & INDUSTRIAL ---
  { id: 'trades', name: 'Plumbing & Drain Cleaning', icon: 'Wrench', color: 'text-orange-500 bg-orange-50' },
  { id: 'electrical', name: 'Electrical Wiring & Power', icon: 'Zap', color: 'text-yellow-500 bg-yellow-50' },
  { id: 'hvac', name: 'Airco, HVAC & Refrigeration', icon: 'Snowflake', color: 'text-cyan-400 bg-cyan-50' },
  { id: 'carpentry', name: 'Carpentry & Cabinet Making', icon: 'Hammer', color: 'text-amber-600 bg-amber-50' },
  { id: 'solar-energy', name: 'Solar Energy & Backup Power', icon: 'Sun', color: 'text-yellow-600 bg-yellow-50' },
  { id: 'construction', name: 'Construction & Civil Contracting', icon: 'Hammer', color: 'text-slate-500 bg-slate-50' },
  { id: 'architecture', name: 'Architecture & Spatial Design', icon: 'Compass', color: 'text-indigo-500 bg-indigo-50' },
  { id: 'roofing', name: 'Roofing, Waterproofing & Gutters', icon: 'Home', color: 'text-neutral-600 bg-neutral-50' },
  { id: 'machinery-hire', name: 'Plant Hire & Heavy Equipment', icon: 'Layers', color: 'text-violet-500 bg-violet-50' },
  { id: 'boreholes-water', name: 'Boreholes & Water Treatment', icon: 'Droplet', color: 'text-blue-400 bg-blue-50' },
  { id: 'mining-extractives', name: 'Mining, Extractives & Quarrying', icon: 'HardHat', color: 'text-stone-700 bg-stone-150' },
  { id: 'industrial-mfg', name: 'Factories & Industrial Manufacturing', icon: 'Factory', color: 'text-stone-600 bg-stone-100' },
  { id: 'waste-recycling', name: 'Waste Management & Recycling', icon: 'Trash2', color: 'text-lime-500 bg-lime-50' },

  // --- FOOD, DRINK & CATERING ---
  { id: 'food', name: 'Restaurants, Cafes & Bistros', icon: 'Utensils', color: 'text-amber-500 bg-amber-50' },
  { id: 'fast-food', name: 'Fast Food & Takeaways', icon: 'Coffee', color: 'text-orange-600 bg-orange-50' },
  { id: 'catering-events', name: 'Catering Services', icon: 'Pizza', color: 'text-pink-500 bg-pink-50' },
  { id: 'liquor-breweries', name: 'Breweries, Wineries & Distilleries', icon: 'Wine', color: 'text-red-700 bg-red-50' },

  // --- PROPERTY & REAL ESTATE ---
  { id: 'real-estate', name: 'Real Estate Sales & Letting', icon: 'Building', color: 'text-cyan-600 bg-cyan-50' },
  { id: 'valutations', name: 'Property Valuations', icon: 'ClipboardList', color: 'text-teal-600 bg-teal-50' },
  { id: 'interior-decor', name: 'Interior Decor & Curtains', icon: 'Palette', color: 'text-purple-500 bg-purple-50' },

  // --- EDUCATION, INFORMATION TECH & DIGITAL ---
  { id: 'education', name: 'Schools, Academies & Training', icon: 'GraduationCap', color: 'text-indigo-600 bg-indigo-50' },
  { id: 'tutoring', name: 'Private Tutoring & Exam Prep', icon: 'BookOpen', color: 'text-sky-600 bg-sky-50' },
  { id: 'tech-it', name: 'IT Support, Software & Cloud', icon: 'Laptop', color: 'text-purple-600 bg-purple-50' },
  { id: 'telecoms', name: 'Telecommunications & Fiber', icon: 'Wifi', color: 'text-teal-600 bg-teal-50' },
  { id: 'digital-marketing', name: 'Marketing & Digital Advertising', icon: 'Megaphone', color: 'text-rose-500 bg-rose-50' },
  { id: 'digital-media', name: 'Photography & Videography', icon: 'Camera', color: 'text-violet-600 bg-violet-50' },
  { id: 'coworking', name: 'Coworking Spaces & Boardrooms', icon: 'Users', color: 'text-blue-500 bg-blue-50' },

  // --- COMMUNITY & PUBLIC SECTOR ---
  { id: 'emergency', name: 'Emergency & Fire Services', icon: 'ShieldAlert', color: 'text-red-500 bg-red-50' },
  { id: 'ngos-charities', name: 'NGOs, Charities & Non-Profits', icon: 'Heart', color: 'text-rose-500 bg-rose-50' },
  { id: 'religious', name: 'Religious Centers & Churches', icon: 'Globe', color: 'text-slate-600 bg-slate-50' },
  { id: 'municipality', name: 'Municipal & Public Services', icon: 'Building2', color: 'text-emerald-700 bg-emerald-50' },

  // --- TOURISM, LEISURE & RECREATION ---
  { id: 'tourism', name: 'Hotels, Lodges & Accommodation', icon: 'Palmtree', color: 'text-cyan-500 bg-cyan-50' },
  { id: 'travel-agency', name: 'Travel Agencies & Tour Guides', icon: 'Compass', color: 'text-blue-600 bg-blue-50' },
  { id: 'fitness-gym', name: 'Sports, Gyms & Fitness Trainers', icon: 'Dumbbell', color: 'text-orange-600 bg-orange-50' },
  { id: 'sports-clubs', name: 'Sports Clubs & Recreation Fields', icon: 'Activity', color: 'text-emerald-600 bg-emerald-50' },

  // --- BEAUTY, WELLNESS & PERSONAL CARE ---
  { id: 'beauty-wellness', name: 'Beauty Salons & Hairdressers', icon: 'Scissors', color: 'text-fuchsia-500 bg-fuchsia-50' },
  { id: 'massage-spa', name: 'Spas & Massage Therapy', icon: 'Sparkles', color: 'text-teal-500 bg-teal-50' },
  { id: 'tailoring', name: 'Tailoring & Alterations', icon: 'Scissors', color: 'text-pink-600 bg-pink-50' },

  // --- RETAIL & SHOPPING ---
  { id: 'retail', name: 'Retail Shops & Supermarkets', icon: 'ShoppingBag', color: 'text-pink-500 bg-pink-50' },
  { id: 'fashion-apparel', name: 'Fashion Boutiques & Footwear', icon: 'Shirt', color: 'text-sky-500 bg-sky-50' },
  { id: 'electronics', name: 'Electronics & Home Appliances', icon: 'Tv', color: 'text-purple-500 bg-purple-50' },
  { id: 'hardware-store', name: 'Hardware & Building Supplies', icon: 'Hammer', color: 'text-stone-700 bg-stone-50' },
  { id: 'toy-hobby', name: 'Toy Stores & Hobby Shops', icon: 'Gamepad2', color: 'text-red-500 bg-red-50' },
  { id: 'bookshops', name: 'Bookshops & Stationers', icon: 'BookOpen', color: 'text-indigo-500 bg-indigo-50' },
  { id: 'art-galleries', name: 'Art Galleries & Studios', icon: 'Palette', color: 'text-rose-400 bg-rose-50' },
  { id: 'music-instruments', name: 'Music Recording & Instruments', icon: 'Music', color: 'text-amber-500 bg-amber-50' },
  { id: 'florists', name: 'Florists & Nursery Plants', icon: 'Flower2', color: 'text-green-600 bg-green-50' },
  { id: 'craft-markets', name: 'Craft & Flea Markets', icon: 'Store', color: 'text-orange-600 bg-orange-50' },

  // --- CLEANING & HOME MAINTENANCE ---
  { id: 'cleaning', name: 'Cleaning & Janitorial Services', icon: 'Sparkles', color: 'text-teal-500 bg-teal-50' },
  { id: 'home-improvement', name: 'Home Renovations & Handyman', icon: 'Home', color: 'text-yellow-500 bg-yellow-50' },
  { id: 'laundry-laundromat', name: 'Laundry & Dry Cleaning', icon: 'Wind', color: 'text-blue-400 bg-blue-50' },
  { id: 'landscaping', name: 'Garden Maintenance & Landscaping', icon: 'Trees', color: 'text-emerald-600 bg-emerald-50' },
  { id: 'swimming-pools', name: 'Swimming Pool Maintenance', icon: 'Waves', color: 'text-cyan-500 bg-cyan-50' },
  { id: 'tree-felling', name: 'Tree Felling & Stump Removal', icon: 'Trees', color: 'text-amber-700 bg-amber-50' },
  { id: 'movers-relocation', name: 'Moving & Relocation Services', icon: 'PackageOpen', color: 'text-sky-600 bg-sky-50' },

  // --- ANIMAL, PETS & VET ---
  { id: 'pets-veterinary', name: 'Veterinary Clinics & Surgeons', icon: 'HeartPulse', color: 'text-red-400 bg-red-50' },
  { id: 'pet-grooming', name: 'Pet Grooming & Parlors', icon: 'Scissors', color: 'text-sky-500 bg-sky-50' },
  { id: 'pet-boarding', name: 'Pet Boarding & Kennels', icon: 'Home', color: 'text-orange-600 bg-orange-50' },

  // --- EVENTS, LEISURE & ENTERTAINMENT ---
  { id: 'events', name: 'Event Organizers & Planners', icon: 'Calendar', color: 'text-red-400 bg-red-50' },
  { id: 'equipment-rentals', name: 'Party Hire & Event Equipment', icon: 'Sparkles', color: 'text-pink-500 bg-pink-50' },
  { id: 'stage-sound', name: 'Sound Systems & Stage Lighting', icon: 'Volume2', color: 'text-emerald-500 bg-emerald-50' },
  { id: 'dance-theaters', name: 'Dance & Theater Academies', icon: 'Activity', color: 'text-purple-600 bg-purple-50' },
  { id: 'model-casting', name: 'Model & Talent Agencies', icon: 'Users', color: 'text-rose-500 bg-rose-50' },

  // --- AGRICULTURE & OUTDOORS ---
  { id: 'agriculture-garden', name: 'Farming, Crops & Livestock', icon: 'Leaf', color: 'text-green-600 bg-green-50' },
  { id: 'paving-decking', name: 'Paving, Decking & Fencing', icon: 'Grid', color: 'text-neutral-500 bg-neutral-100' },

  // --- MISCELLANEOUS SPECIALIZED ---
  { id: 'funeral', name: 'Funeral Homes & Memorials', icon: 'Heart', color: 'text-neutral-500 bg-neutral-100' },
  { id: 'courier', name: 'Courier & Express Delivery', icon: 'Send', color: 'text-blue-500 bg-blue-50' },
  { id: 'childcare', name: 'Daycare, Creches & Preschools', icon: 'Baby', color: 'text-pink-400 bg-pink-50' },
  { id: 'fire-safety', name: 'Fire Auditing & Extinguishers', icon: 'ShieldAlert', color: 'text-red-600 bg-red-50' },
  { id: 'office-furniture', name: 'Office Supplies & Corporate Decor', icon: 'Armchair', color: 'text-blue-600 bg-blue-50' },
  { id: 'corporate-gifting', name: 'Corporate Gifting & Screenprint', icon: 'Gift', color: 'text-rose-500 bg-rose-50' },
  { id: 'taxidermy', name: 'Taxidermy & Trophy Mounting', icon: 'Compass', color: 'text-yellow-700 bg-yellow-50' },
];
