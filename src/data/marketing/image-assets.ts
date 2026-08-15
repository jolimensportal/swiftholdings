import type { ImageMetadata } from 'astro';
import architectureGalleryJpeg from '@images/marketing/architecture-gallery.jpg';
import architectureGalleryWebp from '@images/marketing/architecture-gallery.webp';
import briefingCloseJpeg from '@images/marketing/briefing-close.jpg';
import briefingCloseWebp from '@images/marketing/briefing-close.webp';
import confidenceFeatureJpeg from '@images/marketing/confidence-feature.jpg';
import confidenceFeatureWebp from '@images/marketing/confidence-feature.webp';
import diasporaLifestyleJpeg from '@images/marketing/diaspora-lifestyle.jpg';
import diasporaLifestyleWebp from '@images/marketing/diaspora-lifestyle.webp';
import duskCtaDesktopJpeg from '@images/marketing/dusk-cta-desktop.jpg';
import duskCtaDesktopWebp from '@images/marketing/dusk-cta-desktop.webp';
import duskCtaMobileJpeg from '@images/marketing/dusk-cta-mobile.jpg';
import duskCtaMobileWebp from '@images/marketing/dusk-cta-mobile.webp';
import homeDetailJpeg from '@images/marketing/home-detail.jpg';
import homeDetailWebp from '@images/marketing/home-detail.webp';
import homeHeroDesktopJpeg from '@images/marketing/home-hero-desktop.jpg';
import homeHeroDesktopWebp from '@images/marketing/home-hero-desktop.webp';
import homeHeroMobileJpeg from '@images/marketing/home-hero-mobile.jpg';
import homeHeroMobileWebp from '@images/marketing/home-hero-mobile.webp';
import ownershipPageJpeg from '@images/marketing/ownership-page.jpg';
import ownershipPageWebp from '@images/marketing/ownership-page.webp';
import ownershipStoryJpeg from '@images/marketing/ownership-story.jpg';
import ownershipStoryWebp from '@images/marketing/ownership-story.webp';
import villageBannerJpeg from '@images/marketing/village-banner.jpg';
import villageBannerWebp from '@images/marketing/village-banner.webp';
import villageStoryJpeg from '@images/marketing/village-story.jpg';
import villageStoryWebp from '@images/marketing/village-story.webp';
import warmDetailJpeg from '@images/marketing/warm-detail.jpg';
import warmDetailWebp from '@images/marketing/warm-detail.webp';

export interface MarketingImageAsset {
  alt: string;
  label: 'Illustrative reference';
  desktop: { jpeg: ImageMetadata; webp: ImageMetadata };
  mobile?: { jpeg: ImageMetadata; webp: ImageMetadata };
}

export const marketingImages = {
  homeHero: {
    alt: 'Illustrative reference of a contemporary prefab residence at dusk',
    label: 'Illustrative reference',
    desktop: { jpeg: homeHeroDesktopJpeg, webp: homeHeroDesktopWebp },
    mobile: { jpeg: homeHeroMobileJpeg, webp: homeHeroMobileWebp },
  },
  villageStory: {
    alt: 'Illustrative reference of a warm contemporary prefab residence',
    label: 'Illustrative reference',
    desktop: { jpeg: villageStoryJpeg, webp: villageStoryWebp },
  },
  ownershipStory: {
    alt: 'Illustrative reference of a modern modular home in a natural setting',
    label: 'Illustrative reference',
    desktop: { jpeg: ownershipStoryJpeg, webp: ownershipStoryWebp },
  },
  diasporaLifestyle: {
    alt: 'Illustrative reference of a covered outdoor living space at a prefab home',
    label: 'Illustrative reference',
    desktop: { jpeg: diasporaLifestyleJpeg, webp: diasporaLifestyleWebp },
  },
  villageBanner: {
    alt: 'Illustrative reference of a low-profile prefab residence in evening light',
    label: 'Illustrative reference',
    desktop: { jpeg: villageBannerJpeg, webp: villageBannerWebp },
  },
  homeDetail: {
    alt: 'Illustrative reference of a compact timber prefab home',
    label: 'Illustrative reference',
    desktop: { jpeg: homeDetailJpeg, webp: homeDetailWebp },
  },
  confidenceFeature: {
    alt: 'Illustrative reference of a modern prefab residence with a broad roofline',
    label: 'Illustrative reference',
    desktop: { jpeg: confidenceFeatureJpeg, webp: confidenceFeatureWebp },
  },
  ownershipPage: {
    alt: 'Illustrative reference of a multi-level contemporary prefab residence',
    label: 'Illustrative reference',
    desktop: { jpeg: ownershipPageJpeg, webp: ownershipPageWebp },
  },
  architectureGallery: {
    alt: 'Illustrative reference of a glass-fronted prefab home',
    label: 'Illustrative reference',
    desktop: { jpeg: architectureGalleryJpeg, webp: architectureGalleryWebp },
  },
  warmDetail: {
    alt: 'Illustrative reference of a warm contemporary prefab exterior',
    label: 'Illustrative reference',
    desktop: { jpeg: warmDetailJpeg, webp: warmDetailWebp },
  },
  duskCta: {
    alt: 'Illustrative reference of a welcoming prefab home at dusk',
    label: 'Illustrative reference',
    desktop: { jpeg: duskCtaDesktopJpeg, webp: duskCtaDesktopWebp },
    mobile: { jpeg: duskCtaMobileJpeg, webp: duskCtaMobileWebp },
  },
  briefingClose: {
    alt: 'Illustrative reference of a landscaped prefab residence',
    label: 'Illustrative reference',
    desktop: { jpeg: briefingCloseJpeg, webp: briefingCloseWebp },
  },
} satisfies Record<string, MarketingImageAsset>;
