# Gallery Assets

Place your images and videos in this folder to display them in the gallery.

## Supported formats:
- Images: JPG, PNG, GIF, WebP
- Videos: MP4, WebM

## How to add items:

1. Place your image/video files in this folder
2. Edit the `galleryItems` array in `gallery/index.html` to include your files:

```javascript
const galleryItems = [
  { type: 'image', src: './assets/your-image.jpg', title: 'Your Title', desc: 'Your description' },
  { type: 'video', src: './assets/your-video.mp4', title: 'Your Video', desc: 'Your description' },
];
```

## Example:

```javascript
const galleryItems = [
  { 
    type: 'image', 
    src: './assets/funny-moment-1.jpg', 
    title: 'Funny Moment 1', 
    desc: 'Eerste grappige moment' 
  },
  { 
    type: 'video', 
    src: './assets/funny-video-1.mp4', 
    title: 'Funny Video 1', 
    desc: 'Eerste grappige video' 
  },
];
```

All files are stored locally and can be copied or downloaded directly from the gallery.