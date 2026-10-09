export interface ShortVideoItem {
  id: string;
  youtubeId: string;
  title: string;
  category: 'tv-units' | 'wardrobes' | 'kitchen' | 'doors' | 'beds' | 'workshop';
  categoryLabel: string;
  duration: string;
  views: string;
  thumbnail: string;
  youtubeUrl: string;
  embedUrl: string;
  observedNote: string; // Factual observation directly from the video (no pseudo-fluff)
  description?: string; // Real description added by owner (if any)
  location?: string;
}

export const galleryShorts: ShortVideoItem[] = [
  {
    id: 'yt-short-1',
    youtubeId: 'G5ckkFuaxn4',
    title: 'Hettich Drawer System',
    category: 'kitchen',
    categoryLabel: 'Modular Kitchen & Hardware',
    duration: '0:30',
    views: '1.2K',
    thumbnail: 'https://i.ytimg.com/vi/G5ckkFuaxn4/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/shorts/G5ckkFuaxn4',
    embedUrl: 'https://www.youtube-nocookie.com/embed/G5ckkFuaxn4?autoplay=1&loop=1&playlist=G5ckkFuaxn4&rel=0&modestbranding=1',
    observedNote: 'Testing Hettich soft-close drawer runner mechanism and smooth slide action for modular cabinetry.',
    location: 'Workshop Test',
  },
  {
    id: 'yt-short-2',
    youtubeId: 'KJpddeWIrLs',
    title: 'Carpenter Work Hennur Cross',
    category: 'workshop',
    categoryLabel: 'Site Carpentry',
    duration: '0:35',
    views: '1.5K',
    thumbnail: 'https://i.ytimg.com/vi/KJpddeWIrLs/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/shorts/KJpddeWIrLs',
    embedUrl: 'https://www.youtube-nocookie.com/embed/KJpddeWIrLs?autoplay=1&loop=1&playlist=KJpddeWIrLs&rel=0&modestbranding=1',
    observedNote: 'On-site structural carpentry framing and partition work in progress at Hennur Cross site, Bengaluru.',
    location: 'Hennur Cross, Bengaluru',
  },
  {
    id: 'yt-short-3',
    youtubeId: 'obMG1FcpeMk',
    title: 'Carpenter Work School Project',
    category: 'tv-units',
    categoryLabel: 'Custom Joinery',
    duration: '0:45',
    views: '1.6K',
    thumbnail: 'https://i.ytimg.com/vi/obMG1FcpeMk/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/shorts/obMG1FcpeMk',
    embedUrl: 'https://www.youtube-nocookie.com/embed/obMG1FcpeMk?autoplay=1&loop=1&playlist=obMG1FcpeMk&rel=0&modestbranding=1',
    observedNote: 'Interior carpentry framing, shelving joinery, and custom casework installation at school site.',
    location: 'Bengaluru Project',
  },
  {
    id: 'yt-short-4',
    youtubeId: 'Xtp0AOSY7yg',
    title: 'Cabinet & Carcass Fitting',
    category: 'wardrobes',
    categoryLabel: 'Fitted Wardrobes',
    duration: '0:28',
    views: '1.7K',
    thumbnail: 'https://i.ytimg.com/vi/Xtp0AOSY7yg/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/shorts/Xtp0AOSY7yg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Xtp0AOSY7yg?autoplay=1&loop=1&playlist=Xtp0AOSY7yg&rel=0&modestbranding=1',
    observedNote: 'On-site cabinet carcass assembly, level check, and wardrobe partition fitting.',
    location: 'Bengaluru Residence',
  },
  {
    id: 'yt-short-5',
    youtubeId: 'bVSD8MUevDQ',
    title: 'Woodwork Alignment & Level Inspection',
    category: 'wardrobes',
    categoryLabel: 'Interior Woodwork',
    duration: '0:32',
    views: '1.5K',
    thumbnail: 'https://i.ytimg.com/vi/bVSD8MUevDQ/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/shorts/bVSD8MUevDQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/bVSD8MUevDQ?autoplay=1&loop=1&playlist=bVSD8MUevDQ&rel=0&modestbranding=1',
    observedNote: 'Spirit level alignment check and flush gap verification across fitted interior units.',
    location: 'Bengaluru Residence',
  },
  {
    id: 'yt-short-6',
    youtubeId: 'cFLYx11HKOs',
    title: 'Solid Wood Joinery & Surface Finishing',
    category: 'workshop',
    categoryLabel: 'Workshop Assembly',
    duration: '0:38',
    views: '1.4K',
    thumbnail: 'https://i.ytimg.com/vi/cFLYx11HKOs/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/shorts/cFLYx11HKOs',
    embedUrl: 'https://www.youtube-nocookie.com/embed/cFLYx11HKOs?autoplay=1&loop=1&playlist=cFLYx11HKOs&rel=0&modestbranding=1',
    observedNote: 'Solid timber frame joinery, edge cleaning, and surface preparation at the workshop.',
    location: 'RT Nagar Workshop',
  },
  {
    id: 'yt-short-7',
    youtubeId: 'Hd0sKeFZgzE',
    title: 'Custom Carpenter Workmanship & Detail Fitting',
    category: 'tv-units',
    categoryLabel: 'Custom Woodwork',
    duration: '0:30',
    views: '1.2K',
    thumbnail: 'https://i.ytimg.com/vi/Hd0sKeFZgzE/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/shorts/Hd0sKeFZgzE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Hd0sKeFZgzE?autoplay=1&loop=1&playlist=Hd0sKeFZgzE&rel=0&modestbranding=1',
    observedNote: 'Precision on-site carpenter routing and custom detail fitting for interior panels.',
    location: 'Bengaluru Site',
  },
  {
    id: 'yt-short-8',
    youtubeId: '10p9C91PREo',
    title: 'Wardrobe Frame & Hardware Assembly',
    category: 'wardrobes',
    categoryLabel: 'Wardrobe Fitting',
    duration: '0:25',
    views: '1.1K',
    thumbnail: 'https://i.ytimg.com/vi/10p9C91PREo/hqdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/shorts/10p9C91PREo',
    embedUrl: 'https://www.youtube-nocookie.com/embed/10p9C91PREo?autoplay=1&loop=1&playlist=10p9C91PREo&rel=0&modestbranding=1',
    observedNote: 'Hinge mounting and door shutter movement testing on fitted bedroom wardrobe.',
    location: 'Bengaluru Site',
  },
];
